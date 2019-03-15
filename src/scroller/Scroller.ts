import ActionsHandler, {
  Options as ActionsHandlerOptions
} from '../base/ActionsHandler'
import EventEmitter from '../base/EventEmitter'
import EventRegister from '../base/EventRegister'
import Translater from '../translater'
import createAnimater, { Animation, Transition } from '../animater'
import { Options as BScrollOptions, bounceConfig } from '../Options'
import Behavior, { Options as BehaviorOptions } from './Behavior'
import { Direction, DirectionLock, EventPassthrough, Probe } from '../enums'

import {
  ease,
  offset,
  EaseFn,
  style,
  preventDefaultExceptionFn,
  TouchEvent,
  isAndroid,
  click,
  dblclick,
  tap,
  isUndef,
  getNow,
  bubbling
} from '../util'

export default class Scroller {
  wrapper: HTMLElement
  element: HTMLElement
  actionsHandler: ActionsHandler
  translater: Translater
  animater: Animation | Transition
  scrollBehaviorX: Behavior
  scrollBehaviorY: Behavior
  hooks: EventEmitter
  resizeRegister: EventRegister
  transitionEndRegister: EventRegister
  options: BScrollOptions
  enabled: boolean
  moved: boolean
  directionLocked: string | number
  wrapperOffset: {
    left: number
    top: number
  }
  resizeTimeout: number
  startTime: number
  endTime: number
  lastClickTime: number | null
  constructor(wrapper: HTMLElement, options: BScrollOptions) {
    this.hooks = new EventEmitter([
      'scroll',
      'scrollEnd',
      'refresh',
      'beforeStart',
      'beforeScrollStart',
      'scrollStart',
      'beforeMove',
      'touchEnd',
      'flick',
      'scrollCancel',
      'beforeEnd',
      'end',
      'modifyScrollMeta',
      'scrollTo',
      'scrollToElement'
    ])
    this.wrapper = wrapper
    this.element = wrapper.children[0] as HTMLElement
    this.options = options
    this.enabled = true

    // direction X
    this.scrollBehaviorX = new Behavior(
      wrapper,
      this.createBehaviorOpt('scrollX')
    )
    // direction Y
    this.scrollBehaviorY = new Behavior(
      wrapper,
      this.createBehaviorOpt('scrollY')
    )

    this.translater = new Translater(this.element)

    this.animater = createAnimater(this.element, this.translater, this.options)

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

    this.init()

    this.bubblingEvent()
  }

  private init() {
    this.initTranslater()
    this.initAnimater()
    this.initActionsHandler()
  }

  private initTranslater() {
    this.translater.hooks.on(
      this.translater.hooks.eventTypes.beforeTranslate,
      (transformStyle: string[], point: { x: number; y: number }) => {
        if (this.options.translateZ) {
          transformStyle.push(this.options.translateZ)
        }
        const { x, y } = point
        this.updateAllPositions(x, y)
      }
    )
  }

  private initAnimater() {
    // translate
    this.animater.hooks.on(
      this.animater.hooks.eventTypes.translate,
      ({ x, y }: { x: number; y: number }) => {
        this.updateAllPositions(x, y)
      }
    )

    // reset position
    this.animater.hooks.on(
      this.animater.hooks.eventTypes.end,
      (pos: { x: number; y: number }) => {
        if (!this.resetPosition(this.options.bounceTime)) {
          this.hooks.trigger(this.hooks.eventTypes.scrollEnd, pos)
        }
      }
    )

    // scroll
    this.animater.hooks.on(
      this.animater.hooks.eventTypes.move,
      (pos: { x: number; y: number }) => {
        this.hooks.trigger(this.hooks.eventTypes.scroll, pos)
      }
    )
  }

