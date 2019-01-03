import BScroll from '../index'
import Options from './options'

import {
  // const
  DIRECTION_DOWN,
  DIRECTION_UP,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  PROBE_DEBOUNCE,
  PROBE_REALTIME,
  // dom
  hasTouch,
  TOUCH_EVENT,
  style,
  addEvent,
  removeEvent,
  preventDefaultException,
  eventType,
  // ease
  ease,
  // lang
  getNow,
  // env
  isAndroid
} from '../util'

export default class Processor {
  options: Options
  initiated: number | boolean
  moved: boolean
  distX: number
  distY: number
  directionX: number
  directionY: number
  movingDirectionX: number
  movingDirectionY: number
  directionLocked: number
  resizeTimeout: number
  startTime: number
  constructor(public bs: BScroll) {
    this.options = bs.options
    this.init()
  }

  private init() {
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
    const { wrapper, scroller } = this.bs
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

    eventOperation(scroller, style.transitionEnd, this)
  }
  private handleEvent(e: Event) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this.start(e)
        this.bs.trigger('processStart')
        break
      case 'touchmove':
      case 'mousemove':
        if (this.bs.trigger('processContinuing')) break
        this.move(e)
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        if (this.bs.trigger('processEnd')) break
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
  private start(e: Event) {
    const _eventType = eventType[e.type]

    const { enabled, destroyed } = this.bs

    const {
      preventDefault,
      preventDefaultException,
      stopPropagation
    } = this.options

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

    this._transitionTime()
    this.startTime = getNow()

    this.stop()

    let point = e.touches ? e.touches[0] : e

    this.startX = this.x
    this.startY = this.y
    this.absStartX = this.x
    this.absStartY = this.y
    this.pointX = point.pageX
    this.pointY = point.pageY

    this.bscroll.trigger('beforeScrollStart')
  }
  private move(e: Event) {
    if (
      !this.enabled ||
      this.destroyed ||
      eventType[e.type] !== this.initiated
    ) {
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

    let point = e.touches ? e.touches[0] : e
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY

    this.pointX = point.pageX
    this.pointY = point.pageY

    this.distX += deltaX
    this.distY += deltaY

    let absDistX = Math.abs(this.distX)
    let absDistY = Math.abs(this.distY)

    let timestamp = getNow()

    // We need to move at least momentumLimitDistance pixels for the scrolling to initiate
    if (
      timestamp - this.endTime > this.options.momentumLimitTime &&
      (absDistY < this.options.momentumLimitDistance &&
        absDistX < this.options.momentumLimitDistance)
    ) {
      return
    }

    // If you are scrolling in one direction lock the other
    if (!this.directionLocked && !this.options.freeScroll) {
      if (absDistX > absDistY + this.options.directionLockThreshold) {
        this.directionLocked = 'h' // lock horizontally
      } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
        this.directionLocked = 'v' // lock vertically
      } else {
        this.directionLocked = 'n' // no lock
      }
    }

    if (this.directionLocked === 'h') {
      if (this.options.eventPassthrough === 'vertical') {
        e.preventDefault()
      } else if (this.options.eventPassthrough === 'horizontal') {
        this.initiated = false
        return
      }
      deltaY = 0
    } else if (this.directionLocked === 'v') {
      if (this.options.eventPassthrough === 'horizontal') {
        e.preventDefault()
      } else if (this.options.eventPassthrough === 'vertical') {
        this.initiated = false
        return
      }
      deltaX = 0
    }

    deltaX = this.hasHorizontalScroll ? deltaX : 0
    deltaY = this.hasVerticalScroll ? deltaY : 0
    this.movingDirectionX =
      deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0
    this.movingDirectionY =
      deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0

    let newX = this.x + deltaX
    let newY = this.y + deltaY

    let top = false
    let bottom = false
    let left = false
    let right = false
    // Slow down or stop if outside of the boundaries
    const bounce = this.options.bounce
    if (bounce !== false) {
      top = bounce.top === undefined ? true : bounce.top
      bottom = bounce.bottom === undefined ? true : bounce.bottom
      left = bounce.left === undefined ? true : bounce.left
      right = bounce.right === undefined ? true : bounce.right
    }
    if (newX > this.minScrollX || newX < this.maxScrollX) {
      if (
        (newX > this.minScrollX && left) ||
        (newX < this.maxScrollX && right)
      ) {
        newX = this.x + deltaX / 3
      } else {
        newX = newX > this.minScrollX ? this.minScrollX : this.maxScrollX
      }
    }
    if (newY > this.minScrollY || newY < this.maxScrollY) {
      if (
        (newY > this.minScrollY && top) ||
        (newY < this.maxScrollY && bottom)
      ) {
        newY = this.y + deltaY / 3
      } else {
        newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY
      }
    }

    if (!this.moved) {
      this.moved = true
      this.bs.trigger('scrollStart')
    }

    this._translate(newX, newY)

    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      this.startTime = timestamp
      this.startX = this.x
      this.startY = this.y

      if (this.options.probeType === PROBE_DEBOUNCE) {
        this.trigger('scroll', {
          x: this.x,
          y: this.y
        })
      }
    }

