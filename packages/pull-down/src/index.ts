import BScroll, { Boundary } from '@better-scroll/core'
import { MouseWheelConfig } from '@better-scroll/mouse-wheel'
import {
  ease,
  Direction,
  extend,
  EventEmitter,
  Probe,
} from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

export type PullDownRefreshOptions = Partial<PullDownRefreshConfig> | true

export interface PullDownRefreshConfig {
  threshold: number
  stop: number
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    pullDownRefresh?: PullDownRefreshOptions
  }
  interface CustomAPI {
    pullDownRefresh: PluginAPI
  }
}

interface PluginAPI {
  finishPullDown(): void
  openPullDown(config?: PullDownRefreshOptions): void
  closePullDown(): void
  autoPullDownRefresh(): void
}

const PULL_DOWN_HOOKS_NAME = 'pullingDown'

export default class PullDown implements PluginAPI {
  static pluginName = 'pullDownRefresh'
  private hooksFn: Array<[EventEmitter, string, Function]>
  pulling: boolean = false
  watching: boolean
  options: PullDownRefreshConfig
  cachedOriginanMinScrollY: number
  currentMinScrollY: number

  constructor(public scroll: BScroll) {
    this.init()
  }

  private init() {
    this.handleBScroll()

    this.handleOptions(this.scroll.options.pullDownRefresh)

    this.handleHooks()

    this.watch()
  }

  private handleBScroll() {
    this.scroll.registerType([PULL_DOWN_HOOKS_NAME])

    this.scroll.proxy(propertiesConfig)
  }

  private handleOptions(userOptions: PullDownRefreshOptions = {}) {
    userOptions = (userOptions === true ? {} : userOptions) as Partial<
      PullDownRefreshConfig
    >
    const defaultOptions: PullDownRefreshConfig = {
      threshold: 90,
      stop: 40,
    }
    this.options = extend(defaultOptions, userOptions)
    // plugin relies on scrollTo api
    // set it to Realtime make bs dispatch scroll、scrollEnd hooks
    this.scroll.options.probeType = Probe.Realtime
  }

  private handleHooks() {
    this.hooksFn = []
    const scroller = this.scroll.scroller
    const scrollBehaviorY = scroller.scrollBehaviorY
    this.currentMinScrollY = this.cachedOriginanMinScrollY =
      scrollBehaviorY.minScrollPos

    this.registerHooks(
      scrollBehaviorY.hooks,
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        // content is smaller than wrapper
        if (boundary.maxScrollPos > 0) {
          // allow scrolling when content is not full of wrapper
          boundary.maxScrollPos = -1
        }
        boundary.minScrollPos = this.currentMinScrollY
      }
    )

    // integrate with mousewheel
    if (this.scroll.eventTypes.alterOptions) {
      this.registerHooks(
        this.scroll,
        this.scroll.eventTypes.alterOptions,
        (mouseWheelOptions: MouseWheelConfig) => {
          const SANE_DISCRETE_TIME = 300
          const SANE_EASE_TIME = 350
          mouseWheelOptions.discreteTime = SANE_DISCRETE_TIME
          // easeTime > discreteTime ensure goInto checkPullDown function
          mouseWheelOptions.easeTime = SANE_EASE_TIME
        }
      )

      this.registerHooks(
        this.scroll,
        this.scroll.eventTypes.mousewheelEnd,
        () => {
          // mouseWheel need trigger checkPullDown manually
          scroller.hooks.trigger(scroller.hooks.eventTypes.end)
        }
      )
    }
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  private watch() {
    const scroller = this.scroll.scroller
    this.watching = true
    this.registerHooks(
      scroller.hooks,
      scroller.hooks.eventTypes.end,
      this.checkPullDown
    )
  }

  private unwatch() {
    const scroller = this.scroll.scroller
    this.watching = false
    scroller.hooks.off(scroller.hooks.eventTypes.end, this.checkPullDown)
  }

  private checkPullDown() {
    const { threshold, stop } = this.options
    // check if a real pull down action
    if (
      this.scroll.directionY !== Direction.Negative ||
      this.scroll.y < threshold
    ) {
      return false
    }

    if (!this.pulling) {
      this.modifyBehaviorYBoundary(stop)

      this.pulling = true

      this.scroll.trigger(PULL_DOWN_HOOKS_NAME)
    }

    this.scroll.scrollTo(
      this.scroll.x,
      stop,
      this.scroll.options.bounceTime,
      ease.bounce
    )

    return this.pulling
  }

  private modifyBehaviorYBoundary(stopDistance: number) {
    const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
    // manually modify minScrollPos for a hang animation
    // to prevent from resetPosition
    this.cachedOriginanMinScrollY = scrollBehaviorY.minScrollPos
    this.currentMinScrollY = stopDistance
    scrollBehaviorY.computeBoundary()
  }

  finishPullDown() {
    const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
    // restore minScrollY since the hang animation has ended
    this.currentMinScrollY = this.cachedOriginanMinScrollY
    scrollBehaviorY.computeBoundary()

    this.pulling = false
    this.scroll.resetPosition(this.scroll.options.bounceTime, ease.bounce)
  }

  // allow 'true' type is compat for beta version implements
  openPullDown(config: PullDownRefreshOptions = {}) {
    this.handleOptions(config)
    if (!this.watching) {
      this.watch()
    }
  }

  closePullDown() {
    this.unwatch()
  }

  autoPullDownRefresh() {
    const { threshold, stop } = this.options

    if (this.pulling || !this.watching) {
      return
    }
    this.pulling = true

    this.modifyBehaviorYBoundary(stop)

    this.scroll.scrollTo(this.scroll.x, threshold)
    this.scroll.trigger(PULL_DOWN_HOOKS_NAME)
    this.scroll.scrollTo(
      this.scroll.x,
      stop,
      this.scroll.options.bounceTime,
      ease.bounce
    )
  }
}
