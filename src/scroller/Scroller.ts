import ActionsHandler, {
  Options as ActionsHandlerOptions
} from '../base/ActionsHandler'
import EventEmitter from '../base/EventEmitter'
import BScrollOptions, { bounceConfig } from '../Options'

import {
  Direction,
  Probe,
  style,
  assert,
  ease,
  isUndef,
  getNow,
  offset,
  getRect,
  momentum,
  TouchEvent
} from '../util'

export default class Scroller {
  wrapper: HTMLElement
  scrollElement: HTMLElement
  actionsHandler: ActionsHandler
  element: HTMLElement
  hooks: EventEmitter
  options: BScrollOptions
  x: number
  y: number
  enabled: boolean
  startX: number
  startY: number
  absStartX: number
  absStartY: number
  pointX: number
  pointY: number
  moved: boolean
  lastScale: number
  scale: number
  wrapperWidth: number
  wrapperHeight: number
  scrollElementWidth: number
  scrollElementHeight: number
  relativeX: number
  relativeY: number
  minScrollX: number
  maxScrollX: number
  minScrollY: number
  maxScrollY: number
  hasHorizontalScroll: boolean
  hasVerticalScroll: boolean
  directionX: number
  directionY: number
  movingDirectionX: number
  movingDirectionY: number
  directionLocked: string | number
  wrapperOffset: {
    left: number
    top: number
  }
  isAnimating: boolean
  isInTransition: boolean
  stopFromTransition: boolean
  startTime: number
  endTime: number
  probeTimer: number
  animateTimer: number
  _reflow: number
  constructor(wrapper: HTMLElement, options: BScrollOptions) {
    this.hooks = new EventEmitter(['scroll', 'scrollEnd'])
    this.options = options
    this.wrapper = wrapper
    this.scrollElement = wrapper.children[0] as HTMLElement
    this.x = 0
    this.y = 0
    const actionsHandlerOptions = [
      'bindToWrapper',
      'click',
      'disableMouse',
      'preventDefault',
      'stopPropagation',
      'preventDefaultException'
    ].reduce<ActionsHandlerOptions>(
      (prev, cur) => {
        return (prev[cur] = options[cur])
      },
      {} as ActionsHandlerOptions
    )

    const actionsHandler = new ActionsHandler(wrapper, actionsHandlerOptions)

    actionsHandler.hooks.trigger('start', (e: TouchEvent) => {
      if (!this.enabled) return
    })

    actionsHandler.hooks.trigger('move', () => {})

    actionsHandler.hooks.trigger('end', () => {})
  }

  setScale(scale: number) {
    this.lastScale = isUndef(this.scale) ? scale : this.scale
    this.scale = scale
  }

  apply(actionsHandler: ActionsHandler) {
    actionsHandler.hooks.on('start', (e: TouchEvent) => {
      this.moved = false
      this.directionX = 0
      this.directionY = 0
      this.movingDirectionX = 0
      this.movingDirectionY = 0
      this.directionLocked = 0
      this.startTime = getNow()

      this.stop()

      let point = (e.touches ? e.touches[0] : e) as Touch

      this.startX = this.x
      this.startY = this.y
      this.absStartX = this.x
      this.absStartY = this.y
      this.pointX = point.pageX
      this.pointY = point.pageY
    })

    actionsHandler.hooks.on(
      'move',
      (e: TouchEvent, actionsHandler: ActionsHandler) => {
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
            actionsHandler.initiated = false
            return
          }
          deltaY = 0
        } else if (this.directionLocked === 'v') {
          if (eventPassthrough === 'horizontal') {
            e.preventDefault()
          } else if (eventPassthrough === 'vertical') {
            actionsHandler.initiated = false
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

        // whether to allow bounce scroll when outside of boundary
        const bounce = this.options.bounce as Partial<bounceConfig>
        if (bounce !== false) {
          top = bounce.top === undefined ? true : bounce.top
          bottom = bounce.bottom === undefined ? true : bounce.bottom
          left = bounce.left === undefined ? true : bounce.left
          right = bounce.right === undefined ? true : bounce.right
        }
        // Slow down or stop if outside of the boundaries
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
          actionsHandler.bs.trigger('scrollStart')
        }

        this.translate(newX, newY)

        // dispatch scroll in interval time
        if (timestamp - this.startTime > momentumLimitTime) {
          this.startTime = timestamp
          this.startX = this.x
          this.startY = this.y

          if (probeType === PROBE_THROTTLE) {
            actionsHandler.bs.trigger('scroll', {
              x: this.x,
              y: this.y
            })
          }
        }

        // dispatch scroll in real time
        if (probeType > PROBE_THROTTLE) {
          actionsHandler.bs.trigger('scroll', {
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
          pX > document.documentElement.clientWidth - momentumLimitDistance ||
          pX < momentumLimitDistance ||
          pY < momentumLimitDistance ||
          pY > document.documentElement.clientHeight - momentumLimitDistance
        ) {
          actionsHandler.end(e)
        }
      }
    )

    actionsHandler.hooks.on(
      'end',
      (actionsHandler: ActionsHandler, e: TouchEvent) => {
        actionsHandler.bs.trigger('touchEnd', {
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

        if (actionsHandler.hooks.trigger('beforeCheckClick') === true) {
          return
        }

        // check if it is a click operation
        if (this.checkClick(e)) {
          actionsHandler.bs.trigger('scrollCancel')
          return
        }

        // reset if we are outside of the boundaries
        if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
          return
        }

        this.translate(newX, newY)

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
          actionsHandler.bs.trigger('flick')
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

        actionsHandler.bs.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        })
      }
    )
  }

