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
  getRect,
  EaseObj
} from '../util'

export default class Scroller {
  wrapper: HTMLElement
  element: HTMLElement
  actionsHandler: ActionsHandler
  translater: Position | Transform
  animater: Animation | Transition
  hooks: EventEmitter
  options: BScrollOptions
  enabled: boolean
  startX: number
  startY: number
  absStartX: number
  absStartY: number
  pointX: number
  pointY: number
  moved: boolean
  wrapperWidth: number
  wrapperHeight: number
  elementWidth: number
  elementHeight: number
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
  startTime: number
  endTime: number
  constructor(wrapper: HTMLElement, options: BScrollOptions) {
    this.hooks = new EventEmitter(['scroll', 'scrollEnd'])
    this.wrapper = wrapper
    this.element = wrapper.children[0] as HTMLElement
    this.options = options

    const translater = this.options.useTransform
      ? new Transform(this.element, {
          translateZ: this.options.translateZ
        })
      : new Position(this.element)

    this.animater = this.options.useTransition
      ? new Transition(this.element, translater, {
          probeType: this.options.probeType,
          bounceTime: this.options.bounceTime
        })
      : new Animation(this.element, translater)

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

  refresh() {
    const wrapper = this.wrapper as HTMLElement
    const isWrapperStatic =
      window.getComputedStyle(wrapper, null).position === 'static'
    let wrapperRect = getRect(wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let elementRect = getRect(this.element)
    this.elementWidth = Math.round(elementRect.width * this.translater.scale)
    this.elementHeight = Math.round(elementRect.height * this.translater.scale)

    this.relativeX = elementRect.left
    this.relativeY = elementRect.top

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
      this.elementWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = this.minScrollY
      this.elementHeight = this.wrapperHeight
    }

    this.endTime = 0
    this.directionX = 0
    this.directionY = 0
    this.wrapperOffset = offset(wrapper)
  }

  scrollBy(deltaX: number, deltaY: number, time = 0, easing = ease.bounce) {
    deltaX += this.translater.x
    deltaY += this.translater.y

    this.scrollTo(deltaX, deltaY, time, easing)
  }

  scrollTo(x: number, y: number, time = 0, easing = ease.bounce) {
    const easingFn = this.options.useTransition ? easing.style : easing.fn

    // when x or y has changed
    if (x !== this.translater.x || y !== this.translater.y) {
      this.animater.scrollTo(x, y, time, easingFn as any)
    }
  }

  scrollToElement(
    el: HTMLElement | string,
    time: number,
    offsetX: number | boolean,
    offsetY: number | boolean,
    easing: EaseObj
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
}
