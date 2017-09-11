import {
  eventType,
  TOUCH_EVENT,
  preventDefaultException,
  tap,
  click,
  style,
  offset
} from '../util/dom'
import { ease } from '../util/ease'
import { momentum } from '../util/momentum'
import { requestAnimationFrame, cancelAnimationFrame } from '../util/raf'
import { getNow } from '../util/lang'

export function coreMixin(BScroll) {
  BScroll.prototype._start = function (e) {
    let _eventType = eventType[e.type]
    if (_eventType !== TOUCH_EVENT) {
      if (e.button !== 0) {
        return
      }
    }
    if (!this.enabled || this.destroyed || (this.initiated && this.initiated !== _eventType)) {
      return
    }
    this.initiated = _eventType

    if (this.options.preventDefault && !preventDefaultException(e.target, this.options.preventDefaultException)) {
      e.preventDefault()
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

    if (this.options.wheel) {
      this.target = e.target
    }

    this.stop()

    let point = e.touches ? e.touches[0] : e

    this.startX = this.x
    this.startY = this.y
    this.absStartX = this.x
    this.absStartY = this.y
    this.pointX = point.pageX
    this.pointY = point.pageY

    this.trigger('beforeScrollStart')
  }

  BScroll.prototype._move = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return
    }

    if (this.options.preventDefault) {
      e.preventDefault()
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
    if (timestamp - this.endTime > this.options.momentumLimitTime && (absDistY < this.options.momentumLimitDistance && absDistX < this.options.momentumLimitDistance)) {
      return
    }

    // If you are scrolling in one direction lock the other
    if (!this.directionLocked && !this.options.freeScroll) {
      if (absDistX > absDistY + this.options.directionLockThreshold) {
        this.directionLocked = 'h'		// lock horizontally
      } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
        this.directionLocked = 'v'		// lock vertically
      } else {
        this.directionLocked = 'n'		// no lock
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
    this.movingDirectionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0
    this.movingDirectionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0

    let newX = this.x + deltaX
    let newY = this.y + deltaY

    // Slow down or stop if outside of the boundaries
    if (newX > 0 || newX < this.maxScrollX) {
      if (this.options.bounce) {
        newX = this.x + deltaX / 3
      } else {
        newX = newX > 0 ? 0 : this.maxScrollX
      }
    }
    if (newY > 0 || newY < this.maxScrollY) {
      if (this.options.bounce) {
        newY = this.y + deltaY / 3
      } else {
        newY = newY > 0 ? 0 : this.maxScrollY
      }
    }

    if (!this.moved) {
      this.moved = true
      this.trigger('scrollStart')
    }

    this._translate(newX, newY)

    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      this.startTime = timestamp
      this.startX = this.x
      this.startY = this.y

      if (this.options.probeType === 1) {
        this.trigger('scroll', {
          x: this.x,
          y: this.y
        })
      }
    }

    if (this.options.probeType > 1) {
      this.trigger('scroll', {
        x: this.x,
        y: this.y
      })
    }

    let scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

    let pX = this.pointX - scrollLeft
    let pY = this.pointY - scrollTop

    if (pX > document.documentElement.clientWidth - this.options.momentumLimitDistance || pX < this.options.momentumLimitDistance || pY < this.options.momentumLimitDistance || pY > document.documentElement.clientHeight - this.options.momentumLimitDistance
    ) {
      this._end(e)
    }
  }

  BScroll.prototype._end = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return
    }
    this.initiated = false

    if (this.options.preventDefault && !preventDefaultException(e.target, this.options.preventDefaultException)) {
      e.preventDefault()
    }

    this.trigger('touchEnd', {
      x: this.x,
      y: this.y
    })

    // if configure pull down refresh, check it first
    if (this.options.pullDownRefresh && this._checkPullDown()) {
      return
    }

    // reset if we are outside of the boundaries
    if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
      return
    }
    this.isInTransition = false
    // ensures that the last position is rounded
    let newX = Math.round(this.x)
    let newY = Math.round(this.y)

    // we scrolled less than 15 pixels
    if (!this.moved) {
      if (this.options.wheel) {
        if (this.target && this.target.className === 'wheel-scroll') {
          let index = Math.abs(Math.round(newY / this.itemHeight))
          let _offset = Math.round((this.pointY + offset(this.target).top - this.itemHeight / 2) / this.itemHeight)
          this.target = this.items[index + _offset]
        }
        this.scrollToElement(this.target, this.options.wheel.adjustTime || 400, true, true, ease.swipe)
      } else {
        if (this.options.tap) {
          tap(e, this.options.tap)
        }

        if (this.options.click) {
          click(e)
        }
      }
      this.trigger('scrollCancel')
      return
    }

    this.scrollTo(newX, newY)

    let deltaX = newX - this.absStartX
    let deltaY = newY - this.absStartY
    this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0
    this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0

    this.endTime = getNow()

    let duration = this.endTime - this.startTime
    let absDistX = Math.abs(newX - this.startX)
    let absDistY = Math.abs(newY - this.startY)

    // flick
    if (this._events.flick && duration < this.options.flickLimitTime && absDistX < this.options.flickLimitDistance && absDistY < this.options.flickLimitDistance) {
      this.trigger('flick')
      return
    }

    let time = 0
    // start momentum animation if needed
    if (this.options.momentum && duration < this.options.momentumLimitTime && (absDistY > this.options.momentumLimitDistance || absDistX > this.options.momentumLimitDistance)) {
      let momentumX = this.hasHorizontalScroll ? momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options)
        : {destination: newX, duration: 0}
      let momentumY = this.hasVerticalScroll ? momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options)
        : {destination: newY, duration: 0}
      newX = momentumX.destination
      newY = momentumY.destination
      time = Math.max(momentumX.duration, momentumY.duration)
      this.isInTransition = 1
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
      time = this.options.snapSpeed || Math.max(
          Math.max(
            Math.min(Math.abs(newX - snap.x), 1000),
            Math.min(Math.abs(newY - snap.y), 1000)
          ), 300)
      newX = snap.x
      newY = snap.y

      this.directionX = 0
      this.directionY = 0
      easing = ease.bounce
    }

    if (newX !== this.x || newY !== this.y) {
      // change easing function when scroller goes out of the boundaries
      if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
        easing = ease.swipeBounce
      }
      this.scrollTo(newX, newY, time, easing)
      return
    }

    if (this.options.wheel) {
      this.selectedIndex = Math.abs(this.y / this.itemHeight) | 0
    }
    this.trigger('scrollEnd', {
      x: this.x,
      y: this.y
    })
  }

  BScroll.prototype._resize = function () {
    if (!this.enabled) {
      return
    }

    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      this.refresh()
    }, this.options.resizePolling)
  }

  BScroll.prototype._startProbe = function () {
    cancelAnimationFrame(this.probeTimer)
    this.probeTimer = requestAnimationFrame(probe)

    let me = this

    function probe() {
      if (!me.isInTransition) {
        return
      }
      let pos = me.getComputedPosition()
      me.trigger('scroll', pos)
      me.probeTimer = requestAnimationFrame(probe)
    }
  }

  BScroll.prototype._transitionTime = function (time = 0) {
    this.scrollerStyle[style.transitionDuration] = time + 'ms'

    if (this.options.wheel) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].style[style.transitionDuration] = time + 'ms'
      }
    }

    if (this.indicators) {
      for (let i = 0; i < this.indicators.length; i++) {
        this.indicators[i].transitionTime(time)
      }
    }
  }

  BScroll.prototype._transitionTimingFunction = function (easing) {
    this.scrollerStyle[style.transitionTimingFunction] = easing

    if (this.options.wheel) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].style[style.transitionTimingFunction] = easing
      }
    }

    if (this.indicators) {
      for (let i = 0; i < this.indicators.length; i++) {
        this.indicators[i].transitionTimingFunction(easing)
      }
    }
  }

  BScroll.prototype._transitionEnd = function (e) {
    if (e.target !== this.scroller || !this.isInTransition) {
      return
    }

    this._transitionTime()
    if (!this.pulling && !this.resetPosition(this.options.bounceTime, ease.bounce)) {
      this.isInTransition = false
      this.trigger('scrollEnd', {
        x: this.x,
        y: this.y
      })
    }
  }

  BScroll.prototype._translate = function (x, y) {
    if (this.options.useTransform) {
      this.scrollerStyle[style.transform] = `translate(${x}px,${y}px)${this.translateZ}`
    } else {
      x = Math.round(x)
      y = Math.round(y)
      this.scrollerStyle.left = `${x}px`
      this.scrollerStyle.top = `${y}px`
    }

    if (this.options.wheel) {
      const {rotate = 25} = this.options.wheel
      for (let i = 0; i < this.items.length; i++) {
        let deg = rotate * (y / this.itemHeight + i)
        this.items[i].style[style.transform] = `rotateX(${deg}deg)`
      }
    }

    this.x = x
    this.y = y

    if (this.indicators) {
      for (let i = 0; i < this.indicators.length; i++) {
        this.indicators[i].updatePosition()
      }
    }
  }

  BScroll.prototype._animate = function (destX, destY, duration, easingFn) {
    let me = this
    let startX = this.x
    let startY = this.y
    let startTime = getNow()
    let destTime = startTime + duration

    function step() {
      let now = getNow()

      if (now >= destTime) {
        me.isAnimating = false
        me._translate(destX, destY)

        if (!me.pulling && !me.resetPosition(me.options.bounceTime)) {
          me.trigger('scrollEnd', {
            x: me.x,
            y: me.y
          })
        }
        return
      }
      now = (now - startTime) / duration
      let easing = easingFn(now)
      let newX = (destX - startX) * easing + startX
      let newY = (destY - startY) * easing + startY

      me._translate(newX, newY)

      if (me.isAnimating) {
        me.animateTimer = requestAnimationFrame(step)
      }

      if (me.options.probeType === 3) {
        me.trigger('scroll', {
          x: this.x,
          y: this.y
        })
      }
    }

    this.isAnimating = true
    cancelAnimationFrame(this.animateTimer)
    step()
  }

  BScroll.prototype.scrollBy = function (x, y, time = 0, easing = ease.bounce) {
    x = this.x + x
    y = this.y + y

    this.scrollTo(x, y, time, easing)
  }

  BScroll.prototype.scrollTo = function (x, y, time = 0, easing = ease.bounce) {
    this.isInTransition = this.options.useTransition && time > 0 && (x !== this.x || y !== this.y)

    if (!time || this.options.useTransition) {
      this._transitionTimingFunction(easing.style)
      this._transitionTime(time)
      this._translate(x, y)

      if (time && this.options.probeType === 3) {
        this._startProbe()
      }

      if (this.options.wheel) {
        if (y > 0) {
          this.selectedIndex = 0
        } else if (y < this.maxScrollY) {
          this.selectedIndex = this.items.length - 1
        } else {
          this.selectedIndex = Math.abs(y / this.itemHeight) | 0
        }
      }
    } else {
      this._animate(x, y, time, easing.fn)
    }
  }

  BScroll.prototype.scrollToElement = function (el, time, offsetX, offsetY, easing) {
    if (!el) {
      return
    }
    el = el.nodeType ? el : this.scroller.querySelector(el)

    if (this.options.wheel && el.className !== 'wheel-item') {
      return
    }

    let pos = offset(el)
    pos.left -= this.wrapperOffset.left
    pos.top -= this.wrapperOffset.top

    // if offsetX/Y are true we center the element to the screen
    if (offsetX === true) {
      offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2)
    }
    if (offsetY === true) {
      offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2)
    }

    pos.left -= offsetX || 0
    pos.top -= offsetY || 0
    pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left
    pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top

    if (this.options.wheel) {
      pos.top = Math.round(pos.top / this.itemHeight) * this.itemHeight
    }

    this.scrollTo(pos.left, pos.top, time, easing)
  }

  BScroll.prototype.resetPosition = function (time = 0, easeing = ease.bounce) {
    let x = this.x
    if (!this.hasHorizontalScroll || x > 0) {
      x = 0
    } else if (x < this.maxScrollX) {
      x = this.maxScrollX
    }

    let y = this.y
    if (!this.hasVerticalScroll || y > 0) {
      y = 0
    } else if (y < this.maxScrollY) {
      y = this.maxScrollY
    }

    if (x === this.x && y === this.y) {
      return false
    }

    this.scrollTo(x, y, time, easeing)

    return true
  }

  BScroll.prototype.getComputedPosition = function () {
    let matrix = window.getComputedStyle(this.scroller, null)
    let x
    let y

    if (this.options.useTransform) {
      matrix = matrix[style.transform].split(')')[0].split(', ')
      x = +(matrix[12] || matrix[4])
      y = +(matrix[13] || matrix[5])
    } else {
      x = +matrix.left.replace(/[^-\d.]/g, '')
      y = +matrix.top.replace(/[^-\d.]/g, '')
    }

    return {
      x,
      y
    }
  }

  BScroll.prototype.stop = function () {
    if (this.options.useTransition && this.isInTransition) {
      this.isInTransition = false
      let pos = this.getComputedPosition()
      this._translate(pos.x, pos.y)
      if (this.options.wheel) {
        this.target = this.items[Math.round(-pos.y / this.itemHeight)]
      } else {
        this.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        })
      }
    } else if (!this.options.useTransition && this.isAnimating) {
      this.isAnimating = false
      this.trigger('scrollEnd', {
        x: this.x,
        y: this.y
      })
    }
  }

  BScroll.prototype.destroy = function () {
    this._removeDOMEvents()

    if (this.options.scrollbar) {
      this._removeScrollBars()
    }

    this.destroyed = true
    this.trigger('destroy')
  }
}