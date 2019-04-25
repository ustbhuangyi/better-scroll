import { hasTransition, hasPerspective, hasTouch } from './util'
import { Probe, EventPassthrough } from './enums'
// type
export type tap = 'tap' | ''
export type bounceOptions = Partial<bounceConfig> | boolean
export type infinityOptions = Partial<infinityConfig> | boolean
export type dblclickOptions = Partial<DblclickConfig> | boolean

// interface
export interface bounceConfig {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
}

interface infinityConfig {
  render: (item: object, div: any) => void
  createTombstone: () => HTMLElement
  fetch: (count: number) => void
}

interface DblclickConfig {
  delay: number
}

export class Options {
  [key: string]: any
  startX: number
  startY: number
  scrollX: boolean
  scrollY: boolean
  freeScroll: boolean
  directionLockThreshold: number
  eventPassthrough: string
  click: boolean
  tap: tap
  bounce: bounceOptions
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
  HWCompositing: boolean
  useTransition: boolean
  bindToWrapper: boolean
  disableMouse: boolean | ''
  observeDOM: boolean
  autoBlur: boolean
  translateZ: string
  // plugins options
  infinity: infinityOptions
  dblclick: dblclickOptions

  constructor() {
    this.startX = 0
    this.startY = 0
    this.scrollX = false
    this.scrollY = true
    this.freeScroll = false
    this.directionLockThreshold = 5
    this.eventPassthrough = EventPassthrough.None
    this.click = false
    this.tap = ''

    this.bounce = {
      top: true,
      bottom: true,
      left: true,
      right: true
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
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
    }

    this.HWCompositing = true

    this.bindToWrapper = false
    this.disableMouse = hasTouch
    this.autoBlur = true

    // plugins config

    /**
     * for slide
     * slide: {
     *   loop: false,
     *   el: domEl,
     *   threshold: 0.1,
     *   stepX: 100,
     *   stepY: 100,
     *   speed: 400,
     *   easing: {
     *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
     *     fn: function (t) {
     *       return t * (2 - t)
     *     }
     *   }
     *   listenFlick: true
     * }
     */
    // this.slide = false

    /**
     * for mouse wheel
     * mouseWheel: {
     *   speed: 20,
     *   invert: false,
     *   easeTime: 300
     * }
     */
    // this.mouseWheel = false

    /**
     * for zoom
     * zoom: {
     *   start: 1,
     *   min: 1,
     *   max: 4
     * }
     */
    // this.zoom = false

    /**
     * for infinity
     * infinity: {
     *   render(item, div) {
     *   },
     *   createTombstone() {
     *   },
     *   fetch(count) {
     *   }
     * }
     */
    this.infinity = false
  }
  merge(options?: { [key: string]: any }) {
    if (!options) return this
    for (let key in options) {
      this[key] = options[key]
    }
    return this
  }
  process() {
    this.translateZ =
      this.HWCompositing && hasPerspective ? ' translateZ(0)' : ''

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
}
