import { getRect, Direction, EventEmitter } from '@better-scroll/shared-utils'

export type Bounces = [boolean, boolean]

export type Rect = { size: string; position: string }

export interface Options {
  scrollable: boolean
  momentum: boolean
  momentumLimitTime: number
  momentumLimitDistance: number
  deceleration: number
  swipeBounceTime: number
  swipeTime: number
  bounces: Bounces
  rect: Rect
  outOfBoundaryDampingFactor: number
  [key: string]: number | boolean | Bounces | Rect
}

export type Boundary = { minScrollPos: number; maxScrollPos: number }

export class Behavior {
  content: HTMLElement
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
  contentSize: number
  hooks: EventEmitter
  constructor(public wrapper: HTMLElement, public options: Options) {
    this.hooks = new EventEmitter([
      'beforeComputeBoundary',
      'computeBoundary',
      'momentum',
      'end',
    ])
    this.content = this.wrapper.children[0] as HTMLElement
    this.currentPos = 0
    this.startPos = 0
    this.refresh()
  }

  start() {
    this.dist = 0
    this.setMovingDirection(Direction.Default)
    this.setDirection(Direction.Default)
  }

  move(delta: number): number {
    delta = this.hasScroll ? delta : 0
    this.setMovingDirection(delta)
    return this.performDampingAlgorithm(
      delta,
      this.options.outOfBoundaryDampingFactor
    )
  }

  setMovingDirection(delta: number) {
    this.movingDirection =
      delta > 0
        ? Direction.Negative
        : delta < 0
        ? Direction.Positive
        : Direction.Default
  }

  setDirection(delta: number) {
    this.direction =
      delta > 0
        ? Direction.Negative
        : delta < 0
        ? Direction.Positive
        : Direction.Default
  }

  performDampingAlgorithm(delta: number, dampingFactor: number) {
    let newPos = this.currentPos + delta
    // Slow down or stop if outside of the boundaries
    if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
      if (
        (newPos > this.minScrollPos && this.options.bounces[0]) ||
        (newPos < this.maxScrollPos && this.options.bounces[1])
      ) {
        newPos = this.currentPos + delta * dampingFactor
      } else {
        newPos =
          newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos
      }
    }
    return newPos
  }

  end(duration: number) {
    let momentumInfo: {
      destination?: number
      duration?: number
    } = {
      duration: 0,
    }

    const absDist = Math.abs(this.currentPos - this.startPos)
    // start momentum animation if needed
    if (
      this.options.momentum &&
      duration < this.options.momentumLimitTime &&
      absDist > this.options.momentumLimitDistance
    ) {
      const wrapperSize =
        (this.direction === Direction.Negative && this.options.bounces[0]) ||
        (this.direction === Direction.Positive && this.options.bounces[1])
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
      this.hooks.trigger(this.hooks.eventTypes.end, momentumInfo)
    }
    return momentumInfo
  }

  private momentum(
    current: number,
    start: number,
    time: number,
    lowerMargin: number,
    upperMargin: number,
    wrapperSize: number,
    options = this.options
  ) {
    const distance = current - start
    const speed = Math.abs(distance) / time

    const { deceleration, swipeBounceTime, swipeTime } = options
    const momentumData = {
      destination: current + (speed / deceleration) * (distance < 0 ? -1 : 1),
      duration: swipeTime,
      rate: 15,
    }

    this.hooks.trigger(this.hooks.eventTypes.momentum, momentumData, distance)

    if (momentumData.destination < lowerMargin) {
      momentumData.destination = wrapperSize
        ? Math.max(
            lowerMargin - wrapperSize / 4,
            lowerMargin - (wrapperSize / momentumData.rate) * speed
          )
        : lowerMargin
      momentumData.duration = swipeBounceTime
    } else if (momentumData.destination > upperMargin) {
      momentumData.destination = wrapperSize
        ? Math.min(
            upperMargin + wrapperSize / 4,
            upperMargin + (wrapperSize / momentumData.rate) * speed
          )
        : upperMargin
      momentumData.duration = swipeBounceTime
    }
    momentumData.destination = Math.round(momentumData.destination)

    return momentumData
  }

  updateDirection() {
    const absDist = Math.round(this.currentPos) - this.absStartPos
    this.setDirection(absDist)
  }

  refresh() {
    const { size, position } = this.options.rect
    const isWrapperStatic =
      window.getComputedStyle(this.wrapper, null).position === 'static'
    const wrapperRect = getRect(this.wrapper)
    this.wrapperSize = wrapperRect[size]

    const contentRect = getRect(this.content)
    this.contentSize = contentRect[size]

    this.relativeOffset = contentRect[position]
    if (isWrapperStatic) {
      this.relativeOffset -= wrapperRect[position]
    }

    this.computeBoundary()

    this.setDirection(Direction.Default)
  }

  computeBoundary() {
    this.hooks.trigger(this.hooks.eventTypes.beforeComputeBoundary)

    const boundary: Boundary = {
      minScrollPos: 0,
      maxScrollPos: this.wrapperSize - this.contentSize,
    }
    if (boundary.maxScrollPos < 0) {
      boundary.maxScrollPos -= this.relativeOffset
      boundary.minScrollPos = -this.relativeOffset
    }
    this.hooks.trigger(this.hooks.eventTypes.computeBoundary, boundary)

    this.minScrollPos = boundary.minScrollPos
    this.maxScrollPos = boundary.maxScrollPos

    this.hasScroll =
      this.options.scrollable && this.maxScrollPos < this.minScrollPos

    if (!this.hasScroll) {
      this.maxScrollPos = this.minScrollPos
      this.contentSize = this.wrapperSize
    }
  }

  updatePosition(pos: number) {
    this.currentPos = pos
  }

  getCurrentPos() {
    return Math.round(this.currentPos)
  }

  checkInBoundary() {
    const position = this.adjustPosition(this.currentPos)
    const inBoundary = position === this.getCurrentPos()
    return {
      position,
      inBoundary,
    }
  }

  // adjust position when out of boundary
  adjustPosition(pos: number) {
    let roundPos = Math.round(pos)
    if (!this.hasScroll || roundPos > this.minScrollPos) {
      roundPos = this.minScrollPos
    } else if (roundPos < this.maxScrollPos) {
      roundPos = this.maxScrollPos
    }

    return roundPos
  }

  updateStartPos() {
    this.startPos = this.currentPos
  }

  updateAbsStartPos() {
    this.absStartPos = this.currentPos
  }

  resetStartPos() {
    this.updateStartPos()
    this.updateAbsStartPos()
  }

  getAbsDist(delta: number) {
    this.dist += delta
    return Math.abs(this.dist)
  }

  destroy() {
    this.hooks.destroy()
  }
}
