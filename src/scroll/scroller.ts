import BScroll from '../index'
import Options from './options'
import { style, assert, ease, isUndef } from '../util'

export default class Scroller {
  scrollElementStyle: CSSStyleDeclaration
  bscroll: BScroll
  options: Options
  probeTimer: number
  animateTimer: number
  scrollElement: HTMLElement
  constructor(public bs: BScroll) {
    this.options = bs.options
    this.scrollElement = bs.scrollElement
    this.scrollElementStyle = bs.scrollElement.style
  }
  setTransitionTime(time = 0) {
    this.scrollElementStyle[style.transitionDuration as any] = time + 'ms'
  }
  setTransitionTimingFunction(easing: string) {
    this.scrollElementStyle[style.transitionTimingFunction as any] = easing
  }
  startProbe() {
    cancelAnimationFrame(this.probeTimer)
    this.probeTimer = requestAnimationFrame(probe)
    const bscroll = this.bscroll

    let me = this

    function probe() {
      let pos = me.getComputedPosition()
      bscroll.trigger('scroll', pos)
      if (!me.bscroll.isInTransition) {
        bscroll.trigger('scrollEnd', pos)
        return
      }
      me.probeTimer = requestAnimationFrame(probe)
    }
  }

  scrollBy(x: number, y: number, time = 0, easing = ease.bounce) {
    x = this.x + x
    y = this.y + y

    this.scrollTo(x, y, time, easing)
  }

  scrollTo(x: number, y: number, time = 0, easing = ease.bounce) {
    this.isInTransition =
      this.options.useTransition && time > 0 && (x !== this.x || y !== this.y)

    if (!time || this.options.useTransition) {
      this._transitionTimingFunction(easing.style)
      this._transitionTime(time)
      this._translate(x, y)

      if (time && this.options.probeType === PROBE_REALTIME) {
        this._startProbe()
      }

      if (!time && (x !== this.x || y !== this.y)) {
        this.trigger('scroll', {
          x,
          y
        })
        // force reflow to put everything in position
        this._reflow = document.body.offsetHeight
        if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
          this.trigger('scrollEnd', {
            x,
            y
          })
        }
      }

      if (this.options.wheel) {
        if (y > this.minScrollY) {
          this.selectedIndex = 0
        } else if (y < this.maxScrollY) {
          this.selectedIndex = this.items.length - 1
        } else {
          this.selectedIndex = Math.round(Math.abs(y / this.itemHeight))
        }
      }
    } else {
      this.animate(x, y, time, easing.fn)
    }
  }

  scrollToElement(el: HTMLElement | string, time, offsetX, offsetY, easing) {
    if (!el) {
      return
    }
    el = el.nodeType ? el : this.scroller.querySelector(el)

    if (
      this.options.wheel &&
      !el.classList.contains(this.options.wheel.wheelItemClass)
    ) {
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
    pos.left =
      pos.left > this.minScrollX
        ? this.minScrollX
        : pos.left < this.maxScrollX
        ? this.maxScrollX
        : pos.left
    pos.top =
      pos.top > this.minScrollY
        ? this.minScrollY
        : pos.top < this.maxScrollY
        ? this.maxScrollY
        : pos.top

    if (this.options.wheel) {
      pos.top = Math.round(pos.top / this.itemHeight) * this.itemHeight
    }

    this.scrollTo(pos.left, pos.top, time, easing)
  }

  private animate(
    destX: number,
    destY: number,
    duration: number,
    easingFn: Function
  ) {
    let me = this
    let startX = this.x
    let startY = this.y
    let startScale = this.lastScale
    let destScale = this.scale
    let startTime = getNow()
    let destTime = startTime + duration

    function step() {
      let now = getNow()

      if (now >= destTime) {
        me.isAnimating = false
        me._translate(destX, destY, destScale)

        me.trigger('scroll', {
          x: me.x,
          y: me.y
        })

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
      let newScale = (destScale - startScale) * easing + startScale

      me._translate(newX, newY, newScale)

      if (me.isAnimating) {
        me.animateTimer = requestAnimationFrame(step)
      }

      if (me.options.probeType === PROBE_REALTIME) {
        me.trigger('scroll', {
          x: me.x,
          y: me.y
        })
      }
    }

    this.isAnimating = true
    cancelAnimationFrame(this.animateTimer)
    step()
  }

  private translate(x: number, y: number, scale: number) {
    assert(!isUndef(x) && !isUndef(y), 'Translate x or y is null or undefined.')
    if (isUndef(scale)) {
      scale = this.scale
    }
    if (this.options.useTransform) {
      this.scrollerStyle[
        style.transform
      ] = `translate(${x}px,${y}px) scale(${scale})${this.translateZ}`
    } else {
      x = Math.round(x)
      y = Math.round(y)
      this.scrollerStyle.left = `${x}px`
      this.scrollerStyle.top = `${y}px`
    }

    this.x = x
    this.y = y
    this.setScale(scale)
  }

  resetPosition(time = 0, easeing = ease.bounce) {
    let x = this.x
    let roundX = Math.round(x)
    if (!this.hasHorizontalScroll || roundX > this.minScrollX) {
      x = this.minScrollX
    } else if (roundX < this.maxScrollX) {
      x = this.maxScrollX
    }

    let y = this.y
    let roundY = Math.round(y)
    if (!this.hasVerticalScroll || roundY > this.minScrollY) {
      y = this.minScrollY
    } else if (roundY < this.maxScrollY) {
      y = this.maxScrollY
    }

    if (x === this.x && y === this.y) {
      return false
    }

    this.scrollTo(x, y, time, easeing)

    return true
  }

  stop() {
    if (this.options.useTransition && this.isInTransition) {
      this.isInTransition = false
      cancelAnimationFrame(this.probeTimer)
      let pos = this.getComputedPosition()
      this.translate(pos.x, pos.y)
      if (this.options.wheel) {
        this.target = this.items[Math.round(-pos.y / this.itemHeight)]
      } else {
        this.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        })
      }
      this.stopFromTransition = true
    } else if (!this.options.useTransition && this.isAnimating) {
      this.isAnimating = false
      cancelAnimationFrame(this.animateTimer)
      this.trigger('scrollEnd', {
        x: this.x,
        y: this.y
      })
      this.stopFromTransition = true
    }
  }
}
