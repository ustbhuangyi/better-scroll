import BScroll from '@better-scroll/core'
import {
  TouchEvent,
  EventRegister,
  EventEmitter,
} from '@better-scroll/shared-utils'
import Indicator from './indicator'

interface EventHandlerOptions {
  disableMouse: boolean
  disableTouch: boolean
}

export default class EventHandler {
  public startEventRegister: EventRegister
  public moveEventRegister: EventRegister
  public endEventRegister: EventRegister
  public initiated: boolean
  private lastPoint: number
  public scroll: BScroll
  public hooks: EventEmitter

  constructor(
    public indicator: Indicator,
    public options: EventHandlerOptions
  ) {
    this.scroll = indicator.scroll
    this.hooks = new EventEmitter(['touchStart', 'touchMove', 'touchEnd'])
    this.registerEvents()
  }
  private registerEvents() {
    const { disableMouse, disableTouch } = this.options
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

    this.startEventRegister = new EventRegister(
      this.indicator.indicatorEl,
      startEvents
    )
    this.moveEventRegister = new EventRegister(window, moveEvents)
    this.endEventRegister = new EventRegister(window, endEvents)
  }

  private BScrollIsDisabled() {
    return !this.scroll.enabled
  }

  private start(e: TouchEvent) {
    if (this.BScrollIsDisabled()) {
      return
    }
    let point = (e.touches ? e.touches[0] : e) as Touch

    e.preventDefault()
    e.stopPropagation()

    this.initiated = true
    this.lastPoint = point[this.indicator.keysMap.point]
    this.hooks.trigger(this.hooks.eventTypes.touchStart)
  }

  private move(e: TouchEvent) {
    if (!this.initiated) {
      return
    }
    let point = (e.touches ? e.touches[0] : e) as Touch
    const pointPos = point[this.indicator.keysMap.point]

    e.preventDefault()
    e.stopPropagation()

    let delta = pointPos - this.lastPoint
    this.lastPoint = pointPos
    this.hooks.trigger(this.hooks.eventTypes.touchMove, delta)
  }

  private end(e: TouchEvent) {
    if (!this.initiated) {
      return
    }
    this.initiated = false

    e.preventDefault()
    e.stopPropagation()

    this.hooks.trigger(this.hooks.eventTypes.touchEnd)
  }

  destroy() {
    this.startEventRegister.destroy()
    this.moveEventRegister.destroy()
    this.endEventRegister.destroy()
  }
}
