import ActionsHandler, {
  Options as ActionsHandlerOptions
} from '../base/ActionsHandler'
import EventEmitter from '../base/EventEmitter'
import EventRegister from '../base/EventRegister'
import { Transform, Position } from '../translater'
import { Animation, Transition } from '../animater'
import BScrollOptions, { bounceConfig } from '../Options'
import Behavior, { Options as BehaviorOptions } from './Behavior'

import {
  Direction,
  DirectionLock,
  EventPassthrough,
  Probe,
  ease,
  offset,
  EaseFn,
  style,
  preventDefaultExceptionFn,
  TouchEvent,
  isAndroid,
  click,
  tap,
  isUndef
} from '../util'

export default class Scroller {
  wrapper: HTMLElement
  element: HTMLElement
  actionsHandler: ActionsHandler
  translater: Position | Transform
  animater: Animation | Transition
  scrollBehaviorX: Behavior
  scrollBehaviorY: Behavior
  hooks: EventEmitter
  resizeRegister: EventRegister
  transitionEndRegister: EventRegister
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
    this.enabled = true
    this.x = 0
    this.y = 0

    this.scrollBehaviorX = new Behavior(
      wrapper,
      this.createBehaviorOpt('scrollX')
    ) // direction X
    this.scrollBehaviorY = new Behavior(
      wrapper,
      this.createBehaviorOpt('scrollY')
    ) // direction Y

    this.translater = this.options.useTransform
      ? new Transform(this.element, {
          translateZ: this.options.translateZ
        })
      : new Position(this.element)

    this.animater = this.options.useTransition
      ? new Transition(this.element, this.translater, {
          probeType: this.options.probeType
        })
      : new Animation(this.element, this.translater, {
          probeType: this.options.probeType
        })

    this.actionsHandler = new ActionsHandler(
      wrapper,
      this.createActionsHandlerOpt()
    )

    const resizeHandler = this.resize.bind(this)
    this.resizeRegister = new EventRegister(window, [
      {
        name: 'orientationchange',
        handler: resizeHandler
      },
      {
        name: 'resize',
        handler: resizeHandler
      }
    ])

    this.transitionEndRegister = new EventRegister(this.element, [
      {
        name: style.transitionEnd,
        handler: this.transitionEnd.bind(this)
      }
    ])

