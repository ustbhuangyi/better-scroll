import BScroll from '@better-scroll/core'
import {
  warn,
  preventDefaultExceptionFn,
  between,
  EventRegister,
  EventEmitter,
  Direction,
  ApplyOrder,
  extend
} from '@better-scroll/shared-utils'

export interface MouseWheelOptions {
  speed: number
  invert: boolean
  easeTime: number
  discreteTime: number
  throttleTime: number
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    mouseWheel?: Partial<MouseWheelOptions>
  }
}

interface CompatibleWheelEvent extends WheelEvent {
  pageX: number
  pageY: number
  readonly wheelDeltaX: number
  readonly wheelDeltaY: number
  readonly wheelDelta: number
}

interface WheelDelta {
  x: number
  y: number
  directionX: Direction
  directionY: Direction
}

export default class MouseWheel {
  static pluginName = 'mouseWheel'
  static applyOrder = ApplyOrder.Pre
  mouseWheelOpt: MouseWheelOptions
  private eventRegister: EventRegister
  private wheelEndTimer: number = 0
  private wheelMoveTimer: number = 0
  private wheelStart = false
  private deltaCache: { x: number; y: number }[]
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.init()
  }

  private init() {
    this.handleBScroll()
    this.handleOptions()

    this.registerEvent()

    this.hooksFn = []
    this.registerHooks(this.scroll.hooks, 'destroy', this.destroy)
  }

  private handleBScroll() {
    this.scroll.registerType([
      'mousewheelStart',
      'mousewheelMove',
      'mousewheelEnd'
    ])
  }

  private handleOptions() {
    const userOptions =
      this.scroll.options.mouseWheel === true
        ? {}
        : this.scroll.options.mouseWheel
    const defaultOptions: MouseWheelOptions = {
      speed: 20,
      invert: false,
      easeTime: 300,
      discreteTime: 400,
      throttleTime: 0
    }
    this.mouseWheelOpt = extend(defaultOptions, userOptions)
  }

  private registerEvent() {
    this.eventRegister = new EventRegister(this.scroll.scroller.wrapper, [
      {
        name: 'wheel',
        handler: this.wheelHandler.bind(this)
      },
      {
        name: 'mousewheel',
        handler: this.wheelHandler.bind(this)
      },
      {
        name: 'DOMMouseScroll', // FireFox
        handler: this.wheelHandler.bind(this)
      }
    ])
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  private wheelHandler(e: CompatibleWheelEvent) {
    if (!this.scroll.enabled) {
      return
    }
    this.beforeHandler(e)

    // start
    if (!this.wheelStart) {
      this.wheelStartHandler(e)
      this.wheelStart = true
    }

    // move
    const delta = this.getWheelDelta(e)
    this.wheelMoveHandler(delta)

    // end
    this.wheelEndDetector(e, delta)
  }

  private wheelStartHandler(e: CompatibleWheelEvent) {
    this.cleanCache()
    this.scroll.trigger(this.scroll.eventTypes.mousewheelStart)
  }

  private cleanCache() {
    this.deltaCache = []
  }

  private wheelMoveHandler(delta: {
    x: number
    y: number
    directionX: number
    directionY: number
  }) {
    if (this.mouseWheelOpt.throttleTime && this.wheelMoveTimer) {
      this.deltaCache.push(delta)
    } else {
      const cachedDelta = this.deltaCache.reduce(
        (prev, current) => {
          return {
            x: prev.x + current.x,
            y: prev.y + current.y
          }
        },
        { x: 0, y: 0 }
      )

      this.cleanCache()
      let newX = this.scroll.x + Math.round(delta.x) + cachedDelta.x
      let newY = this.scroll.y + Math.round(delta.y) + cachedDelta.y

      const scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
      const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
      scrollBehaviorX.movingDirection =
        delta.directionX > 0
          ? Direction.Positive
          : delta.directionX < 0
          ? Direction.Negative
          : Direction.Default
      scrollBehaviorY.movingDirection =
        delta.directionY > 0
          ? Direction.Positive
          : delta.directionY < 0
          ? Direction.Negative
          : Direction.Default

      newX = between(
        newX,
        scrollBehaviorX.maxScrollPos,
        scrollBehaviorX.minScrollPos
      )
      newY = between(
        newY,
        scrollBehaviorY.maxScrollPos,
        scrollBehaviorY.minScrollPos
      )

      if (
        !this.scroll.trigger(this.scroll.eventTypes.mousewheelMove, {
          x: newX,
          y: newY
        })
      ) {
        const easeTime = this.getEaseTime()
        if (newX !== this.scroll.x || newY !== this.scroll.y) {
          this.scroll.scrollTo(newX, newY, easeTime)
        }
      }
      if (this.mouseWheelOpt.throttleTime) {
        this.wheelMoveTimer = window.setTimeout(() => {
          this.wheelMoveTimer = 0
        }, this.mouseWheelOpt.throttleTime)
      }
    }
  }

  private wheelEndDetector(
    e: CompatibleWheelEvent,
    delta: { x: number; y: number }
  ) {
    window.clearTimeout(this.wheelEndTimer)
    this.wheelEndTimer = window.setTimeout(() => {
      this.wheelStart = false
      window.clearTimeout(this.wheelMoveTimer)
      this.wheelMoveTimer = 0
      this.scroll.scroller.scrollBehaviorX.movingDirection = 0
      this.scroll.scroller.scrollBehaviorY.movingDirection = 0
      this.scroll.trigger(this.scroll.eventTypes.mousewheelEnd, delta)
    }, this.mouseWheelOpt.discreteTime)
  }

  private getWheelDelta(e: CompatibleWheelEvent): WheelDelta {
    const { speed, invert } = this.mouseWheelOpt
    let wheelDeltaX = 0
    let wheelDeltaY = 0
    let direction = invert ? Direction.Negative : Direction.Positive
    switch (true) {
      case 'deltaX' in e:
        if (e.deltaMode === 1) {
          wheelDeltaX = -e.deltaX * speed
          wheelDeltaY = -e.deltaY * speed
        } else {
          wheelDeltaX = -e.deltaX
          wheelDeltaY = -e.deltaY
        }
        break
      case 'wheelDeltaX' in e:
        wheelDeltaX = (e.wheelDeltaX / 120) * speed
        wheelDeltaY = (e.wheelDeltaY / 120) * speed
        break
      case 'wheelDelta' in e:
        wheelDeltaX = wheelDeltaY = (e.wheelDelta / 120) * speed
        break
      case 'detail' in e:
        wheelDeltaX = wheelDeltaY = (-e.detail / 3) * speed
        break
    }
    wheelDeltaX *= direction
    wheelDeltaY *= direction

    if (!this.scroll.hasVerticalScroll) {
      wheelDeltaX = wheelDeltaY
      wheelDeltaY = 0
    }
    if (!this.scroll.hasHorizontalScroll) {
      wheelDeltaX = 0
    }

    const directionX =
      wheelDeltaX > 0
        ? Direction.Negative
        : wheelDeltaX < 0
        ? Direction.Positive
        : Direction.Default
    const directionY =
      wheelDeltaY > 0
        ? Direction.Negative
        : wheelDeltaY < 0
        ? Direction.Positive
        : Direction.Default
    return {
      x: wheelDeltaX,
      y: wheelDeltaY,
      directionX,
      directionY
    }
  }

  private beforeHandler(e: CompatibleWheelEvent) {
    const {
      preventDefault,
      stopPropagation,
      preventDefaultException
    } = this.scroll.options
    if (
      preventDefault &&
      !preventDefaultExceptionFn(e.target, preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (stopPropagation) {
      e.stopPropagation()
    }
  }

  private getEaseTime() {
    const SAFE_EASETIME = 100
    const easeTime = this.mouseWheelOpt.easeTime
    // scrollEnd event will be triggered in every calling of scrollTo when easeTime is too small
    // easeTime needs to be greater than 100
    if (easeTime < SAFE_EASETIME) {
      warn(
        `easeTime should be greater than 100.` +
          `If mouseWheel easeTime is too small,` +
          `scrollEnd will be triggered many times.`
      )
    }
    return Math.max(easeTime, SAFE_EASETIME)
  }

  destroy() {
    this.eventRegister.destroy()

    window.clearTimeout(this.wheelEndTimer)
    window.clearTimeout(this.wheelMoveTimer)

    this.hooksFn.forEach(item => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
  }
}
