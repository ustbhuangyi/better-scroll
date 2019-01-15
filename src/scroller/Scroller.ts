import ActionsHandler, {
  Options as ActionsHandlerOptions
} from '../base/ActionsHandler'
import EventEmitter from '../base/EventEmitter'
import { Transform, Position } from '../translater'
import { Animation, Transition } from '../animater'
import BScrollOptions, { bounceConfig } from '../Options'

import {
  addEvent,
  removeEvent,
  Direction,
  DirectionLock,
  EventPassthrough,
  Probe,
  ease,
  offset,
  getRect,
  EaseFn,
  style,
  preventDefaultExceptionFn,
  TouchEvent,
  isAndroid,
  momentum,
  click,
  tap
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
  resizeTimeout: number
  startTime: number
  endTime: number
  constructor(wrapper: HTMLElement, options: BScrollOptions) {
    this.hooks = new EventEmitter([
      'scroll',
      'scrollEnd',
      'refresh',
      'beforeScrollStart',
      'scrollStart',
      'touchEnd',
      'flick',
      'scrollCancel'
    ])
    this.wrapper = wrapper
    this.element = wrapper.children[0] as HTMLElement
    this.options = options

    this.translater = this.options.useTransform
      ? new Transform(this.element, {
          translateZ: this.options.translateZ
        })
      : new Position(this.element)

    this.animater = this.options.useTransition
      ? new Transition(this.element, this.translater, {
          probeType: this.options.probeType,
          bounceTime: this.options.bounceTime
        })
      : new Animation(this.element, this.translater, {
          probeType: this.options.probeType,
          bounceTime: this.options.bounceTime
        })

    const actionsHandler = new ActionsHandler(
      wrapper,
      this.createActionsHandlerOpt()
    )

    this.enabled = true

    this.addDOMEvents()

    actionsHandler.hooks.on(
      actionsHandler.hooks.eventTypes.start,
      ({ timeStamp }: { timeStamp: number }) => {
        if (!this.enabled) return true

        this.moved = false
        this.directionX = Direction.Default
        this.directionY = Direction.Default
        this.movingDirectionX = Direction.Default
        this.movingDirectionY = Direction.Default
        this.directionLocked = DirectionLock.Default

        this.startX = this.translater.x
        this.startY = this.translater.y

        this.absStartX = this.translater.x
        this.absStartY = this.translater.y

        this.startTime = timeStamp
        // force stopping last transition or animation
        this.animater.stop()

        this.hooks.trigger(this.hooks.eventTypes.beforeScrollStart)
      }
    )

    actionsHandler.hooks.on(
      actionsHandler.hooks.eventTypes.move,
      ({
        timeStamp,
        deltaX,
        deltaY,
        actionsHandler,
        e
      }: {
        timeStamp: number
        deltaX: number
        deltaY: number
        actionsHandler: ActionsHandler
        e: TouchEvent
      }) => {
        if (!this.enabled) return true

        const absDistX = Math.abs(deltaX)
        const absDistY = Math.abs(deltaY)

        // We need to move at least momentumLimitDistance pixels for the scrolling to initiate
        if (
          timeStamp - this.endTime > this.options.momentumLimitTime &&
          (absDistY < this.options.momentumLimitDistance &&
            absDistX < this.options.momentumLimitDistance)
        ) {
          return true
        }

        // If you are scrolling in one direction lock the other
        if (!this.directionLocked && !this.options.freeScroll) {
          if (absDistX > absDistY + this.options.directionLockThreshold) {
            this.directionLocked = DirectionLock.Horizontal // lock horizontally
          } else if (
            absDistY >=
            absDistX + this.options.directionLockThreshold
          ) {
            this.directionLocked = DirectionLock.Vertical // lock vertically
          } else {
            this.directionLocked = DirectionLock.None // no lock
          }
        }

        if (this.directionLocked === DirectionLock.Horizontal) {
          if (this.options.eventPassthrough === EventPassthrough.Vertical) {
            e.preventDefault()
          } else if (
            this.options.eventPassthrough === EventPassthrough.Horizontal
          ) {
            actionsHandler.initiated = false
            return true
          }
          deltaY = 0
        } else if (this.directionLocked === DirectionLock.Vertical) {
          if (this.options.eventPassthrough === EventPassthrough.Horizontal) {
            e.preventDefault()
          } else if (
            this.options.eventPassthrough === EventPassthrough.Vertical
          ) {
            actionsHandler.initiated = false
            return true
          }
          deltaX = 0
        }

        deltaX = this.hasHorizontalScroll ? deltaX : 0
        deltaY = this.hasVerticalScroll ? deltaY : 0

        this.movingDirectionX =
          deltaX > 0
            ? Direction.Right
            : deltaX < 0
            ? Direction.Left
            : Direction.Default
        this.movingDirectionY =
          deltaY > 0
            ? Direction.Down
            : deltaY < 0
            ? Direction.Up
            : Direction.Default

        let newX = this.translater.x + deltaX
        let newY = this.translater.y + deltaY

        let top = false
        let bottom = false
        let left = false
        let right = false

        // Slow down or stop if outside of the boundaries
        const bounce = this.options.bounce as Partial<bounceConfig>
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
            newX = this.translater.x + deltaX / 3
          } else {
            newX = newX > this.minScrollX ? this.minScrollX : this.maxScrollX
          }
        }
        if (newY > this.minScrollY || newY < this.maxScrollY) {
          if (
            (newY > this.minScrollY && top) ||
            (newY < this.maxScrollY && bottom)
          ) {
            newY = this.translater.y + deltaY / 3
          } else {
            newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY
          }
        }

        if (!this.moved) {
          this.moved = true
          this.hooks.trigger(this.hooks.eventTypes.scrollStart)
        }

        this.animater.translate(newX, newY, this.translater.scale)

        // dispatch scroll in interval time
        if (timeStamp - this.startTime > this.options.momentumLimitTime) {
          // refresh time and start position to initiate a momentum
          this.startTime = timeStamp
          this.startX = this.translater.x
          this.startY = this.translater.y

          if (this.options.probeType === Probe.Throttle) {
            this.hooks.trigger(this.hooks.eventTypes.scroll, {
              x: this.translater.x,
              y: this.translater.y
            })
          }
        }

        // dispatch scroll all the time
        if (this.options.probeType > Probe.Throttle) {
          this.hooks.trigger(this.hooks.eventTypes.scroll, {
            x: this.translater.x,
            y: this.translater.y
          })
        }
      }
    )

    actionsHandler.hooks.on(
      actionsHandler.hooks.eventTypes.end,
      (e: TouchEvent) => {
        if (!this.enabled) return true

        const { x, y, scale } = this.translater
        this.hooks.trigger(this.hooks.eventTypes.touchEnd, {
          x,
          y
        })

        this.animater.pending = false

        // ensures that the last position is rounded
        let newX = Math.round(x)
        let newY = Math.round(y)

        let deltaX = newX - this.absStartX
        let deltaY = newY - this.absStartY
        this.directionX =
          deltaX > 0
            ? Direction.Right
            : deltaX < 0
            ? Direction.Left
            : Direction.Default
        this.directionY =
          deltaY > 0
            ? Direction.Down
            : deltaY < 0
            ? Direction.Up
            : Direction.Default

        // TODO PullDown

        // check if it is a click operation
        if (this.checkClick(e)) {
          this.hooks.trigger(this.hooks.eventTypes.scrollCancel)
          return
        }

        // reset if we are outside of the boundaries
        if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
          return
        }

        this.animater.translate(newX, newY, scale)

        this.endTime = e.timeStamp
        let duration = this.endTime - this.startTime
        let absDistX = Math.abs(newX - this.startX)
        let absDistY = Math.abs(newY - this.startY)

        // flick
        if (
          duration < this.options.flickLimitTime &&
          absDistX < this.options.flickLimitDistance &&
          absDistY < this.options.flickLimitDistance
        ) {
          this.hooks.trigger('flick')
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
            (this.directionX === Direction.Right && left) ||
            (this.directionX === Direction.Left && right)
              ? this.wrapperWidth
              : 0
          const wrapperHeight =
            (this.directionY === Direction.Down && top) ||
            (this.directionY === Direction.Up && bottom)
              ? this.wrapperHeight
              : 0

          let momentumX = this.hasHorizontalScroll
            ? momentum(
                this.translater.x,
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
                this.translater.y,
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
          this.animater.pending = true
        }

        let easing
        if (newX !== this.translater.x || newY !== this.translater.y) {
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

        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
          x: this.translater.x,
          y: this.translater.y
        })
      }
    )
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
        prev[cur] = this.options[cur]
        return prev
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

    this.maxScrollX = this.wrapperWidth - this.elementWidth
    this.maxScrollY = this.wrapperHeight - this.elementHeight
    if (this.maxScrollX < 0) {
      this.maxScrollX -= this.relativeX
      this.minScrollX = -this.relativeX
    } else if (this.translater.scale > 1) {
      this.maxScrollX = this.maxScrollX / 2 - this.relativeX
      this.minScrollX = this.maxScrollX
    }
    if (this.maxScrollY < 0) {
      this.maxScrollY -= this.relativeY
      this.minScrollY = -this.relativeY
    } else if (this.translater.scale > 1) {
      this.maxScrollY = this.maxScrollY / 2 - this.relativeY
      this.minScrollY = this.maxScrollY
    }

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

    this.animater.refresh({
      minScrollX: this.minScrollX,
      maxScrollX: this.maxScrollX,
      minScrollY: this.minScrollY,
      maxScrollY: this.maxScrollY,
      hasHorizontalScroll: this.hasHorizontalScroll,
      hasVerticalScroll: this.hasVerticalScroll
    })
  }

  private addDOMEvents() {
    const eventOperation = addEvent
    this.handleDOMEvents(eventOperation)
  }

  private removeDOMEvents() {
    const eventOperation = removeEvent
    this.handleDOMEvents(eventOperation)
  }

  private handleDOMEvents(eventOperation: Function) {
    eventOperation(window, 'orientationchange', this)
    eventOperation(window, 'resize', this)

    eventOperation(this.element, style.transitionEnd, this)
  }
  private handleEvent(e: TouchEvent) {
    switch (e.type) {
      case 'orientationchange':
      case 'resize':
        this.resize()
        break
      case 'click':
        // ensure click event triggered only once in pc
        if (this.enabled && !e._constructed) {
          if (
            !preventDefaultExceptionFn(
              e.target,
              this.options.preventDefaultException
            )
          ) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this.transitionEnd(e)
        break
    }
  }

  private resize() {
    if (!this.enabled) {
      return
    }
    // fix a scroll problem under Android condition
    if (isAndroid) {
      this.wrapper.scrollTop = 0
    }
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = window.setTimeout(() => {
      this.refresh()
    }, this.options.resizePolling)
  }

  private transitionEnd(e: TouchEvent) {
    // ensure pending
    if (e.target !== this.element || !this.animater.pending) {
      return
    }

    ;(this.animater as Transition).transitionTime()
    // TODO when pullingDown, do not reset position
    // const needReset = this.movingDirectionY === Direction.Up
    if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
      this.animater.pending = false
      if (this.options.probeType !== Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
          x: this.translater.x,
          y: this.translater.y
        })
      }
    }
  }

  private checkClick(e: TouchEvent) {
    // when in the process of pulling down, it should not prevent click
    let preventClick = this.animater.forceStopped
    this.animater.forceStopped = false

    // we scrolled less than momentumLimitDistance pixels
    if (!this.moved) {
      if (!preventClick) {
        if (this.options.tap) {
          tap(e, this.options.tap)
        }
        if (
          this.options.click &&
          !preventDefaultExceptionFn(
            e.target,
            this.options.preventDefaultException
          )
        ) {
          click(e)
        }
        return true
      }
      return false
    }
    return false
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
      this.animater.scrollTo(x, y, time, easingFn)
    }
  }

  scrollToElement(
    el: HTMLElement | string,
    time: number,
    offsetX: number | boolean,
    offsetY: number | boolean,
    easing: {
      style: string
      fn: EaseFn
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

  resetPosition(time = 0, easing = ease.bounce) {
    return this.animater.resetPosition(time, easing)
  }
}
