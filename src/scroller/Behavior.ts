import { Direction, getRect } from '../util'
import { bounceConfig } from '../Options'

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
  minScrollPos: number
  maxScrollPos: number
  hasScroll: boolean
  direction: number
  movingDirection: number
  relativeOffset: number
  wrapperSize: number
  elementSize: number
  constructor(public wrapper: HTMLElement, public options: Options) {
    this.element = this.wrapper.children[0] as HTMLElement
    this.currentPos = 0
  }

  start() {
    this.direction = Direction.Default
    this.movingDirection = Direction.Default

    this.startPos = this.currentPos
    this.absStartPos = this.currentPos
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
    bounces,
    startX
  }: {
    duration: number
    bounces: [boolean | undefined, boolean | undefined]
    startX: number
  }) {
    let momentumInfo: {
      destination?: number
      duration?: number
    } = {}
    const absDist = Math.abs(this.currentPos - startX)
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
            startX,
            duration,
            this.maxScrollPos,
            this.minScrollPos,
            wrapperSize,
            this.options
          )
        : { destination: this.currentPos, duration: 0 }
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
    let duration = swipeTime
    let rate = 15

    let destination = current + (speed / deceleration) * (distance < 0 ? -1 : 1)

    if (destination < lowerMargin) {
      destination = wrapperSize
        ? Math.max(
            lowerMargin - wrapperSize / 4,
            lowerMargin - (wrapperSize / rate) * speed
          )
        : lowerMargin
      duration = swipeBounceTime
    } else if (destination > upperMargin) {
      destination = wrapperSize
        ? Math.min(
            upperMargin + wrapperSize / 4,
            upperMargin + (wrapperSize / rate) * speed
          )
        : upperMargin
      duration = swipeBounceTime
    }

    return {
      destination: Math.round(destination),
      duration
    }
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

  // ajust position when out of boundary
  limitPosition() {
    let pos = this.currentPos
    let roundPos = Math.round(pos)
    if (!this.hasScroll || roundPos > this.minScrollPos) {
      pos = this.minScrollPos
    } else if (roundPos < this.maxScrollPos) {
      pos = this.maxScrollPos
    }
    return pos
  }
}
