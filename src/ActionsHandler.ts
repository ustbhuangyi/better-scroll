import BScroll from './index'
import Options, { bounceConfig } from './Options'

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
  // const
  DIRECTION_DOWN,
  DIRECTION_UP,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
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
  options: Options
  initiated: number | boolean
  moved: boolean
  distX: number
  distY: number
  directionX: number
  directionY: number
  movingDirectionX: number
  movingDirectionY: number
  directionLocked: number | string
  startX: number
  startY: number
  absStartX: number
  absStartY: number
  pointX: number
  pointY: number
  resizeTimeout: number
  startTime: number
  endTime: number
  constructor(public bs: BScroll) {
    this.options = bs.options
    this.addDOMEvents()
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
        this.bs.trigger('actionsStart')
        break
      case 'touchmove':
      case 'mousemove':
        if (this.bs.trigger('actionsContinuing') === false) return
        this.move(e)
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        if (this.bs.trigger('actionsEnd') === false) return
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

    const { enabled, destroyed, x, y, scroller } = this.bs

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

    this.moved = false
    this.distX = 0
    this.distY = 0
    this.directionX = 0
    this.directionY = 0
    this.movingDirectionX = 0
    this.movingDirectionY = 0
    this.directionLocked = 0

    scroller.transitionTime()
    this.startTime = getNow()

    scroller.stop()

    let point = (e.touches ? e.touches[0] : e) as Touch

    this.startX = x
    this.startY = y
    this.absStartX = x
    this.absStartY = y
    this.pointX = point.pageX
    this.pointY = point.pageY

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

    let point = (e.touches ? e.touches[0] : e) as Touch
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY

    this.pointX = point.pageX
    this.pointY = point.pageY

    this.distX += deltaX
    this.distY += deltaY

    let absDistX = Math.abs(this.distX)
    let absDistY = Math.abs(this.distY)

    let timestamp = getNow()

    const { momentumLimitTime, momentumLimitDistance } = this.options

    // We need to move at least momentumLimitDistance pixels for the scrolling to initiate
    if (
      timestamp - this.endTime > momentumLimitTime &&
      (absDistY < momentumLimitDistance && absDistX < momentumLimitDistance)
    ) {
      return
    }

    const {
      freeScroll,
      directionLockThreshold,
      eventPassthrough,
      probeType
    } = this.options

    // If you are scrolling in one direction lock the other
    if (!this.directionLocked && !freeScroll) {
      if (absDistX > absDistY + directionLockThreshold) {
        this.directionLocked = 'h' // lock horizontally
      } else if (absDistY >= absDistX + directionLockThreshold) {
        this.directionLocked = 'v' // lock vertically
      } else {
        this.directionLocked = 'n' // no lock
      }
    }

    if (this.directionLocked === 'h') {
      if (eventPassthrough === 'vertical') {
        e.preventDefault()
      } else if (eventPassthrough === 'horizontal') {
        this.initiated = false
        return
      }
      deltaY = 0
    } else if (this.directionLocked === 'v') {
      if (eventPassthrough === 'horizontal') {
        e.preventDefault()
      } else if (eventPassthrough === 'vertical') {
        this.initiated = false
        return
      }
      deltaX = 0
    }

    const {
      hasHorizontalScroll,
      hasVerticalScroll,
      minScrollX,
      maxScrollX,
      minScrollY,
      maxScrollY,
      x,
      y,
      scroller
    } = this.bs

    deltaX = hasHorizontalScroll ? deltaX : 0
    deltaY = hasVerticalScroll ? deltaY : 0
    this.movingDirectionX =
      deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0
    this.movingDirectionY =
      deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0

    let newX = x + deltaX
    let newY = y + deltaY

    let top = false
    let bottom = false
    let left = false
    let right = false

    // whether to allow bounce scroll when outside of boundary
    const bounce = this.options.bounce as Partial<bounceConfig>
    if (bounce !== false) {
      top = bounce.top === undefined ? true : bounce.top
      bottom = bounce.bottom === undefined ? true : bounce.bottom
      left = bounce.left === undefined ? true : bounce.left
      right = bounce.right === undefined ? true : bounce.right
    }
    // Slow down or stop if outside of the boundaries
    if (newX > minScrollX || newX < maxScrollX) {
      if ((newX > minScrollX && left) || (newX < maxScrollX && right)) {
        newX = x + deltaX / 3
      } else {
        newX = newX > minScrollX ? minScrollX : maxScrollX
      }
    }
    if (newY > minScrollY || newY < maxScrollY) {
      if ((newY > minScrollY && top) || (newY < maxScrollY && bottom)) {
        newY = y + deltaY / 3
      } else {
        newY = newY > minScrollY ? minScrollY : maxScrollY
      }
    }

    if (!this.moved) {
      this.moved = true
      this.bs.trigger('scrollStart')
    }

    scroller.translate(newX, newY)

    const { x: changedX, y: changedY } = this.bs

    // dispatch scroll in interval time
    if (timestamp - this.startTime > momentumLimitTime) {
      this.startTime = timestamp
      this.startX = changedX
      this.startY = changedY

      if (probeType === PROBE_THROTTLE) {
        this.bs.trigger('scroll', {
          x: changedX,
          y: changedY
        })
      }
    }

    // dispatch scroll in real time
    if (probeType > PROBE_THROTTLE) {
      this.bs.trigger('scroll', {
        x: changedX,
        y: changedY
      })
    }

    let scrollLeft =
      document.documentElement.scrollLeft ||
      window.pageXOffset ||
      document.body.scrollLeft
    let scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop

    let pX = this.pointX - scrollLeft
    let pY = this.pointY - scrollTop

    if (
      pX > document.documentElement.clientWidth - momentumLimitDistance ||
      pX < momentumLimitDistance ||
      pY < momentumLimitDistance ||
      pY > document.documentElement.clientHeight - momentumLimitDistance
    ) {
      this.end(e)
    }
  }
  private end(e: TouchEvent) {
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

    const { x, y } = this.bs
    this.bs.trigger('touchEnd', {
      x,
      y
    })

    this.bs.isInTransition = false

    // ensures that the last position is rounded
    let newX = Math.round(x)
    let newY = Math.round(y)

    let deltaX = newX - this.absStartX
    let deltaY = newY - this.absStartY
    this.directionX =
      deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0
    this.directionY =
      deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0

    if (this.bs.trigger('beforeCheckClick') === false) {
      return
    }

    // check if it is a click operation
    if (this.checkClick(e)) {
      this.bs.trigger('scrollCancel')
      return
    }

    // reset if we are outside of the boundaries
    if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
      return
    }

    this._translate(newX, newY)

    this.endTime = getNow()
    let duration = this.endTime - this.startTime
    let absDistX = Math.abs(newX - this.startX)
    let absDistY = Math.abs(newY - this.startY)

    // flick
    if (
      duration < this.options.flickLimitTime &&
      absDistX < this.options.flickLimitDistance &&
      absDistY < this.options.flickLimitDistance
    ) {
      this.bs.trigger('flick')
      return
    }

    let time = 0
    // start momentum animation if needed
    if (
      this.options.momentum &&
      duration < this.options.momentumLimitTime &&
      (absDistY > this.options.momentumLimitDistance ||
        absDistX > this.options.momentumLimitDistance)
    ) {
      let top = false
      let bottom = false
      let left = false
      let right = false
      const bounce = this.options.bounce as Partial<bounceConfig>
      if (bounce !== false) {
        top = bounce.top === undefined ? true : bounce.top
        bottom = bounce.bottom === undefined ? true : bounce.bottom
        left = bounce.left === undefined ? true : bounce.left
        right = bounce.right === undefined ? true : bounce.right
      }
      const wrapperWidth =
        (this.directionX === DIRECTION_RIGHT && left) ||
        (this.directionX === DIRECTION_LEFT && right)
          ? this.wrapperWidth
          : 0
      const wrapperHeight =
        (this.directionY === DIRECTION_DOWN && top) ||
        (this.directionY === DIRECTION_UP && bottom)
          ? this.wrapperHeight
          : 0
      let momentumX = this.hasHorizontalScroll
        ? momentum(
            this.x,
            this.startX,
            duration,
            this.maxScrollX,
            this.minScrollX,
            wrapperWidth,
            this.options
          )
        : { destination: newX, duration: 0 }
      let momentumY = this.hasVerticalScroll
        ? momentum(
            this.y,
            this.startY,
            duration,
            this.maxScrollY,
            this.minScrollY,
            wrapperHeight,
            this.options
          )
        : { destination: newY, duration: 0 }
      newX = momentumX.destination
      newY = momentumY.destination
      time = Math.max(momentumX.duration, momentumY.duration)
      this.isInTransition = true
    } else {
      if (this.options.wheel) {
        newY = Math.round(newY / this.itemHeight) * this.itemHeight
        time = this.options.wheel.adjustTime || 400
      }
    }

    let easing = ease.swipe

    if (newX !== this.x || newY !== this.y) {
      // change easing function when scroller goes out of the boundaries
      if (
        newX > this.minScrollX ||
        newX < this.maxScrollX ||
        newY > this.minScrollY ||
        newY < this.maxScrollY
      ) {
        easing = ease.swipeBounce
      }
      this.scrollTo(newX, newY, time, easing)
      return
    }

    this.trigger('scrollEnd', {
      x: this.x,
      y: this.y
    })
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
    const { resizePolling } = this.options
    if (!enabled) {
      return
    }
    // fix a scroll problem under Android condition
    if (isAndroid) {
      ;(wrapper as HTMLElement).scrollTop = 0
    }
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = window.setTimeout(() => {
      this.bs.refresh()
    }, resizePolling)
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
