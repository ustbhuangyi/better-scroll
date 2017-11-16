import {
  hasPerspective,
  hasTransition,
  hasTransform,
  hasTouch,
  style,
  offset,
  addEvent,
  removeEvent,
  getRect,
  preventDefaultException
} from '../util/dom'

import { extend } from '../util/lang'
import { warn } from '../util/debug'

const DEFAULT_OPTIONS = {
  contentEl: 0,
  startX: 0,
  startY: 0,
  scrollX: false,
  scrollY: true,
  freeScroll: false,
  directionLockThreshold: 5,
  eventPassthrough: '',
  click: false,
  tap: false,
  bounce: true,
  bounceTime: 700,
  momentum: true,
  momentumLimitTime: 300,
  momentumLimitDistance: 15,
  swipeTime: 2500,
  swipeBounceTime: 500,
  deceleration: 0.001,
  flickLimitTime: 200,
  flickLimitDistance: 100,
  resizePolling: 60,
  probeType: 0,
  preventDefault: true,
  preventDefaultException: {
    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
  },
  HWCompositing: true,
  useTransition: true,
  useTransform: true,
  bindToWrapper: false,
  disableMouse: hasTouch,
  disableTouch: !hasTouch,
  /**
   * for picker
   * wheel: {
   *   selectedIndex: 0,
   *   rotate: 25,
   *   adjustTime: 400
   *   wheelWrapperClass: 'wheel-scroll',
   *   wheelItemClass: 'wheel-item'
   * }
   */
  wheel: false,
  /**
   * for slide
   * snap: {
   *   loop: false,
   *   el: domEl,
   *   threshold: 0.1,
   *   stepX: 100,
   *   stepY: 100,
   *   listenFlick: true
   * }
   */
  snap: false,
  /**
   * for scrollbar
   * scrollbar: {
   *   fade: true
   * }
   */
  scrollbar: false,
  /**
   * for pull down and refresh
   * pullDownRefresh: {
   *   threshold: 50,
   *   stop: 20
   * }
   */
  pullDownRefresh: false,
  /**
   * for pull up and load
   * pullUpLoad: {
   *   threshold: 50
   * }
   */
  pullUpLoad: false
}