    // reset position
    this.animater.hooks.on(this.animater.hooks.eventTypes.end, () => {
      if (!this.resetPosition(this.options.bounceTime)) {
        this.hooks.trigger(this.hooks.eventTypes.scrollEnd)
      }
    })
    // scroll
    this.animater.hooks.on(this.animater.hooks.eventTypes.moving, () => {
      this.hooks.trigger(this.hooks.eventTypes.scroll)
    })
    // [mouse|touch]start event
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.start,
      ({ timeStamp }: { timeStamp: number }) => {
        if (!this.enabled) return true

        this.moved = false
        this.directionLocked = DirectionLock.Default
        this.startTime = timeStamp

        this.scrollBehaviorX.start()
        this.scrollBehaviorY.start()

        // force stopping last transition or animation
        this.animater.stop()

        this.hooks.trigger(this.hooks.eventTypes.beforeScrollStart)
      }
    )
    // [mouse|touch]move event
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.move,
      ({
        deltaX,
        deltaY,
        e
      }: {
        deltaX: number
        deltaY: number
        e: TouchEvent
      }) => {
        if (!this.enabled) return true

        const absDistX = Math.abs(deltaX)
        const absDistY = Math.abs(deltaY)

        // We need to move at least momentumLimitDistance pixels
        // for the scrolling to initiate
        if (
          e.timeStamp - this.endTime > this.options.momentumLimitTime &&
          (absDistY < this.options.momentumLimitDistance &&
            absDistX < this.options.momentumLimitDistance)
        ) {
          return true
        }

        this.computeDirectionLock(absDistX, absDistY)

        this.handleEventPassthrough(e)

        deltaX = this.ajustDelta(deltaX, deltaY).deltaX
        deltaY = this.ajustDelta(deltaX, deltaY).deltaY

        const { left, right, top, bottom } = this.options.bounce

        const newX = this.scrollBehaviorX.move(deltaX, [left, right])
        const newY = this.scrollBehaviorY.move(deltaY, [top, bottom])

        if (!this.moved) {
          this.moved = true
          this.hooks.trigger(this.hooks.eventTypes.scrollStart)
        }

        this.animater.translate(newX, newY)

        // refresh all positions
        this.scrollBehaviorX.updatePosition(newX)
        this.scrollBehaviorY.updatePosition(newY)
        this.x = newX
        this.y = newY

        // dispatch scroll in interval time
        if (e.timeStamp - this.startTime > this.options.momentumLimitTime) {
          // refresh time and starting position to initiate a momentum
          this.startTime = e.timeStamp
          this.startX = this.x
          this.startY = this.y
          if (this.options.probeType === Probe.Throttle) {
            this.hooks.trigger(this.hooks.eventTypes.scroll, {
              x: this.x,
              y: this.y
            })
          }
        }

        // dispatch scroll all the time
        if (this.options.probeType > Probe.Throttle) {
          this.hooks.trigger(this.hooks.eventTypes.scroll, {
            x: this.x,
            y: this.y
          })
        }
      }
    )
    // [mouse|touch]end event
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.end,
      (e: TouchEvent) => {
        if (!this.enabled) return true

        this.hooks.trigger(this.hooks.eventTypes.touchEnd, {
          x: this.x,
          y: this.y
        })

        this.animater.pending = false

        // ensures that the last position is rounded
        let newX = Math.round(this.x)
        let newY = Math.round(this.y)
        let time = 0
        let easing = ease.swiper

        this.scrollBehaviorX.updateDirection()
        this.scrollBehaviorY.updateDirection()

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

        this.animater.translate(newX, newY)

        // refresh all positions
        this.scrollBehaviorX.updatePosition(newX)
        this.scrollBehaviorY.updatePosition(newY)
        this.x = newX
        this.y = newY

        this.endTime = e.timeStamp
        const duration = this.endTime - this.startTime
        const deltaX = Math.abs(newX - this.startX)
        const deltaY = Math.abs(newY - this.startY)

        // flick
        if (
          duration < this.options.flickLimitTime &&
          deltaX < this.options.flickLimitDistance &&
          deltaY < this.options.flickLimitDistance
        ) {
          this.hooks.trigger('flick')
          return
        }
        // start momentum animation if needed
        const momentumX = this.scrollBehaviorX.end({
          duration,
          bounces: [this.options.bounce.left, this.options.bounce.right],
          startX: this.startX
        })
        const momentumY = this.scrollBehaviorY.end({
          duration,
          bounces: [this.options.bounce.top, this.options.bounce.bottom],
          startX: this.startX
        })

        newX = isUndef(momentumX.destination)
          ? newX
          : (momentumX.destination as number)
        newY = isUndef(momentumY.destination)
          ? newY
          : (momentumY.destination as number)
        time = isUndef(momentumX.duration)
          ? time
          : (momentumX.duration as number)

        // when x or y changed, do momentum animation now!
        if (newX !== this.x || newY !== this.y) {
          // change easing function when scroller goes out of the boundaries
          if (
            newX > this.scrollBehaviorX.minScrollSize ||
            newX < this.scrollBehaviorX.maxScrollSize ||
            newY > this.scrollBehaviorY.minScrollSize ||
            newY < this.scrollBehaviorY.maxScrollSize
          ) {
            easing = ease.swipeBounce
          }
          this.scrollTo(newX, newY, time, easing)
          return
        }

        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
          x: this.x,
          y: this.y
        })
      }
    )

    // click
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.click,
      (e: TouchEvent) => {
        // handle native click event
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
      }
    )
  }

  private computeDirectionLock(absDistX: number, absDistY: number) {
    // If you are scrolling in one direction, lock it
    if (
      this.directionLocked === Direction.Default &&
      !this.options.freeScroll
    ) {
      if (absDistX > absDistY + this.options.directionLockThreshold) {
        this.directionLocked = DirectionLock.Horizontal // lock horizontally
      } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
        this.directionLocked = DirectionLock.Vertical // lock vertically
      } else {
        this.directionLocked = DirectionLock.None // no lock
      }
    }
  }

  private handleEventPassthrough(e: TouchEvent) {
    if (this.directionLocked === DirectionLock.Horizontal) {
      if (this.options.eventPassthrough === EventPassthrough.Vertical) {
        e.preventDefault()
      } else if (
        this.options.eventPassthrough === EventPassthrough.Horizontal
      ) {
        this.actionsHandler.initiated = false
        return true
      }
    } else if (this.directionLocked === DirectionLock.Vertical) {
      if (this.options.eventPassthrough === EventPassthrough.Horizontal) {
        e.preventDefault()
      } else if (this.options.eventPassthrough === EventPassthrough.Vertical) {
        this.actionsHandler.initiated = false
        return true
      }
    }
  }

  private ajustDelta(deltaX: number, deltaY: number) {
    if (this.directionLocked === DirectionLock.Horizontal) {
      deltaY = 0
    } else if (this.directionLocked === DirectionLock.Vertical) {
      deltaX = 0
    }
    return {
      deltaX,
      deltaY
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
          x: this.x,
          y: this.y
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

  createActionsHandlerOpt() {
    const options = [
      'click',
      'bindToWrapper',
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

  createBehaviorOpt(extraProp: 'scrollX' | 'scrollY') {
    const options = [
      'momentum',
      'momentumLimitTime',
      'momentumLimitDistance',
      'deceleration',
      'swipeBounceTime',
      'swipeTime'
    ].reduce<BehaviorOptions>(
      (prev, cur) => {
        prev[cur] = this.options[cur]
        return prev
      },
      {} as BehaviorOptions
    )
    // add extra property
    options.scrollable = this.options[extraProp]
    return options
  }

  refresh() {
    this.scrollBehaviorX.refresh({
      size: 'width',
      position: 'left'
    })
    this.scrollBehaviorX.refresh({
      size: 'height',
      position: 'top'
    })

    this.endTime = 0
    this.wrapperOffset = offset(this.wrapper)
  }

  scrollBy(deltaX: number, deltaY: number, time = 0, easing = ease.bounce) {
    deltaX += this.x
    deltaY += this.y

    this.scrollTo(deltaX, deltaY, time, easing)
  }

  scrollTo(x: number, y: number, time = 0, easing = ease.bounce) {
    const easingFn = this.options.useTransition ? easing.style : easing.fn

    // when x or y has changed
    if (x !== this.x || y !== this.y) {
      this.animater.scrollTo([this.x, x], [this.y, y], time, easingFn)
      this.scrollBehaviorX.updatePosition(x)
      this.scrollBehaviorY.updatePosition(y)
      this.x = x
      this.y = y
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
      pos.left > this.scrollBehaviorX.minScrollSize
        ? this.scrollBehaviorX.minScrollSize
        : pos.left < this.scrollBehaviorX.maxScrollSize
        ? this.scrollBehaviorX.maxScrollSize
        : pos.left
    pos.top =
      pos.top > this.scrollBehaviorY.minScrollSize
        ? this.scrollBehaviorY.minScrollSize
        : pos.top < this.scrollBehaviorY.maxScrollSize
        ? this.scrollBehaviorY.maxScrollSize
        : pos.top

    this.scrollTo(pos.left, pos.top, time, easing)
  }

  resetPosition(time = 0, easing = ease.bounce) {
    const x = this.scrollBehaviorX.limitPosition()
    const y = this.scrollBehaviorY.limitPosition()
    // in boundary
    if (x === this.x && y === this.y) {
      return false
    }
    // out of boundary
    this.scrollTo(x, y, time, easing)
    // refresh all positions
    this.scrollBehaviorX.updatePosition(x)
    this.scrollBehaviorY.updatePosition(y)
    this.x = x
    this.y = y
    return true
  }
}