    if (this.options.probeType > PROBE_DEBOUNCE) {
      this.bscroll.trigger('scroll', {
        x: this.x,
        y: this.y
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
      pX >
        document.documentElement.clientWidth -
          this.options.momentumLimitDistance ||
      pX < this.options.momentumLimitDistance ||
      pY < this.options.momentumLimitDistance ||
      pY >
        document.documentElement.clientHeight -
          this.options.momentumLimitDistance
    ) {
      this.end(e)
    }
  }
  private end(e: Event) {
    if (
      !this.enabled ||
      this.destroyed ||
      eventType[e.type] !== this.initiated
    ) {
      return
    }
    this.initiated = false

    if (
      this.options.preventDefault &&
      !preventDefaultException(e.target, this.options.preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (this.options.stopPropagation) {
      e.stopPropagation()
    }

    this.bscroll.trigger('touchEnd', {
      x: this.x,
      y: this.y
    })

    this.isInTransition = false

    // ensures that the last position is rounded
    let newX = Math.round(this.x)
    let newY = Math.round(this.y)

    let deltaX = newX - this.absStartX
    let deltaY = newY - this.absStartY
    this.directionX =
      deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0
    this.directionY =
      deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0

    // if configure pull down refresh, check it first
    if (this.options.pullDownRefresh && this._checkPullDown()) {
      return
    }

    // check if it is a click operation
    if (this._checkClick(e)) {
      this.trigger('scrollCancel')
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
      this._events.flick &&
      duration < this.options.flickLimitTime &&
      absDistX < this.options.flickLimitDistance &&
      absDistY < this.options.flickLimitDistance
    ) {
      this.trigger('flick')
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
      const bounce = this.options.bounce
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
    if (this.options.snap) {
      let snap = this._nearestSnap(newX, newY)
      this.currentPage = snap
      time =
        this.options.snapSpeed ||
        Math.max(
          Math.max(
            Math.min(Math.abs(newX - snap.x), 1000),
            Math.min(Math.abs(newY - snap.y), 1000)
          ),
          300
        )
      newX = snap.x
      newY = snap.y

      this.directionX = 0
      this.directionY = 0
      easing = this.options.snap.easing || ease.bounce
    }

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

    if (this.options.wheel) {
      this.selectedIndex = Math.round(Math.abs(this.y / this.itemHeight))
    }
    this.trigger('scrollEnd', {
      x: this.x,
      y: this.y
    })
  }
  private resize() {
    const { enabled, wrapper } = this.bs
    const { resizePolling } = this.options
    if (enabled) {
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
    if (e.target !== this.scroller || !this.isInTransition) {
      return
    }

    this._transitionTime()
    const needReset = !this.pulling || this.movingDirectionY === DIRECTION_UP
    if (
      needReset &&
      !this.resetPosition(this.options.bounceTime, ease.bounce)
    ) {
      this.isInTransition = false
      if (this.options.probeType !== PROBE_REALTIME) {
        this.bs.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        })
      }
    }
  }
}
