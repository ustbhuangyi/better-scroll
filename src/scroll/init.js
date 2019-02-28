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
import { extend, isUndef } from '../util/lang'

const DEFAULT_OPTIONS = {
  startX: 0,
  startY: 0,
  scrollX: false,
  scrollY: true,
  freeScroll: false,
  directionLockThreshold: 5,
  eventPassthrough: '',
  click: false,
  tap: false,
  /**
   * support any side
   * bounce: {
   *   top: true,
   *   bottom: true,
   *   left: true,
   *   right: true
   * }
   */
  bounce: true,
  bounceTime: 800,
  momentum: true,
  momentumLimitTime: 300,
  momentumLimitDistance: 15,
  swipeTime: 2500,
  swipeBounceTime: 500,
  deceleration: 0.0015,
  flickLimitTime: 200,
  flickLimitDistance: 100,
  resizePolling: 60,
  probeType: 0,
  preventDefault: true,
  preventDefaultException: {
    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
  },
  HWCompositing: true,
  useTransition: true,
  useTransform: true,
  bindToWrapper: false,
  disableMouse: hasTouch,
  disableTouch: !hasTouch,
  observeDOM: true,
  autoBlur: true,
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
   *   speed: 400,
   *   easing: {
   *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
   *     fn: function (t) {
   *       return t * (2 - t)
   *     }
   *   }
   *   listenFlick: true
   * }
   */
  snap: false,
  /**
   * for scrollbar
   * scrollbar: {
   *   fade: true,
   *   interactive: false
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
  pullUpLoad: false,
  /**
   * for mouse wheel
   * mouseWheel: {
   *   speed: 20,
   *   invert: false,
   *   easeTime: 300
   * }
   */
  mouseWheel: false,
  stopPropagation: false,
  /**
   * for zoom
   * zoom: {
   *   start: 1,
   *   min: 1,
   *   max: 4
   * }
   */
  zoom: false,
  /**
   * for infinity
   * infinity: {
   *   render(item, div) {
   *   },
   *   createTombstone() {
   *   },
   *   fetch(count) {
   *   }
   * }
   */
  infinity: false,
  /**
   * for double click
   * dblclick: {
   *   delay: 300
   * }
   */
  dblclick: false
}

