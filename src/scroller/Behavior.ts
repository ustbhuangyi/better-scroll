import { getRect } from '../util'
import { Direction } from '../enums/direction'
import EventEmitter from '../base/EventEmitter'
export interface Options {
  scrollable: boolean
  momentum: boolean
  momentumLimitTime: number
  momentumLimitDistance: number
  deceleration: number
  swipeBounceTime: number
  swipeTime: number
  [key: string]: number | boolean
}

export default class Behavior {
  element: HTMLElement
  currentPos: number
  startPos: number
  absStartPos: number
  dist: number
  minScrollPos: number
  maxScrollPos: number
  hasScroll: boolean
  direction: number
  movingDirection: number
  relativeOffset: number
  wrapperSize: number
  elementSize: number
  hooks: EventEmitter
  constructor(public wrapper: HTMLElement, public options: Options) {
    this.hooks = new EventEmitter(['momentum', 'end'])
    this.element = this.wrapper.children[0] as HTMLElement
    this.currentPos = 0
    this.startPos = 0
  }

  start() {
    this.direction = Direction.Default
    this.movingDirection = Direction.Default
    this.dist = 0
  }

  move(delta: number, bounces: [boolean | undefined, boolean | undefined]) {
    delta = this.hasScroll ? delta : 0
    this.movingDirection =
      delta > 0
        ? Direction.Negative
        : delta < 0
        ? Direction.Positive
        : Direction.Default

    let newPos = this.currentPos + delta

    // Slow down or stop if outside of the boundaries
    if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
      if (
        (newPos > this.minScrollPos && bounces[0]) ||
        (newPos < this.maxScrollPos && bounces[1])
      ) {
        newPos = this.currentPos + delta / 3
      } else {
        newPos =
          newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos
      }
    }
    return newPos
  }

  end({
    duration,
    bounces
  }: {
    duration: number
    bounces: [boolean | undefined, boolean | undefined]
  }) {
    let momentumInfo: {
      destination?: number
      duration?: number
    } = {
      duration: 0
    }

    const absDist = Math.abs(this.currentPos - this.startPos)
    // start momentum animation if needed
    if (
      this.options.momentum &&
      duration < this.options.momentumLimitTime &&
      absDist > this.options.momentumLimitDistance
    ) {
      const wrapperSize =
        (this.direction === Direction.Negative && bounces[0]) ||
        (this.direction === Direction.Positive && bounces[1])
          ? this.wrapperSize
          : 0

      momentumInfo = this.hasScroll
        ? this.momentum(
            this.currentPos,
            this.startPos,
            duration,
            this.maxScrollPos,
            this.minScrollPos,
            wrapperSize,
            this.options
          )
        : { destination: this.currentPos, duration: 0 }
    } else {
      debugger
      this.hooks.trigger(this.hooks.eventTypes.end, momentumInfo)
    }
    return momentumInfo
  }

  momentum(
    current: number,
    start: number,
    time: number,
    lowerMargin: number,
    upperMargin: number,
    wrapperSize: number,
    options = this.options
  ) {
    let distance = current - start
    let speed = Math.abs(distance) / time

    let { deceleration, swipeBounceTime, swipeTime } = options
    let ret = {
      destination: swipeTime,
      duration: 0,
      rate: 15
    }
    ret.destination = current + (speed / deceleration) * (distance < 0 ? -1 : 1)

    this.hooks.trigger(this.hooks.eventTypes.momentum, ret)

    if (ret.destination < lowerMargin) {
      ret.destination = wrapperSize
        ? Math.max(
            lowerMargin - wrapperSize / 4,
            lowerMargin - (wrapperSize / ret.rate) * speed
          )
        : lowerMargin
      ret.duration = swipeBounceTime
    } else if (ret.destination > upperMargin) {
      ret.destination = wrapperSize
        ? Math.min(
            upperMargin + wrapperSize / 4,
            upperMargin + (wrapperSize / ret.rate) * speed
          )
        : upperMargin
      ret.duration = swipeBounceTime
    }
    ret.destination = Math.round(ret.destination)

    return ret
  }

  updateDirection() {
    const absDist = Math.round(this.currentPos) - this.absStartPos
    this.direction =
      absDist > 0
        ? Direction.Negative
        : absDist < 0
        ? Direction.Positive
        : Direction.Default
  }

  refresh({ size, position }: { size: string; position: string }) {
    const isWrapperStatic =
      window.getComputedStyle(this.wrapper, null).position === 'static'
    const wrapperRect = getRect(this.wrapper)
    this.wrapperSize = wrapperRect[size]

    const elementRect = getRect(this.element)
    this.elementSize = elementRect[size]

    this.relativeOffset = elementRect[position]
    if (isWrapperStatic) {
      this.relativeOffset -= wrapperRect[position]
    }

    this.minScrollPos = 0
    this.maxScrollPos = this.wrapperSize - this.elementSize

    if (this.maxScrollPos < 0) {
      this.maxScrollPos -= this.relativeOffset
      this.minScrollPos = -this.relativeOffset
    }

    this.hasScroll =
      this.options.scrollable && this.maxScrollPos < this.minScrollPos
    if (!this.hasScroll) {
      this.maxScrollPos = this.minScrollPos
      this.elementSize = this.wrapperSize
    }

    this.direction = 0
  }

  updatePosition(pos: number) {
    this.currentPos = pos
  }

  // adjust position when out of boundary
  adjustPosition() {
    let pos = this.currentPos
    let roundPos = Math.round(pos)
    if (!this.hasScroll || roundPos > this.minScrollPos) {
      pos = this.minScrollPos
    } else if (roundPos < this.maxScrollPos) {
      pos = this.maxScrollPos
    }
    return pos
  }

  updateStartPos() {
    this.startPos = this.currentPos
  }

  updateAbsStartPos() {
    this.absStartPos = this.currentPos
  }

  updateDist(delta: number) {
    this.dist += delta
  }
}