  private initActionsHandler() {
    // [mouse|touch]start event
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.start,
      (e: TouchEvent) => {
        if (!this.enabled) return true
        return this.handleStart(e)
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
        console.log(this)
        if (!this.enabled) return true
        if (this.hooks.trigger(this.hooks.eventTypes.beforeMove, e)) {
          return
        }
        return this.handleMove(deltaX, deltaY, e)
      }
    )
    // [mouse|touch]end event
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.end,
      (e: TouchEvent) => {
        if (!this.enabled) return true
        if (this.hooks.trigger(this.hooks.eventTypes.beforeEnd, e)) {
          return
        }

        return this.handleEnd(e)
      }
    )

    // click
    this.actionsHandler.hooks.on(
      this.actionsHandler.hooks.eventTypes.click,
      (e: TouchEvent) => {
        // handle native click event
        if (this.enabled && !e._constructed) {
          this.handleClick(e)
        }
      }
    )
  }

  private handleStart(e: TouchEvent) {
    const timestamp = getNow()
    this.moved = false
    this.directionLocked = DirectionLock.Default
    this.startTime = timestamp

    this.scrollBehaviorX.start()
    this.scrollBehaviorY.start()

    // force stopping last transition or animation
    this.animater.stop()

    this.scrollBehaviorX.updateStartPos()
    this.scrollBehaviorX.updateAbsStartPos()
    this.scrollBehaviorY.updateStartPos()
    this.scrollBehaviorY.updateAbsStartPos()

    this.hooks.trigger(this.hooks.eventTypes.beforeStart, e)
    this.hooks.trigger(this.hooks.eventTypes.beforeScrollStart, e) // just for event api
  }

  private handleMove(deltaX: number, deltaY: number, e: TouchEvent) {
    this.scrollBehaviorX.updateDist(deltaX)
    this.scrollBehaviorY.updateDist(deltaY)

    const absDistX = Math.abs(this.scrollBehaviorX.dist)
    const absDistY = Math.abs(this.scrollBehaviorY.dist)
    const timestamp = getNow()
    // We need to move at least momentumLimitDistance pixels
    // for the scrolling to initiate
    if (
      timestamp - this.endTime > this.options.momentumLimitTime &&
      (absDistY < this.options.momentumLimitDistance &&
        absDistX < this.options.momentumLimitDistance)
    ) {
      return true
    }

    this.computeDirectionLock(absDistX, absDistY)

    this.handleEventPassthrough(e)

    deltaX = this.adjustDelta(deltaX, deltaY).deltaX
    deltaY = this.adjustDelta(deltaX, deltaY).deltaY

    const { left = true, right = true, top = true, bottom = true } = this
      .options.bounce as bounceConfig

    const newX = this.scrollBehaviorX.move(deltaX, [left, right])
    const newY = this.scrollBehaviorY.move(deltaY, [top, bottom])

    if (!this.moved) {
      this.moved = true
      this.hooks.trigger(this.hooks.eventTypes.scrollStart)
    }

    this.animater.translate({
      x: newX,
      y: newY
    })

    // dispatch scroll in interval time
    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      // refresh time and starting position to initiate a momentum
      this.startTime = timestamp
      this.scrollBehaviorX.updateStartPos()
      this.scrollBehaviorY.updateStartPos()
      if (this.options.probeType === Probe.Throttle) {
        this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos())
      }
    }

    // dispatch scroll all the time
    if (this.options.probeType > Probe.Throttle) {
      this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos())
    }
  }

  private handleEnd(e: TouchEvent) {
    const { x, y } = this.getCurrentPos()

    this.hooks.trigger(this.hooks.eventTypes.touchEnd, {
      x,
      y
    })

    this.animater.pending = false

    // ensures that the last position is rounded
    let newX = Math.round(x)
    let newY = Math.round(y)

    this.scrollBehaviorX.updateDirection()
    this.scrollBehaviorY.updateDirection()

    if (this.hooks.trigger(this.hooks.eventTypes.end, e)) {
      return
    }

    // check if it is a click operation
    if (this.checkClick(e)) {
      this.hooks.trigger(this.hooks.eventTypes.scrollCancel)
      return
    }

    // reset if we are outside of the boundaries
    if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
      return
    }
    this.animater.translate({
      x: newX,
      y: newY
    })

    this.endTime = getNow()
    const duration = this.endTime - this.startTime
    const deltaX = Math.abs(newX - this.scrollBehaviorX.startPos)
    const deltaY = Math.abs(newY - this.scrollBehaviorY.startPos)
    // flick
    if (
      duration < this.options.flickLimitTime &&
      deltaX < this.options.flickLimitDistance &&
      deltaY < this.options.flickLimitDistance
    ) {
      this.hooks.trigger('flick')
      return
    }

    const scrollMeta = {
      time: 0,
      easing: ease.swiper,
      newX,
      newY
    }

    const { left = true, right = true, top = true, bottom = true } = this
      .options.bounce as bounceConfig
    // start momentum animation if needed
    const momentumX = this.scrollBehaviorX.end({
      duration,
      bounces: [left, right]
    })
    const momentumY = this.scrollBehaviorY.end({
      duration,
      bounces: [top, bottom]
    })

    scrollMeta.newX = isUndef(momentumX.destination)
      ? scrollMeta.newX
      : (momentumX.destination as number)
    scrollMeta.newY = isUndef(momentumY.destination)
      ? scrollMeta.newY
      : (momentumY.destination as number)
    scrollMeta.time = Math.max(
      momentumX.duration as number,
      momentumY.duration as number
    )

    this.hooks.trigger(this.hooks.eventTypes.modifyScrollMeta, scrollMeta, this)

    const currentPos = this.getCurrentPos()
    // when x or y changed, do momentum animation now!
    if (scrollMeta.newX !== currentPos.x || scrollMeta.newY !== currentPos.y) {
      // change easing function when scroller goes out of the boundaries
      if (
        scrollMeta.newX > this.scrollBehaviorX.minScrollPos ||
        scrollMeta.newX < this.scrollBehaviorX.maxScrollPos ||
        scrollMeta.newY > this.scrollBehaviorY.minScrollPos ||
        scrollMeta.newY < this.scrollBehaviorY.maxScrollPos
      ) {
        scrollMeta.easing = ease.swipeBounce
      }
      this.scrollTo(
        scrollMeta.newX,
        scrollMeta.newY,
        scrollMeta.time,
        scrollMeta.easing
      )
      return
    }

    this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
      x,
      y
    })
  }

  private handleClick(e: TouchEvent) {
    if (
      !preventDefaultExceptionFn(e.target, this.options.preventDefaultException)
    ) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  private bubblingEvent() {
    bubbling(this.animater.hooks, this.hooks, [
      {
        source: 'forceStop',
        target: 'scrollEnd'
      }
    ])
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
        this.actionsHandler.setInitiated()
        return true
      }
    } else if (this.directionLocked === DirectionLock.Vertical) {
      if (this.options.eventPassthrough === EventPassthrough.Horizontal) {
        e.preventDefault()
      } else if (this.options.eventPassthrough === EventPassthrough.Vertical) {
        this.actionsHandler.setInitiated()
        return true
      }
    }
  }

  private adjustDelta(deltaX: number, deltaY: number) {
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
        this.hooks.trigger(
          this.hooks.eventTypes.scrollEnd,
          this.getCurrentPos()
        )
      }
    }
  }

  private checkClick(e: TouchEvent) {
    // when in the process of pulling down, it should not prevent click
    let cancelable = {
      preventClick: this.animater.forceStopped
    }
    this.animater.forceStopped = false

    // we scrolled less than momentumLimitDistance pixels
    if (!this.moved) {
      if (this.hooks.trigger(this.hooks.eventTypes.checkClick)) return true
      if (!cancelable.preventClick) {
        const _dblclick = this.options.dblclick
        let dblclickTrigged = false
        if (_dblclick && this.lastClickTime) {
          const { delay = 300 } = _dblclick as any
          if (getNow() - this.lastClickTime < delay) {
            dblclickTrigged = true
            dblclick(e)
          }
        }
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
        this.lastClickTime = dblclickTrigged ? null : getNow()
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
    this.scrollBehaviorY.refresh({
      size: 'height',
      position: 'top'
    })

    this.endTime = 0
    this.wrapperOffset = offset(this.wrapper)
  }

  scrollBy(deltaX: number, deltaY: number, time = 0, easing = ease.bounce) {
    const { x, y } = this.getCurrentPos()
    deltaX += x
    deltaY += y

    this.scrollTo(deltaX, deltaY, time, easing)
  }

  scrollTo(
    x: number,
    y: number,
    time = 0,
    easing = ease.bounce,
    extraTransform = {
      start: {},
      end: {}
    },
    forceScroll?: boolean
  ) {
    const easingFn = this.options.useTransition ? easing.style : easing.fn
    const currentPos = this.getCurrentPos()
    this.hooks.trigger(this.hooks.eventTypes.scrollTo, currentPos)
    // when x or y has changed
    if (x !== currentPos.x || y !== currentPos.y || forceScroll) {
      const startPoint = {
        x: currentPos.x,
        y: currentPos.y,
        ...extraTransform.start
      }
      const endPoint = {
        x,
        y,
        ...extraTransform.end
      }
      this.animater.scrollTo(startPoint, endPoint, time, easingFn)
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
      pos.left > this.scrollBehaviorX.minScrollPos
        ? this.scrollBehaviorX.minScrollPos
        : pos.left < this.scrollBehaviorX.maxScrollPos
        ? this.scrollBehaviorX.maxScrollPos
        : pos.left
    pos.top =
      pos.top > this.scrollBehaviorY.minScrollPos
        ? this.scrollBehaviorY.minScrollPos
        : pos.top < this.scrollBehaviorY.maxScrollPos
        ? this.scrollBehaviorY.maxScrollPos
        : pos.top
    if (this.hooks.trigger(this.hooks.eventTypes.scrollToElement, el, pos))
      return
    this.scrollTo(pos.left, pos.top, time, easing)
  }

  resetPosition(time = 0, easing = ease.bounce) {
    const x = this.scrollBehaviorX.adjustPosition()
    const y = this.scrollBehaviorY.adjustPosition()
    const currentPos = this.getCurrentPos()
    // in boundary
    if (x === currentPos.x && y === currentPos.y) {
      return false
    }
    // out of boundary
    this.scrollTo(x, y, time, easing)

    return true
  }

  updateAllPositions(x: number, y: number) {
    this.scrollBehaviorX.updatePosition(x)
    this.scrollBehaviorY.updatePosition(y)
  }

  getCurrentPos() {
    return {
      x: this.scrollBehaviorX.currentPos,
      y: this.scrollBehaviorY.currentPos
    }
  }
}
