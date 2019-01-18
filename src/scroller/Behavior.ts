import { Direction, getRect } from '../util'
import { bounceConfig } from '../Options'

interface Options {
  hasScroll: boolean
  momentum: boolean
  momentumLimitTime: number
  momentumLimitDistance: number
  deceleration: number
  swipeBounceTime: number
  swipeTime: number
}

export default class Behavior {
  element: HTMLElement
  currentPos: number
  startPos: number
  absStartPos: number
  minScrollSize: number
  maxScrollSize: number
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
    delta = this.options.hasScroll ? delta : 0
    this.movingDirection =
      delta > 0
        ? Direction.Positive // left to right or up to bottom
        : delta < 0
        ? Direction.Negative // Conversely
        : Direction.Default

    let newPos = this.currentPos + delta

    // Slow down or stop if outside of the boundaries
    if (newPos > this.minScrollSize || newPos < this.maxScrollSize) {
      if (
        (newPos > this.minScrollSize && bounces[0]) ||
        (newPos < this.maxScrollSize && bounces[1])
      ) {
        newPos = this.currentPos + delta / 3
      } else {
        newPos =
          newPos > this.minScrollSize ? this.minScrollSize : this.maxScrollSize
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

      momentumInfo = this.options.hasScroll
        ? this.momentum(
            this.currentPos,
            startX,
            duration,
            this.maxScrollSize,
            this.minScrollSize,
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

    this.minScrollSize = 0
    this.maxScrollSize = this.wrapperSize - this.elementSize

    if (this.maxScrollSize < 0) {
      this.maxScrollSize -= this.relativeOffset
      this.minScrollSize = -this.relativeOffset
    }

    this.options.hasScroll = this.maxScrollSize < this.minScrollSize

    if (!this.options.hasScroll) {
      this.maxScrollSize = this.minScrollSize
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
    if (!this.options.hasScroll || roundPos > this.minScrollSize) {
      pos = this.minScrollSize
    } else if (roundPos < this.maxScrollSize) {
      pos = this.maxScrollSize
    }
    return pos
  }
}
