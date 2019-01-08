import BScroll from '../index'
import Options from '../Options'
import {
  style,
  assert,
  ease,
  isUndef,
  getNow,
  PROBE_REALTIME,
  offset
} from '../util'

export default class Scroller {
  options: Options
  element: HTMLElement
  elementStyle: CSSStyleDeclaration
  probeTimer: number
  animateTimer: number
  _reflow: number
  constructor(public bs: BScroll) {
    this.options = bs.options
    this.element = bs.scrollElement
    this.elementStyle = bs.scrollElement.style
  }
  transitionTime(time = 0) {
    this.elementStyle[style.transitionDuration as any] = time + 'ms'
  }
  transitionTimingFunction(easing: string) {
    this.elementStyle[style.transitionTimingFunction as any] = easing
  }
  startProbe() {
    cancelAnimationFrame(this.probeTimer)
    this.probeTimer = requestAnimationFrame(probe)
    const bs = this.bs

    let me = this

    function probe() {
      let pos = me.getComputedPosition()
      bs.trigger('scroll', pos)
      if (!bs.isInTransition) {
        bs.trigger('scrollEnd', pos)
        return
      }
      me.probeTimer = requestAnimationFrame(probe)
    }
  }

  scrollBy(deltaX: number, deltaY: number, time = 0, easing = ease.bounce) {
    const { x, y } = this.bs

    deltaX += x
    deltaY += y

    this.scrollTo(deltaX, deltaY, time, easing)
  }

  scrollTo(destX: number, destY: number, time = 0, easing = ease.bounce) {
    const { x, y } = this.bs
    const { useTransition, probeType } = this.options
    this.bs.isInTransition =
      useTransition && time > 0 && (destX !== x || destY !== y)

    if (!time || useTransition) {
      this.transitionTimingFunction(easing.style)
      this.transitionTime(time)
      this.translate(destX, destY)

      if (time && probeType === PROBE_REALTIME) {
        this.startProbe()
      }

      if (!time && (destX !== x || destY !== y)) {
        this.bs.trigger('scroll', {
          destX,
          destY
        })
        // force reflow to put everything in position
        this._reflow = document.body.offsetHeight
        if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
          this.bs.trigger('scrollEnd', {
            x,
            y
          })
        }
      }
    } else {
      this.animate(destX, destY, time, easing.fn)
    }
  }

  scrollToElement(
    el: HTMLElement | string,
    time: number,
    offsetX: number | boolean,
    offsetY: number | boolean,
    easing: Object
  ) {
    if (!el) {
      return
    }
    el = ((el as HTMLElement).nodeType
      ? el
      : this.element.querySelector(el as string)) as HTMLElement

    const {
      wrapperOffset,
      wrapper,
      minScrollX,
      maxScrollX,
      minScrollY,
      maxScrollY
    } = this.bs

    let pos = offset(el)
    pos.left -= wrapperOffset.left
    pos.top -= wrapperOffset.top

    // if offsetX/Y are true we center the element to the screen
    if (offsetX === true) {
      offsetX = Math.round(el.offsetWidth / 2 - wrapper.offsetWidth / 2)
    }
    if (offsetY === true) {
      offsetY = Math.round(el.offsetHeight / 2 - wrapper.offsetHeight / 2)
    }

    pos.left -= offsetX || 0
    pos.top -= offsetY || 0
    pos.left =
      pos.left > minScrollX
        ? minScrollX
        : pos.left < maxScrollX
        ? maxScrollX
        : pos.left
    pos.top =
      pos.top > minScrollY
        ? minScrollY
        : pos.top < maxScrollY
        ? maxScrollY
        : pos.top

    this.scrollTo(pos.left, pos.top, time, easing as any)
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
        me.bs.isAnimating = false
        me.translate(destX, destY, destScale)

        me.bs.trigger('scroll', {
          x: me.bs.x,
          y: me.bs.y
        })

        if (!me.resetPosition(me.options.bounceTime)) {
          me.bs.trigger('scrollEnd', {
            x: me.bs.x,
            y: me.bs.y
          })
        }
        return
      }
      now = (now - startTime) / duration
      let easing = easingFn(now)
      let newX = (destX - startX) * easing + startX
      let newY = (destY - startY) * easing + startY
      let newScale = (destScale - startScale) * easing + startScale

      me.translate(newX, newY, newScale)

      if (me.bs.isAnimating) {
        me.animateTimer = requestAnimationFrame(step)
      }

      if (me.options.probeType === PROBE_REALTIME) {
        me.bs.trigger('scroll', {
          x: me.bs.x,
          y: me.bs.y
        })
      }
    }

    this.bs.isAnimating = true
    cancelAnimationFrame(this.animateTimer)
    step()
  }

  translate(x: number, y: number, scale?: number) {
    assert(!isUndef(x) && !isUndef(y), 'Translate x or y is null or undefined.')
    if (isUndef(scale)) {
      scale = this.bs.scale
    }
    if (this.options.useTransform) {
      this.elementStyle[
        style.transform as any
      ] = `translate(${x}px,${y}px) scale(${scale})${this.bs.translateZ}`
    } else {
      x = Math.round(x)
      y = Math.round(y)
      this.elementStyle.left = `${x}px`
      this.elementStyle.top = `${y}px`
    }

    this.bs.x = x
    this.bs.y = y

    this.bs.setScale(scale as number)
  }

  stop() {
    const { isInTransition, isAnimating } = this.bs

    if (this.options.useTransition && isInTransition) {
      this.bs.isInTransition = false
      cancelAnimationFrame(this.probeTimer)
      let pos = this.getComputedPosition()
      this.translate(pos.x, pos.y)
      this.bs.trigger('scrollEnd', {
        x: this.bs.x,
        y: this.bs.y
      })
      this.bs.stopFromTransition = true
    } else if (!this.options.useTransition && isAnimating) {
      this.bs.isAnimating = false
      cancelAnimationFrame(this.animateTimer)
      this.bs.trigger('scrollEnd', {
        x: this.bs.x,
        y: this.bs.y
      })
      this.bs.stopFromTransition = true
    }
  }

  getComputedPosition() {
    let matrix = window.getComputedStyle(this.element, null) as any
    let x
    let y

    if (this.options.useTransform) {
      matrix = matrix[style.transform as string].split(')')[0].split(', ')
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

  resetPosition(time = 0, easeing = ease.bounce) {
    let {
      x,
      y,
      hasHorizontalScroll,
      hasVerticalScroll,
      minScrollX,
      maxScrollX,
      minScrollY,
      maxScrollY
    } = this.bs
    let roundX = Math.round(x)
    if (!hasHorizontalScroll || roundX > minScrollX) {
      x = minScrollX
    } else if (roundX < maxScrollX) {
      x = maxScrollX
    }

    let roundY = Math.round(y)
    if (!hasVerticalScroll || roundY > minScrollY) {
      y = minScrollY
    } else if (roundY < maxScrollY) {
      y = maxScrollY
    }

    if (x === this.bs.x && y === this.bs.y) {
      return false
    }

    this.scrollTo(x, y, time, easeing)

    return true
  }
}
