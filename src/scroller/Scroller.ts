import ActionsHandler, {
  Options as ActionsHandlerOptions
} from '../base/ActionsHandler'
import EventEmitter from '../base/EventEmitter'
import { Transform, Position } from '../translater'
import { Animation, Transition } from '../animater'
import BScrollOptions, { bounceConfig } from '../Options'

import {
  Direction,
  DirectionLock,
  Probe,
  style,
  ease,
  isUndef,
  getNow,
  offset,
  getRect
} from '../util'

export default class Scroller {
  wrapper: HTMLElement
  scrollElement: HTMLElement
  actionsHandler: ActionsHandler
  translater: Position | Transform
  animater: Animation | Transition
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
    this.translater = this.options.useTransform
      ? new Transform(this.scrollElement, {
          translateZ: this.options.translateZ
        })
      : new Position(this.scrollElement)
    this.animater = this.options.useTransition
      ? new Transition(this.scrollElement)
      : new Animation(this.scrollElement)
    this.options = options
    this.wrapper = wrapper
    this.scrollElement = wrapper.children[0] as HTMLElement
    this.x = 0
    this.y = 0

    const actionsHandler = new ActionsHandler(
      wrapper,
      this.createActionsHandlerOpt()
    )

    actionsHandler.hooks.trigger('start', () => {
      if (!this.enabled) return true

      this.moved = false
      this.directionX = 0
      this.directionY = 0
      this.movingDirectionX = 0
      this.movingDirectionY = 0
      this.directionLocked = DirectionLock.Default
    })

    actionsHandler.hooks.trigger('move', () => {})

    actionsHandler.hooks.trigger('end', () => {})
  }

  createActionsHandlerOpt() {
    const options = [
      'bindToWrapper',
      'click',
      'disableMouse',
      'preventDefault',
      'stopPropagation',
      'preventDefaultException'
    ].reduce<ActionsHandlerOptions>(
      (prev, cur) => {
        return (prev[cur] = this.options[cur])
      },
      {} as ActionsHandlerOptions
    )
    return options
  }

  setScale(scale: number) {
    this.lastScale = isUndef(this.scale) ? scale : this.scale
    this.scale = scale
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
    if (isUndef(scale)) {
      scale = this.scale
    }
    this.translater.setPosition(x, y, scale as number)

    this.x = x
    this.y = y

    this.setScale(scale as number)
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
