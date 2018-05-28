import { style, addEvent, removeEvent } from '../util/dom'
import { getNow } from '../util/lang'
import { ease } from '../util/ease'

const INDICATOR_MIN_LEN = 8

export function scrollbarMixin(BScroll) {
  BScroll.prototype._initScrollbar = function () {
    const {fade = true, interactive = false} = this.options.scrollbar
    this.indicators = []
    let indicator

    if (this.options.scrollX) {
      indicator = {
        el: createScrollbar('horizontal'),
        direction: 'horizontal',
        fade,
        interactive
      }
      this._insertScrollBar(indicator.el)

      this.indicators.push(new Indicator(this, indicator))
    }

    if (this.options.scrollY) {
      indicator = {
        el: createScrollbar('vertical'),
        direction: 'vertical',
        fade,
        interactive
      }
      this._insertScrollBar(indicator.el)
      this.indicators.push(new Indicator(this, indicator))
    }

    this.on('refresh', () => {
      for (let i = 0; i < this.indicators.length; i++) {
        this.indicators[i].refresh()
      }
    })

    if (fade) {
      this.on('scrollEnd', () => {
        for (let i = 0; i < this.indicators.length; i++) {
          this.indicators[i].fade()
        }
      })

      this.on('scrollCancel', () => {
        for (let i = 0; i < this.indicators.length; i++) {
          this.indicators[i].fade()
        }
      })

      this.on('scrollStart', () => {
        for (let i = 0; i < this.indicators.length; i++) {
          this.indicators[i].fade(true)
        }
      })

      this.on('beforeScrollStart', () => {
        for (let i = 0; i < this.indicators.length; i++) {
          this.indicators[i].fade(true, true)
        }
      })
    }

    this.on('destroy', () => {
      this._removeScrollBars()
    })
  }

  BScroll.prototype._insertScrollBar = function (scrollbar) {
    this.wrapper.appendChild(scrollbar)
  }

  BScroll.prototype._removeScrollBars = function () {
    for (let i = 0; i < this.indicators.length; i++) {
      this.indicators[i].destroy()
    }
  }
}

function createScrollbar(direction) {
  let scrollbar = document.createElement('div')
  let indicator = document.createElement('div')

  scrollbar.style.cssText = 'position:absolute;z-index:9999;pointerEvents:none'
  indicator.style.cssText = 'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;'

  indicator.className = 'bscroll-indicator'

  if (direction === 'horizontal') {
    scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0'
    indicator.style.height = '100%'
    scrollbar.className = 'bscroll-horizontal-scrollbar'
  } else {
    scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px'
    indicator.style.width = '100%'
    scrollbar.className = 'bscroll-vertical-scrollbar'
  }

  scrollbar.style.cssText += ';overflow:hidden'
  scrollbar.appendChild(indicator)

  return scrollbar
}

function Indicator(scroller, options) {
  this.wrapper = options.el
  this.wrapperStyle = this.wrapper.style
  this.indicator = this.wrapper.children[0]
  this.indicatorStyle = this.indicator.style
  this.scroller = scroller
  this.direction = options.direction
  if (options.fade) {
    this.visible = 0
    this.wrapperStyle.opacity = '0'
  } else {
    this.visible = 1
  }

  this.sizeRatioX = 1
  this.sizeRatioY = 1
  this.maxPosX = 0
  this.maxPosY = 0
  this.x = 0
  this.y = 0

  if (options.interactive) {
    this._addDOMEvents()
  }
}

Indicator.prototype.handleEvent = function (e) {
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
  }
}

Indicator.prototype.refresh = function () {
  if (this._shouldShow()) {
    this.transitionTime()
    this._calculate()
    this.updatePosition()
  }
}

Indicator.prototype.fade = function (visible, hold) {
  if (hold && !this.visible) {
    return
  }

  let time = visible ? 250 : 500

  visible = visible ? '1' : '0'

  this.wrapperStyle[style.transitionDuration] = time + 'ms'

  clearTimeout(this.fadeTimeout)
  this.fadeTimeout = setTimeout(() => {
    this.wrapperStyle.opacity = visible
    this.visible = +visible
  }, 0)
}

Indicator.prototype.updatePosition = function () {
  if (this.direction === 'vertical') {
    let y = Math.round(this.sizeRatioY * this.scroller.y)

    if (y < 0) {
      this.transitionTime(500)
      const height = Math.max(this.indicatorHeight + y * 3, INDICATOR_MIN_LEN)
      this.indicatorStyle.height = `${height}px`
      y = 0
    } else if (y > this.maxPosY) {
      this.transitionTime(500)
      const height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, INDICATOR_MIN_LEN)
      this.indicatorStyle.height = `${height}px`
      y = this.maxPosY + this.indicatorHeight - height
    } else {
      this.indicatorStyle.height = `${this.indicatorHeight}px`
    }
    this.y = y

    if (this.scroller.options.useTransform) {
      this.indicatorStyle[style.transform] = `translateY(${y}px)${this.scroller.translateZ}`
    } else {
      this.indicatorStyle.top = `${y}px`
    }
  } else {
    let x = Math.round(this.sizeRatioX * this.scroller.x)

    if (x < 0) {
      this.transitionTime(500)
      const width = Math.max(this.indicatorWidth + x * 3, INDICATOR_MIN_LEN)
      this.indicatorStyle.width = `${width}px`
      x = 0
    } else if (x > this.maxPosX) {
      this.transitionTime(500)
      const width = Math.max(this.indicatorWidth - (x - this.maxPosX) * 3, INDICATOR_MIN_LEN)
      this.indicatorStyle.width = `${width}px`
      x = this.maxPosX + this.indicatorWidth - width
    } else {
      this.indicatorStyle.width = `${this.indicatorWidth}px`
    }

    this.x = x

    if (this.scroller.options.useTransform) {
      this.indicatorStyle[style.transform] = `translateX(${x}px)${this.scroller.translateZ}`
    } else {
      this.indicatorStyle.left = `${x}px`
    }
  }
}

