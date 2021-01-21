import BScroll from '@better-scroll/core'
import { IndicatorOptions, Ratio, Postion } from './types'
import {
  EventRegister,
  EventEmitter,
  getRect,
  getClientSize,
  getNow,
  between,
  Probe,
  TouchEvent,
  style,
} from '@better-scroll/shared-utils'
const resolveRatioOption = (ratioConfig?: Ratio) => {
  let ret = {
    ratioX: 0,
    ratioY: 0,
  }
  if (!ratioConfig) {
    return ret
  }
  if (typeof ratioConfig === 'number') {
    ret.ratioX = ret.ratioY = ratioConfig
  } else if (typeof ratioConfig === 'object' && ratioConfig) {
    ret.ratioX = ratioConfig.x || 0
    ret.ratioY = ratioConfig.y || 0
  }
  return ret
}

const handleBubbleAndCancelable = (e: TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
}
export default class Indicator {
  wrapper: HTMLElement
  indicatorEl: HTMLElement
  maxScrollX: number
  minScrollX: number
  ratioX: number
  maxScrollY: number
  minScrollY: number
  ratioY: number
  currentPos: Postion
  moved: boolean
  startTime: number
  initiated: boolean
  lastPointX: number
  lastPointY: number
  startEventRegister: EventRegister
  moveEventRegister: EventRegister
  endEventRegister: EventRegister
  hooksFn: [EventEmitter, string, Function][] = []
  constructor(public scroll: BScroll, public options: IndicatorOptions) {
    this.wrapper = options.relationElement
    this.indicatorEl = this.wrapper.children[0] as HTMLElement
    this.handleHooks()
    this.handleInteractive()
  }

  private handleHooks() {
    const scroll = this.scroll
    const scrollHooks = scroll.hooks
    const translaterHooks = scroll.scroller.translater.hooks

    this.registerHooks(
      scrollHooks,
      scrollHooks.eventTypes.refresh,
      this.refresh
    )

    this.registerHooks(
      translaterHooks,
      translaterHooks.eventTypes.translate,
      (pos: Postion) => {
        this.updatePosition(pos)
      }
    )
  }