  refresh() {
    const wrapper = this.wrapper as HTMLElement
    const isWrapperStatic =
      window.getComputedStyle(wrapper, null).position === 'static'
    let wrapperRect = getRect(wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let scrollElementRect = getRect(this.scrollElement)
    this.scrollElementWidth = Math.round(scrollElementRect.width * this.scale)
    this.scrollElementHeight = Math.round(scrollElementRect.height * this.scale)

    this.relativeX = scrollElementRect.left
    this.relativeY = scrollElementRect.top

    if (isWrapperStatic) {
      this.relativeX -= wrapperRect.left
      this.relativeY -= wrapperRect.top
    }

    this.minScrollX = 0
    this.minScrollY = 0

    this.hasHorizontalScroll =
      this.options.scrollX && this.maxScrollX < this.minScrollX
    this.hasVerticalScroll =
      this.options.scrollY && this.maxScrollY < this.minScrollY

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = this.minScrollX
      this.scrollElementWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = this.minScrollY
      this.scrollElementHeight = this.wrapperHeight
    }

    this.endTime = 0
    this.directionX = 0
    this.directionY = 0
    this.wrapperOffset = offset(wrapper)
  }

  transitionTime(time = 0) {
    this.scrollElement.style[style.transitionDuration as any] = time + 'ms'
  }
  transitionTimingFunction(easing: string) {
    this.scrollElement.style[style.transitionTimingFunction as any] = easing
  }
  startProbe() {
    cancelAnimationFrame(this.probeTimer)

    const probe = () => {
      let pos = this.getComputedPosition()
      this.hooks.trigger(this.hooks.eventTypes.scroll, pos)
      if (!this.isInTransition) {
        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, pos)
        return
      }
      this.probeTimer = requestAnimationFrame(probe)
    }

    this.probeTimer = requestAnimationFrame(probe)
  }

  scrollBy(deltaX: number, deltaY: number, time = 0, easing = ease.bounce) {
    deltaX += this.x
    deltaY += this.y

    this.scrollTo(deltaX, deltaY, time, easing)
  }

  scrollTo(destX: number, destY: number, time = 0, easing = ease.bounce) {
    const { useTransition, probeType } = this.options
    this.isInTransition =
      useTransition && time > 0 && (destX !== this.x || destY !== this.y)

    if (!time || useTransition) {
      this.transitionTimingFunction(easing.style)
      this.transitionTime(time)
      this.translate(destX, destY)

      if (time && probeType === Probe.Realtime) {
        this.startProbe()
      }

      if (!time && (destX !== this.x || destY !== this.y)) {
        this.hooks.trigger(this.hooks.eventTypes.scroll, {
          destX,
          destY
        })
        // force reflow to put everything in position
        this._reflow = document.body.offsetHeight
        if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
          this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
            x: this.x,
            y: this.y
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
    easing: {
      style: string
      fn: (t: number) => number
    }
  ) {
    if (!el) {
      return
    }
    el = ((el as HTMLElement).nodeType
      ? el
      : this.element.querySelector(el as string)) as HTMLElement

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

    this.scrollTo(pos.left, pos.top, time, easing)
  }

  private animate(
    destX: number,
    destY: number,
    duration: number,
    easingFn: Function
  ) {
    let startX = this.x
    let startY = this.y
    let startScale = this.lastScale
    let destScale = this.scale
    let startTime = getNow()
    let destTime = startTime + duration

    const step = () => {
      let now = getNow()

      if (now >= destTime) {
        this.isAnimating = false
        this.translate(destX, destY, destScale)

        this.hooks.trigger(this.hooks.eventTypes.scroll, {
          x: this.x,
          y: this.y
        })

        if (!this.resetPosition(this.options.bounceTime)) {
          this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
            x: this.x,
            y: this.y
          })
        }
        return
      }
      now = (now - startTime) / duration
      let easing = easingFn(now)
      let newX = (destX - startX) * easing + startX
      let newY = (destY - startY) * easing + startY
      let newScale = (destScale - startScale) * easing + startScale

      this.translate(newX, newY, newScale)

      if (this.isAnimating) {
        this.animateTimer = requestAnimationFrame(step)
      }

      if (this.options.probeType === Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.scroll, {
          x: this.x,
          y: this.y
        })
      }
    }

    this.isAnimating = true
    cancelAnimationFrame(this.animateTimer)
    step()
  }

  translate(x: number, y: number, scale?: number) {
    assert(!isUndef(x) && !isUndef(y), 'Translate x or y is null or undefined.')
    if (isUndef(scale)) {
      scale = this.scale
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

    this.x = x
    this.y = y

    this.setScale(scale as number)
  }

  stop() {
    if (this.options.useTransition && this.isInTransition) {
      this.isInTransition = false
      cancelAnimationFrame(this.probeTimer)
      let pos = this.getComputedPosition()
      this.transitionTime()
      this.translate(pos.x, pos.y)
      this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
        x: this.x,
        y: this.y
      })
      this.stopFromTransition = true
    } else if (!this.options.useTransition && this.isAnimating) {
      this.isAnimating = false
      cancelAnimationFrame(this.animateTimer)
      this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
        x: this.x,
        y: this.y
      })
      this.stopFromTransition = true
    }
  }

  getComputedPosition() {
    let matrix = window.getComputedStyle(this.scrollElement, null) as any
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
}