export function initMixin(BScroll) {
  BScroll.prototype._init = function (el, options) {
    this._handleOptions(options)

    // init private custom events
    this._events = {}

    this.x = 0
    this.y = 0
    this.directionX = 0
    this.directionY = 0

    if (typeof this.options.contentEl === 'number') {
      this.scroller = this.wrapper.children[this.options.contentEl]
    } else if (typeof this.options.contentEl === 'string') {
      this.scroller = document.querySelector(this.options.contentEl)
    } else if (typeof this.options.contentEl === 'object') {
      this.scroller = this.options.contentEl
    }

    if (!this.scroller) {
      warn('the wrapper need at least one child element to be scroller')
    }

    // cache style for better performance
    this.scrollerStyle = this.scroller.style

    this._addDOMEvents()

    this._initExtFeatures()

    this._watchTransition()

    this.refresh()

    if (!this.options.snap) {
      this.scrollTo(this.options.startX, this.options.startY)
    }

    this.enable()
  }

  BScroll.prototype._handleOptions = function (options) {
    this.options = extend({}, DEFAULT_OPTIONS, options)

    this.translateZ = this.options.HWCompositing && hasPerspective ? ' translateZ(0)' : ''

    this.options.useTransition = this.options.useTransition && hasTransition
    this.options.useTransform = this.options.useTransform && hasTransform

    this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault

    // If you want eventPassthrough I have to lock one of the axes
    this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX
    this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY

    // With eventPassthrough we also need lockDirection mechanism
    this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough
    this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold

    if (this.options.tap === true) {
      this.options.tap = 'tap'
    }
  }

  BScroll.prototype._addDOMEvents = function () {
    let eventOperation = addEvent
    this._handleDOMEvents(eventOperation)
  }

  BScroll.prototype._removeDOMEvents = function () {
    let eventOperation = removeEvent
    this._handleDOMEvents(eventOperation)
  }

  BScroll.prototype._handleDOMEvents = function (eventOperation) {
    let target = this.options.bindToWrapper ? this.wrapper : window
    eventOperation(window, 'orientationchange', this)
    eventOperation(window, 'resize', this)

    if (this.options.click) {
      eventOperation(this.wrapper, 'click', this, true)
    }

    if (!this.options.disableMouse) {
      eventOperation(this.wrapper, 'mousedown', this)
      eventOperation(target, 'mousemove', this)
      eventOperation(target, 'mousecancel', this)
      eventOperation(target, 'mouseup', this)
    }

    if (hasTouch && !this.options.disableTouch) {
      eventOperation(this.wrapper, 'touchstart', this)
      eventOperation(target, 'touchmove', this)
      eventOperation(target, 'touchcancel', this)
      eventOperation(target, 'touchend', this)
    }

    eventOperation(this.scroller, style.transitionEnd, this)
  }

  BScroll.prototype._initExtFeatures = function () {
    if (this.options.snap) {
      this._initSnap()
    }
    if (this.options.scrollbar) {
      this._initScrollbar()
    }
    if (this.options.pullUpLoad) {
      this._initPullUp()
    }
    if (this.options.pullDownRefresh) {
      this._initPullDown()
    }
    if (this.options.wheel) {
      this._initWheel()
    }
  }

  BScroll.prototype.handleEvent = function (e) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e)
        break
      case 'touchmove':
      case 'mousemove':
        this._move(e)
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        this._end(e)
        break
      case 'orientationchange':
      case 'resize':
        this._resize()
        break
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e)
        break
      case 'click':
        if (this.enabled && !e._constructed) {
          if (!preventDefaultException(e.target, this.options.preventDefaultException)) {
            e.preventDefault()
          }
          e.stopPropagation()
        }
        break
    }
  }

  BScroll.prototype.refresh = function () {
    let wrapperRect = getRect(this.wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let scrollerRect = getRect(this.scroller)
    this.scrollerWidth = scrollerRect.width
    this.scrollerHeight = scrollerRect.height

    const wheel = this.options.wheel
    if (wheel) {
      this.items = this.scroller.children
      this.options.itemHeight = this.itemHeight = this.items.length ? this.scrollerHeight / this.items.length : 0
      if (this.selectedIndex === undefined) {
        this.selectedIndex = wheel.selectedIndex || 0
      }
      this.options.startY = -this.selectedIndex * this.itemHeight
      this.maxScrollX = 0
      this.maxScrollY = -this.itemHeight * (this.items.length - 1)
    } else {
      this.maxScrollX = this.wrapperWidth - this.scrollerWidth
      this.maxScrollY = this.wrapperHeight - this.scrollerHeight
    }

    this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0
    this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = 0
      this.scrollerWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = 0
      this.scrollerHeight = this.wrapperHeight
    }

    this.endTime = 0
    this.directionX = 0
    this.directionY = 0
    this.wrapperOffset = offset(this.wrapper)

    this.trigger('refresh')

    this.resetPosition()
  }

  BScroll.prototype.enable = function () {
    this.enabled = true
  }

  BScroll.prototype.disable = function () {
    this.enabled = false
  }

  BScroll.prototype._watchTransition = function () {
    let isInTransition = false
    let me = this
    let prePointerEvents = this.scroller.style.pointerEvents || 'auto'
    Object.defineProperty(this, 'isInTransition', {
      get() {
        return isInTransition
      },
      set(newVal) {
        isInTransition = newVal
        if (isInTransition) {
          me.scroller.style.pointerEvents = 'none'
        } else {
          me.scroller.style.pointerEvents = prePointerEvents
        }
      }
    })
  }
}