Indicator.prototype.transitionTime = function (time = 0) {
  this.indicatorStyle[style.transitionDuration] = time + 'ms'
}

Indicator.prototype.transitionTimingFunction = function (easing) {
  this.indicatorStyle[style.transitionTimingFunction] = easing
}

Indicator.prototype.destroy = function () {
  this._removeDOMEvents()
  this.wrapper.parentNode.removeChild(this.wrapper)
}

Indicator.prototype._start = function (e) {
  let point = e.touches ? e.touches[0] : e

  e.preventDefault()
  e.stopPropagation()

  this.transitionTime()

  this.initiated = true
  this.moved = false
  this.lastPointX = point.pageX
  this.lastPointY = point.pageY

  this.startTime = getNow()

  this._handleMoveEvents(addEvent)
  this.scroller.trigger('beforeScrollStart')
}

Indicator.prototype._move = function (e) {
  let point = e.touches ? e.touches[0] : e

  e.preventDefault()
  e.stopPropagation()

  if (!this.moved) {
    this.scroller.trigger('scrollStart')
  }

  this.moved = true

  let deltaX = point.pageX - this.lastPointX
  this.lastPointX = point.pageX

  let deltaY = point.pageY - this.lastPointY
  this.lastPointY = point.pageY

  let newX = this.x + deltaX
  let newY = this.y + deltaY

  this._pos(newX, newY)
}

Indicator.prototype._end = function (e) {
  if (!this.initiated) {
    return
  }
  this.initiated = false

  e.preventDefault()
  e.stopPropagation()

  this._handleMoveEvents(removeEvent)

  const snapOption = this.scroller.options.snap
  if (snapOption) {
    let {speed, easing = ease.bounce} = snapOption
    let snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y)

    let time = speed || Math.max(
        Math.max(
          Math.min(Math.abs(this.scroller.x - snap.x), 1000),
          Math.min(Math.abs(this.scroller.y - snap.y), 1000)
        ), 300)

    if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
      this.scroller.directionX = 0
      this.scroller.directionY = 0
      this.scroller.currentPage = snap
      this.scroller.scrollTo(snap.x, snap.y, time, easing)
    }
  }

  if (this.moved) {
    this.scroller.trigger('scrollEnd', {
      x: this.scroller.x,
      y: this.scroller.y
    })
  }
}

Indicator.prototype._pos = function (x, y) {
  if (x < 0) {
    x = 0
  } else if (x > this.maxPosX) {
    x = this.maxPosX
  }

  if (y < 0) {
    y = 0
  } else if (y > this.maxPosY) {
    y = this.maxPosY
  }

  x = Math.round(x / this.sizeRatioX)
  y = Math.round(y / this.sizeRatioY)

  this.scroller.scrollTo(x, y)
  this.scroller.trigger('scroll', {
    x: this.scroller.x,
    y: this.scroller.y
  })
}

Indicator.prototype._shouldShow = function () {
  if ((this.direction === 'vertical' && this.scroller.hasVerticalScroll) || (this.direction === 'horizontal' && this.scroller.hasHorizontalScroll)) {
    this.wrapper.style.display = ''
    return true
  }
  this.wrapper.style.display = 'none'
  return false
}

Indicator.prototype._calculate = function () {
  if (this.direction === 'vertical') {
    let wrapperHeight = this.wrapper.clientHeight
    this.indicatorHeight = Math.max(Math.round(wrapperHeight * wrapperHeight / (this.scroller.scrollerHeight || wrapperHeight || 1)), INDICATOR_MIN_LEN)
    this.indicatorStyle.height = `${this.indicatorHeight}px`

    this.maxPosY = wrapperHeight - this.indicatorHeight

    this.sizeRatioY = this.maxPosY / this.scroller.maxScrollY
  } else {
    let wrapperWidth = this.wrapper.clientWidth
    this.indicatorWidth = Math.max(Math.round(wrapperWidth * wrapperWidth / (this.scroller.scrollerWidth || wrapperWidth || 1)), INDICATOR_MIN_LEN)
    this.indicatorStyle.width = `${this.indicatorWidth}px`

    this.maxPosX = wrapperWidth - this.indicatorWidth

    this.sizeRatioX = this.maxPosX / this.scroller.maxScrollX
  }
}

Indicator.prototype._addDOMEvents = function () {
  let eventOperation = addEvent
  this._handleDOMEvents(eventOperation)
}

Indicator.prototype._removeDOMEvents = function () {
  let eventOperation = removeEvent
  this._handleDOMEvents(eventOperation)
  this._handleMoveEvents(eventOperation)
}

Indicator.prototype._handleMoveEvents = function (eventOperation) {
  if (!this.scroller.options.disableTouch) {
    eventOperation(window, 'touchmove', this)
  }
  if (!this.scroller.options.disableMouse) {
    eventOperation(window, 'mousemove', this)
  }
}

Indicator.prototype._handleDOMEvents = function (eventOperation) {
  if (!this.scroller.options.disableTouch) {
    eventOperation(this.indicator, 'touchstart', this)
    eventOperation(window, 'touchend', this)
  }
  if (!this.scroller.options.disableMouse) {
    eventOperation(this.indicator, 'mousedown', this)
    eventOperation(window, 'mouseup', this)
  }
}
