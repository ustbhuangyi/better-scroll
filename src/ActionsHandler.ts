import BScroll from './index'
import Options, { bounceConfig } from './Options'
import EventEmitter from './EventEmitter'

export interface TouchEvent extends UIEvent {
  touches: TouchList
  targetTouches: TouchList
  changedTouches: TouchList
  altKey: boolean
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  rotation: number
  scale: number
  button: number
  _constructed?: boolean
}

interface TouchList {
  length: number
  [index: number]: Touch
  item: (index: number) => Touch
}

interface Touch {
  identifier: number
  target: EventTarget
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
}

import {
  PROBE_THROTTLE,
  PROBE_REALTIME,
  // dom
  hasTouch,
  TOUCH_EVENT,
  style,
  addEvent,
  removeEvent,
  preventDefaultException,
  eventType,
  dblclick,
  click,
  tap,
  // ease
  ease,
  // lang
  getNow,
  // env
  isAndroid
} from './util'

export default class ActionsHandler {
  bs: BScroll
  options: Options
  hooks: EventEmitter
  initiated: number | boolean
  resizeTimeout: number
  constructor() {
    this.addDOMEvents()
  }

  apply(bs: BScroll) {
    this.bs = bs
    this.options = this.bs.options
  }

  private addDOMEvents() {
    let eventOperation = addEvent
    this.handleDOMEvents(eventOperation)
  }

  private removeDOMEvents() {
    let eventOperation = removeEvent
    this.handleDOMEvents(eventOperation)
  }

  private handleDOMEvents(eventOperation: Function) {
    const { wrapper, scrollElement } = this.bs
    const { bindToWrapper, click, disableMouse, disableTouch } = this.options
    let target = bindToWrapper ? wrapper : window
    eventOperation(window, 'orientationchange', this)
    eventOperation(window, 'resize', this)

    if (click) {
      eventOperation(wrapper, 'click', this, true)
    }

    if (!disableMouse) {
      eventOperation(wrapper, 'mousedown', this)
      eventOperation(target, 'mousemove', this)
      eventOperation(target, 'mousecancel', this)
      eventOperation(target, 'mouseup', this)
    }

    if (hasTouch && !disableTouch) {
      eventOperation(wrapper, 'touchstart', this)
      eventOperation(target, 'touchmove', this)
      eventOperation(target, 'touchcancel', this)
      eventOperation(target, 'touchend', this)
    }

    eventOperation(scrollElement, style.transitionEnd, this)
  }
  private handleEvent(e: TouchEvent) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this.start(e)
        this.hooks.trigger('actionsStart')
        break
      case 'touchmove':
      case 'mousemove':
        if (this.hooks.trigger('actionsContinuing') === true) return
        this.move(e)
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        if (this.hooks.trigger('actionsEnd') === true) return
        this.end(e)
        break
      case 'orientationchange':
      case 'resize':
        this.resize()
        break
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this.transitionEnd(e)
        break
      case 'click':
        if (this.bs.enabled && !e._constructed) {
          if (
            !preventDefaultException(
              e.target,
              this.options.preventDefaultException
            )
          ) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
    }
  }
  private start(e: TouchEvent) {
    const _eventType = eventType[e.type]

    const { enabled, destroyed } = this.bs

    const { preventDefault, stopPropagation } = this.options

    // not mouse left button
    if (_eventType !== TOUCH_EVENT && e.button !== 0) return

    if (
      !enabled ||
      destroyed ||
      (this.initiated && this.initiated !== _eventType)
    ) {
      return
    }
    this.initiated = _eventType

    if (
      preventDefault &&
      !preventDefaultException(e.target, this.options.preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (stopPropagation) {
      e.stopPropagation()
    }

    this.hooks.trigger('start')

    this.bs.trigger('beforeScrollStart')
  }
  private move(e: TouchEvent) {
    const { enabled, destroyed } = this.bs
    if (!enabled || destroyed || eventType[e.type] !== this.initiated) {
      return
    }

    if (
      this.options.preventDefault &&
      !preventDefaultException(e.target, this.options.preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (this.options.stopPropagation) {
      e.stopPropagation()
    }

    this.hooks.trigger('move', e, this)
  }
  end(e: TouchEvent) {
    const { enabled, destroyed } = this.bs
    if (!enabled || destroyed || eventType[e.type] !== this.initiated) {
      return
    }
    this.initiated = false

    const { preventDefault, stopPropagation } = this.options

    if (
      preventDefault &&
      !preventDefaultException(e.target, this.options.preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (stopPropagation) {
      e.stopPropagation()
    }

    this.hooks.trigger('end', this)
  }
  private checkClick(e: TouchEvent) {
    // when transition or animation is stopped manually
    let preventClick = this.bs.stopFromTransition
    this.bs.stopFromTransition = false

    // we scrolled less than momentumLimitDistance pixels
    if (!this.moved) {
      if (!preventClick) {
        if (this.options.tap) {
          tap(e, this.options.tap)
        }
        if (
          this.options.click &&
          !preventDefaultException(
            e.target,
            this.options.preventDefaultException
          )
        ) {
          click(e)
        }
        return true
      }
    }
    return false
  }
  private resize() {
    const { enabled, wrapper } = this.bs
    if (!enabled) return
    // fix a scroll problem under Android condition
    if (isAndroid) {
      ;(wrapper as HTMLElement).scrollTop = 0
    }
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = window.setTimeout(() => {
      this.bs.refresh()
    }, this.options.resizePolling)
  }
  private transitionEnd(e: Event) {
    const { isInTransition, scrollElement, scroller, x, y } = this.bs
    const { bounceTime, probeType } = this.options
    if (e.target !== scrollElement || !isInTransition) {
      return
    }

    scroller.transitionTime()
    // TODO pullup
    const needReset = this.movingDirectionY === DIRECTION_UP
    if (!scroller.resetPosition(bounceTime, ease.bounce)) {
      this.bs.isInTransition = false
      if (probeType !== PROBE_REALTIME) {
        this.bs.trigger('scrollEnd', {
          x,
          y
        })
      }
    }
  }
}