export function initMixin (BScroll) {
  BScroll.prototype._init = function (options) {
    this._handleOptions(options)

    // init private custom events
    this._events = {}

    this.x = 0
    this.y = 0
    this.directionX = 0
    this.directionY = 0

    this.setScale(1)

    this._addDOMEvents()

    this._initExtFeatures()

    this._watchTransition()

    if (this.options.observeDOM) {
      this._initDOMObserver()
    }

    if (this.options.autoBlur) {
      this._handleAutoBlur()
    }

    this.refresh()

    if (!this.options.snap) {
      this.scrollTo(this.options.startX, this.options.startY)
    }

    this.enable()
  }

  BScroll.prototype.setScale = function (scale) {
    this.lastScale = isUndef(this.scale) ? scale : this.scale
    this.scale = scale
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
    if (this.options.mouseWheel) {
      this._initMouseWheel()
    }
    if (this.options.zoom) {
      this._initZoom()
    }
    if (this.options.infinity) {
      this._initInfinite()
    }
  }

  BScroll.prototype._watchTransition = function () {
    if (typeof Object.defineProperty !== 'function') {
      return
    }
    let me = this
    let isInTransition = false
    let key = this.options.useTransition ? 'isInTransition' : 'isAnimating'
    Object.defineProperty(this, key, {
      get () {
        return isInTransition
      },
      set (newVal) {
        isInTransition = newVal
        // fix issue #359
        let el = me.scroller.children.length ? me.scroller.children : [me.scroller]
        let pointerEvents = (isInTransition && !me.pulling) ? 'none' : 'auto'
        for (let i = 0; i < el.length; i++) {
          el[i].style.pointerEvents = pointerEvents
        }
      }
    })
  }

  BScroll.prototype._handleAutoBlur = function () {
    this.on('scrollStart', () => {
      let activeElement = document.activeElement
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur()
      }
    })
  }

  BScroll.prototype._initDOMObserver = function () {
    if (typeof MutationObserver !== 'undefined') {
      let timer
      let observer = new MutationObserver((mutations) => {
        // don't do any refresh during the transition, or outside of the boundaries
        if (this._shouldNotRefresh()) {
          return
        }
        let immediateRefresh = false
        let deferredRefresh = false
        for (let i = 0; i < mutations.length; i++) {
          const mutation = mutations[i]
          if (mutation.type !== 'attributes') {
            immediateRefresh = true
            break
          } else {
            if (mutation.target !== this.scroller) {
              deferredRefresh = true
              break
            }
          }
        }
        if (immediateRefresh) {
          this.refresh()
        } else if (deferredRefresh) {
          // attributes changes too often
          clearTimeout(timer)
          timer = setTimeout(() => {
            if (!this._shouldNotRefresh()) {
              this.refresh()
            }
          }, 60)
        }
      })
      const config = {
        attributes: true,
        childList: true,
        subtree: true
      }
      observer.observe(this.scroller, config)

      this.on('destroy', () => {
        observer.disconnect()
      })
    } else {
      this._checkDOMUpdate()
    }
  }

  BScroll.prototype._shouldNotRefresh = function () {
    let outsideBoundaries = this.x > this.minScrollX || this.x < this.maxScrollX || this.y > this.minScrollY || this.y < this.maxScrollY

    return this.isInTransition || this.stopFromTransition || outsideBoundaries
  }

  BScroll.prototype._checkDOMUpdate = function () {
    let scrollerRect = getRect(this.scroller)
    let oldWidth = scrollerRect.width
    let oldHeight = scrollerRect.height

    function check () {
      if (this.destroyed) {
        return
      }
      scrollerRect = getRect(this.scroller)
      let newWidth = scrollerRect.width
      let newHeight = scrollerRect.height

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.refresh()
      }
      oldWidth = newWidth
      oldHeight = newHeight

      next.call(this)
    }

    function next () {
      setTimeout(() => {
        check.call(this)
      }, 1000)
    }

    next.call(this)
  }

  BScroll.prototype.handleEvent = function (e) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e)
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoomStart(e)
        }
        break
      case 'touchmove':
      case 'mousemove':
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoom(e)
        } else {
          this._move(e)
        }
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        if (this.scaled) {
          this._zoomEnd(e)
        } else {
          this._end(e)
        }
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
            e.stopPropagation()
          }
        }
        break
      case 'wheel':
      case 'DOMMouseScroll':
      case 'mousewheel':
        this._onMouseWheel(e)
        break
    }
  }

  BScroll.prototype.refresh = function () {
    const isWrapperStatic = window.getComputedStyle(this.wrapper, null).position === 'static'
    let wrapperRect = getRect(this.wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let scrollerRect = getRect(this.scroller)
    this.scrollerWidth = Math.round(scrollerRect.width * this.scale)
    this.scrollerHeight = Math.round(scrollerRect.height * this.scale)

    this.relativeX = scrollerRect.left
    this.relativeY = scrollerRect.top

    if (isWrapperStatic) {
      this.relativeX -= wrapperRect.left
      this.relativeY -= wrapperRect.top
    }

    this.minScrollX = 0
    this.minScrollY = 0

    const wheel = this.options.wheel
    if (wheel) {
      this.items = this.scroller.children
      // check whether there are all disable items or not when refresh
      this._checkWheelAllDisabled()
      this.options.itemHeight = this.itemHeight = this.items.length ? this.scrollerHeight / this.items.length : 0
      if (this.selectedIndex === undefined) {
        this.selectedIndex = wheel.selectedIndex || 0
      }
      this.options.startY = -this.selectedIndex * this.itemHeight

      this.maxScrollX = 0
      this.maxScrollY = -this.itemHeight * (this.items.length - 1)
    } else {
      this.maxScrollX = this.wrapperWidth - this.scrollerWidth
      if (!this.options.infinity) {
        this.maxScrollY = this.wrapperHeight - this.scrollerHeight
      }
      if (this.maxScrollX < 0) {
        this.maxScrollX -= this.relativeX
        this.minScrollX = -this.relativeX
      } else if (this.scale > 1) {
        this.maxScrollX = (this.maxScrollX / 2 - this.relativeX)
        this.minScrollX = this.maxScrollX
      }
      if (this.maxScrollY < 0) {
        this.maxScrollY -= this.relativeY
        this.minScrollY = -this.relativeY
      } else if (this.scale > 1) {
        this.maxScrollY = (this.maxScrollY / 2 - this.relativeY)
        this.minScrollY = this.maxScrollY
      }
    }

    this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < this.minScrollX
    this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < this.minScrollY

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = this.minScrollX
      this.scrollerWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = this.minScrollY
      this.scrollerHeight = this.wrapperHeight
    }

    this.endTime = 0
    this.directionX = 0
    this.directionY = 0
    this.wrapperOffset = offset(this.wrapper)

    this.trigger('refresh')

    !this.scaled && this.resetPosition()
  }

  BScroll.prototype.enable = function () {
    this.enabled = true
  }

  BScroll.prototype.disable = function () {
    this.enabled = false
  }
}
