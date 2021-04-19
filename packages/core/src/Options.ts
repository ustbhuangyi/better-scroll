import {
  hasTransition,
  hasPerspective,
  hasTouch,
  Probe,
  EventPassthrough,
  extend,
  Quadrant,
} from '@better-scroll/shared-utils'

// type
export type Tap = 'tap' | ''
export type BounceOptions = Partial<BounceConfig> | boolean
export type DblclickOptions = Partial<DblclickConfig> | boolean

// interface
export interface BounceConfig {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
}

export interface DblclickConfig {
  delay: number
}

export interface CustomOptions {}

export interface DefOptions {
  [key: string]: any
  startX?: number
  startY?: number
  scrollX?: boolean
  scrollY?: boolean
  freeScroll?: boolean
  directionLockThreshold?: number
  eventPassthrough?: string
  click?: boolean
  tap?: Tap
  bounce?: BounceOptions
  bounceTime?: number
  momentum?: boolean
  momentumLimitTime?: number
  momentumLimitDistance?: number
  swipeTime?: number
  swipeBounceTime?: number
  deceleration?: number
  flickLimitTime?: number
  flickLimitDistance?: number
  resizePolling?: number
  probeType?: number
  stopPropagation?: boolean
  preventDefault?: boolean
  preventDefaultException?: {
    tagName?: RegExp
    className?: RegExp
  }
  tagException?: {
    tagName?: RegExp
    className?: RegExp
  }
  HWCompositing?: boolean
  useTransition?: boolean
  bindToWrapper?: boolean
  bindToTarget?: boolean
  disableMouse?: boolean
  disableTouch?: boolean
  autoBlur?: boolean
  translateZ?: string
  dblclick?: DblclickOptions
  autoEndDistance?: number
  outOfBoundaryDampingFactor?: number
  specifiedIndexAsContent?: number
  quadrant?: Quadrant
}

export interface Options extends DefOptions, CustomOptions {}
export class CustomOptions {}
export class OptionsConstructor extends CustomOptions implements DefOptions {
  [key: string]: any
  startX: number
  startY: number
  scrollX: boolean
  scrollY: boolean
  freeScroll: boolean
  directionLockThreshold: number
  eventPassthrough: string
  click: boolean
  tap: Tap
  bounce: BounceConfig
  bounceTime: number
  momentum: boolean
  momentumLimitTime: number
  momentumLimitDistance: number
  swipeTime: number
  swipeBounceTime: number
  deceleration: number
  flickLimitTime: number
  flickLimitDistance: number
  resizePolling: number
  probeType: number
  stopPropagation: boolean
  preventDefault: boolean
  preventDefaultException: {
    tagName?: RegExp
    className?: RegExp
  }
  tagException: {
    tagName?: RegExp
    className?: RegExp
  }
  HWCompositing: boolean
  useTransition: boolean
  bindToWrapper: boolean
  bindToTarget: boolean
  disableMouse: boolean
  disableTouch: boolean
  autoBlur: boolean
  translateZ: string
  dblclick: DblclickOptions
  autoEndDistance: number
  outOfBoundaryDampingFactor: number
  specifiedIndexAsContent: number
  quadrant: Quadrant

  constructor() {
    super()
    this.startX = 0
    this.startY = 0
    this.scrollX = false
    this.scrollY = true
    this.freeScroll = false
    this.directionLockThreshold = 0
    this.eventPassthrough = EventPassthrough.None
    this.click = false
    this.dblclick = false
    this.tap = ''

    this.bounce = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    }
    this.bounceTime = 800

    this.momentum = true
    this.momentumLimitTime = 300
    this.momentumLimitDistance = 15

    this.swipeTime = 2500
    this.swipeBounceTime = 500

    this.deceleration = 0.0015

    this.flickLimitTime = 200
    this.flickLimitDistance = 100

    this.resizePolling = 60
    this.probeType = Probe.Default

    this.stopPropagation = false
    this.preventDefault = true
    this.preventDefaultException = {
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/,
    }
    this.tagException = {
      tagName: /^TEXTAREA$/,
    }

    this.HWCompositing = true
    this.useTransition = true

    this.bindToWrapper = false
    this.bindToTarget = false
    this.disableMouse = hasTouch
    this.disableTouch = !hasTouch
    this.autoBlur = true

    this.autoEndDistance = 5
    this.outOfBoundaryDampingFactor = 1 / 3
    this.specifiedIndexAsContent = 0
    this.quadrant = Quadrant.First
  }
  merge(options?: Options) {
    if (!options) return this
    for (let key in options) {
      if (key === 'bounce') {
        this.bounce = this.resolveBounce(options[key]!)
        continue
      }
      this[key] = options[key]
    }
    return this
  }
  process() {
    this.translateZ =
      this.HWCompositing && hasPerspective ? ' translateZ(1px)' : ''

    this.useTransition = this.useTransition && hasTransition

    this.preventDefault = !this.eventPassthrough && this.preventDefault

    // If you want eventPassthrough I have to lock one of the axes
    this.scrollX =
      this.eventPassthrough === EventPassthrough.Horizontal
        ? false
        : this.scrollX
    this.scrollY =
      this.eventPassthrough === EventPassthrough.Vertical ? false : this.scrollY

    // With eventPassthrough we also need lockDirection mechanism
    this.freeScroll = this.freeScroll && !this.eventPassthrough

    // force true when freeScroll is true
    this.scrollX = this.freeScroll ? true : this.scrollX
    this.scrollY = this.freeScroll ? true : this.scrollY

    this.directionLockThreshold = this.eventPassthrough
      ? 0
      : this.directionLockThreshold

    return this
  }

  resolveBounce(bounceOptions: BounceOptions): BounceConfig {
    const DEFAULT_BOUNCE = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    }
    const NEGATED_BOUNCE = {
      top: false,
      right: false,
      bottom: false,
      left: false,
    }

    let ret: BounceConfig
    if (typeof bounceOptions === 'object') {
      ret = extend(DEFAULT_BOUNCE, bounceOptions)
    } else {
      ret = bounceOptions ? DEFAULT_BOUNCE : NEGATED_BOUNCE
    }

    return ret
  }
}