  private handleInteractive() {
    if (this.options.interactive !== false) {
      this.registerEvents()
    }
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  private registerEvents() {
    const { disableMouse, disableTouch } = this.scroll.options
    const startEvents = []
    const moveEvents = []
    const endEvents = []

    if (!disableMouse) {
      startEvents.push({
        name: 'mousedown',
        handler: this.start.bind(this),
      })

      moveEvents.push({
        name: 'mousemove',
        handler: this.move.bind(this),
      })

      endEvents.push({
        name: 'mouseup',
        handler: this.end.bind(this),
      })
    }

    if (!disableTouch) {
      startEvents.push({
        name: 'touchstart',
        handler: this.start.bind(this),
      })

      moveEvents.push({
        name: 'touchmove',
        handler: this.move.bind(this),
      })

      endEvents.push({
        name: 'touchend',
        handler: this.end.bind(this),
      })
    }

    this.startEventRegister = new EventRegister(this.indicatorEl, startEvents)
    this.moveEventRegister = new EventRegister(window, moveEvents)
    this.endEventRegister = new EventRegister(window, endEvents)
  }

  refresh() {
    const {
      x,
      y,
      hasHorizontalScroll,
      hasVerticalScroll,
      scrollerWidth,
      scrollerHeight,
    } = this.scroll
    const { ratioX, ratioY } = resolveRatioOption(this.options.ratio)
    const { width: wrapperWidth, height: wrapperHeight } = getClientSize(
      this.wrapper
    )
    const { width: indicatorWidth, height: indicatorHeight } = getRect(
      this.indicatorEl
    )
    if (hasHorizontalScroll) {
      this.maxScrollX = wrapperWidth - indicatorWidth
      this.minScrollX = 0
      this.ratioX = ratioX ? ratioX : this.maxScrollX / scrollerWidth
    }

    if (hasVerticalScroll) {
      this.maxScrollY = wrapperHeight - indicatorHeight
      this.minScrollY = 0
      this.ratioY = ratioY ? ratioY : this.maxScrollY / scrollerHeight
    }

    this.updatePosition({
      x,
      y,
    })
  }

  private start(e: TouchEvent) {
    if (this.BScrollIsDisabled()) {
      return
    }
    let point = (e.touches ? e.touches[0] : e) as Touch

    handleBubbleAndCancelable(e)

    this.initiated = true
    this.moved = false
    this.lastPointX = point.pageX
    this.lastPointY = point.pageY
    this.startTime = getNow()
    this.scroll.scroller.hooks.trigger(
      this.scroll.scroller.hooks.eventTypes.beforeScrollStart
    )
  }

  private BScrollIsDisabled() {
    return !this.scroll.enabled
  }

  private move(e: TouchEvent) {
    if (!this.initiated) {
      return
    }
    let point = (e.touches ? e.touches[0] : e) as Touch
    const pointX = point.pageX
    const pointY = point.pageY

    handleBubbleAndCancelable(e)

    let deltaX = pointX - this.lastPointX
    let deltaY = pointY - this.lastPointY
    this.lastPointX = pointX
    this.lastPointY = pointY
    if (!this.moved && !this.indicatorNotMoved(deltaX, deltaY)) {
      this.moved = true
      this.scroll.scroller.hooks.trigger(
        this.scroll.scroller.hooks.eventTypes.scrollStart
      )
    }

    if (this.moved) {
      const newPos = this.getBScrollPosByRatio(this.currentPos, deltaX, deltaY)
      this.syncBScroll(newPos)
    }
  }

  private end(e: TouchEvent) {
    if (!this.initiated) {
      return
    }
    this.initiated = false

    handleBubbleAndCancelable(e)

    if (this.moved) {
      const { x, y } = this.scroll
      this.scroll.scroller.hooks.trigger(
        this.scroll.scroller.hooks.eventTypes.scrollEnd,
        {
          x,
          y,
        }
      )
    }
  }

  private getBScrollPosByRatio(
    currentPos: Postion,
    deltaX: number,
    deltaY: number
  ) {
    const { x: currentX, y: currentY } = currentPos

    const {
      hasHorizontalScroll,
      hasVerticalScroll,
      minScrollX: BScrollMinScrollX,
      maxScrollX: BScrollMaxScrollX,
      minScrollY: BScrollMinScrollY,
      maxScrollY: BScrollMaxScrollY,
    } = this.scroll

    let { x, y } = this.scroll

    if (hasHorizontalScroll) {
      const newPosX = between(
        currentX + deltaX,
        this.minScrollX,
        this.maxScrollX
      )
      x = between(
        Math.round(newPosX / this.ratioX),
        BScrollMaxScrollX,
        BScrollMinScrollX
      )
    }

    if (hasVerticalScroll) {
      const newPosY = between(
        currentY + deltaY,
        this.minScrollY,
        this.maxScrollY
      )
      y = between(
        Math.round(newPosY / this.ratioY),
        BScrollMinScrollY,
        BScrollMaxScrollY
      )
    }
    return { x, y }
  }

  private indicatorNotMoved(deltaX: number, deltaY: number): boolean {
    const { x, y } = this.currentPos
    const xNotMoved =
      (x === this.minScrollX && deltaX <= 0) ||
      (x === this.maxScrollX && deltaX >= 0)
    const yNotMoved =
      (y === this.minScrollY && deltaY <= 0) ||
      (y === this.maxScrollY && deltaY >= 0)
    return xNotMoved && yNotMoved
  }

  private syncBScroll(newPos: Postion) {
    const timestamp = getNow()
    const { options, scroller } = this.scroll
    const { probeType, momentumLimitTime } = options
    scroller.translater.translate(newPos)

    // dispatch scroll in interval time
    if (timestamp - this.startTime > momentumLimitTime) {
      this.startTime = timestamp
      if (probeType === Probe.Throttle) {
        scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, newPos)
      }
    }

    // dispatch scroll all the time
    if (probeType > Probe.Throttle) {
      scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, newPos)
    }
  }

  updatePosition(BScrollPos: Postion) {
    const newIndicatorPos = this.getIndicatorPosByRatio(BScrollPos)
    this.applyTransformProperty(newIndicatorPos)
    this.currentPos = { ...newIndicatorPos }
  }

  private applyTransformProperty(pos: Postion) {
    const translateZ = this.scroll.options.translateZ
    const transformProperties = [
      `translateX(${pos.x})px`,
      `translateY(${pos.y})px`,
      `${translateZ}`,
    ]

    this.indicatorEl.style[style.transform as any] = transformProperties.join(
      ''
    )
  }

  private getIndicatorPosByRatio(BScrollPos: Postion) {
    const { x, y } = BScrollPos
    const { hasHorizontalScroll, hasVerticalScroll } = this.scroll
    const position = { ...this.currentPos }

    if (hasHorizontalScroll) {
      position.x = between(
        Math.round(this.ratioX * x),
        this.minScrollX,
        this.maxScrollX
      )
    }

    if (hasVerticalScroll) {
      position.y = between(
        Math.round(this.ratioY * y),
        this.minScrollY,
        this.maxScrollY
      )
    }

    return position
  }

  destroy() {}
}
