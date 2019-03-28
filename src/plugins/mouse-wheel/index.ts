import BScroll from '../../index'
import { staticImplements, PluginCtor } from '../type'
import EventRegister from '../../base/EventRegister'
import { preventDefaultExceptionFn } from '../../util/dom'
import { fixInboundValue } from '../../util/lang'
import EventEmitter from '../../base/EventEmitter'
import { Direction } from '../../enums/direction'
export type mouseWheelOptions = Partial<MouseWheelConfig> | boolean | undefined
export interface MouseWheelConfig {
  speed?: number
  invert?: boolean
  easeTime?: number
  throttle?: number
  debounce?: number
}

declare module '../../Options' {
  interface Options {
    /**
     * for mouse wheel
     * mouseWheel: {
     *   speed: 20,
     *   invert: false,
     *   easeTime: 0,
     *   debounce: 0,
     *   throttle: 400
     * }
     */
    mouseWheel?: mouseWheelOptions
  }
}

interface CompatibleWheelEvent extends WheelEvent {
  pageX: number
  pageY: number
  readonly wheelDeltaX: number
  readonly wheelDeltaY: number
  readonly wheelDelta: number
}

@staticImplements<PluginCtor>()
export default class MouseWheel {
  static pluginName = 'mouseWheel'
  static initOrder = -1
  hooks: EventEmitter
  private mouseWheelOpt: Partial<MouseWheelConfig>
  private eventRegistor: EventRegister
  private wheelEndTimer: number
  private wheelMoveTimer: number
  private wheelStart = false
  private deltaCache: { x: number; y: number }[]
  constructor(public scroll: BScroll) {
    scroll.registerType(['mousewheelMove', 'mousewheelStart', 'mousewheelEnd'])
    this.mouseWheelOpt = scroll.options.mouseWheel as Partial<MouseWheelConfig>
    this.deltaCache = []
    this.registorEvent()
  }
  destroy() {
    this.eventRegistor.destroy()
    window.clearTimeout(this.wheelEndTimer)
    window.clearTimeout(this.wheelMoveTimer)
  }
  private registorEvent() {
    this.eventRegistor = new EventRegister(this.scroll.scroller.wrapper, [
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
  private wheelHandler(e: CompatibleWheelEvent) {
    e.preventDefault()
    // start
    if (!this.wheelStart) {
      this.wheelStartHandler(e)
      this.wheelStart = true
    }
    // move
    const delta = this.getWheelDelta(e)
    this.wheelMove(delta)
    // end
    this.wheelStopDetactor(e, delta)
  }
  private wheelStartHandler(e: CompatibleWheelEvent) {
    this.beforeHandler(e)
    this.deltaCache = []
    this.scroll.trigger(this.scroll.eventTypes.mousewheelStart)
  }
  private wheelStopDetactor(
    e: CompatibleWheelEvent,
    delta: { x: number; y: number }
  ) {
    window.clearTimeout(this.wheelEndTimer)
    const delayTime = this.mouseWheelOpt.throttle || 400
    this.wheelEndTimer = window.setTimeout(() => {
      this.wheelStart = false
      window.clearTimeout(this.wheelMoveTimer)
      this.wheelMoveTimer = 0
      this.scroll.trigger(this.scroll.eventTypes.mousewheelEnd, delta)
    }, delayTime)
  }
  private getWheelDelta(e: CompatibleWheelEvent) {
    const { speed = 20, invert = false, easeTime = 300 } = this.mouseWheelOpt
    let wheelDeltaX = 0
    let wheelDeltaY = 0
    let direction = invert ? Direction.Negative : Direction.Positive
    switch (true) {
      case 'deltaX' in e:
        if (e.deltaMode === 1) {
          wheelDeltaX = -e.deltaX
          wheelDeltaY = -e.deltaY
        } else {
          wheelDeltaX = -e.deltaX * speed
          wheelDeltaY = -e.deltaY * speed
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

    if (!this.scroll.scroller.scrollBehaviorY.hasScroll) {
      wheelDeltaX = wheelDeltaY
      wheelDeltaY = 0
    }
    if (!this.scroll.scroller.scrollBehaviorX.hasScroll) {
      wheelDeltaX = 0
    }

    const directionX =
      wheelDeltaX > 0
        ? Direction.Negative
        : wheelDeltaX < 0
        ? Direction.Positive
        : 0
    const directionY =
      wheelDeltaY > 0
        ? Direction.Negative
        : wheelDeltaY < 0
        ? Direction.Positive
        : 0
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
  private wheelMove(delta: { x: number; y: number }) {
    if (this.mouseWheelOpt.debounce && this.wheelMoveTimer) {
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
      this.deltaCache = []
      let newX = this.scroll.x + Math.round(delta.x) + cachedDelta.x
      let newY = this.scroll.y + Math.round(delta.y) + cachedDelta.y
      const scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
      const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
      newX = fixInboundValue(
        newX,
        scrollBehaviorX.maxScrollPos,
        scrollBehaviorX.minScrollPos
      )
      newY = fixInboundValue(
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
        const easeTime = this.mouseWheelOpt.easeTime || 0
        this.scroll.scrollTo(newX, newY, easeTime)
      }
      if (this.mouseWheelOpt.debounce) {
        this.wheelMoveTimer = window.setTimeout(() => {
          this.wheelMoveTimer = 0
        }, this.mouseWheelOpt.debounce)
      }
    }
  }
}
