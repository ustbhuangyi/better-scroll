import BScroll, { Boundary } from '@better-scroll/core'
import {
  Probe,
  Direction,
  extend,
  EventEmitter,
} from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

export type PullUpLoadOptions = Partial<PullUpLoadConfig> | true
export interface PullUpLoadConfig {
  threshold: number
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    pullUpLoad?: PullUpLoadOptions
  }
  interface CustomAPI {
    pullUpLoad: PluginAPI
  }
}
interface PluginAPI {
  finishPullUp(): void
  openPullUp(config?: PullUpLoadOptions): void
  closePullUp(): void
  autoPullUpLoad(): void
}

const PULL_UP_HOOKS_NAME = 'pullingUp'

export default class PullUp implements PluginAPI {
  static pluginName = 'pullUpLoad'
  private hooksFn: Array<[EventEmitter, string, Function]>
  pulling: boolean = false
  watching: boolean = false
  options: PullUpLoadConfig
  constructor(public scroll: BScroll) {
    this.init()
  }

  private init() {
    this.handleBScroll()

    this.handleOptions(this.scroll.options.pullUpLoad)

    this.handleHooks()

    this.watch()
  }

  private handleBScroll() {
    this.scroll.registerType([PULL_UP_HOOKS_NAME])

    this.scroll.proxy(propertiesConfig)
  }

  private handleOptions(userOptions: PullUpLoadOptions = {}) {
    userOptions = (userOptions === true ? {} : userOptions) as Partial<
      PullUpLoadConfig
    >
    const defaultOptions: PullUpLoadConfig = {
      threshold: 0,
    }
    this.options = extend(defaultOptions, userOptions)

    this.scroll.options.probeType = Probe.Realtime
  }

  private handleHooks() {
    this.hooksFn = []
    const { scrollBehaviorY } = this.scroll.scroller

    this.registerHooks(
      scrollBehaviorY.hooks,
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        // content is smaller than wrapper
        if (boundary.maxScrollPos > 0) {
          // allow scrolling when content is not full of wrapper
          boundary.maxScrollPos = -1
        }
      }
    )
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  private watch() {
    if (this.watching) {
      return
    }
    this.watching = true
    this.registerHooks(
      this.scroll,
      this.scroll.eventTypes.scroll,
      this.checkPullUp
    )
  }

  private unwatch() {
    this.watching = false
    this.scroll.off(this.scroll.eventTypes.scroll, this.checkPullUp)
  }

  private checkPullUp(pos: { x: number; y: number }) {
    const { threshold } = this.options

    if (
      this.scroll.movingDirectionY === Direction.Positive &&
      pos.y <= this.scroll.maxScrollY + threshold
    ) {
      this.pulling = true
      // must reset pulling after scrollEnd
      this.scroll.once(this.scroll.eventTypes.scrollEnd, () => {
        this.pulling = false
      })
      this.unwatch()
      this.scroll.trigger(PULL_UP_HOOKS_NAME)
    }
  }

  finishPullUp() {
    // reset Direction, fix #936
    this.scroll.scroller.scrollBehaviorY.setMovingDirection(Direction.Default)
    if (this.pulling) {
      this.scroll.once(this.scroll.eventTypes.scrollEnd, () => {
        this.watch()
      })
    } else {
      this.watch()
    }
  }

  // allow 'true' type is compat for beta version implements
  openPullUp(config: PullUpLoadOptions = {}) {
    this.handleOptions(config)
    this.watch()
  }

  closePullUp() {
    this.unwatch()
  }

  autoPullUpLoad() {
    const { threshold } = this.options
    const { scrollBehaviorY } = this.scroll.scroller

    if (this.pulling || !this.watching) {
      return
    }

    // simulate a pullUp action
    const NEGATIVE_VALUE = -1
    const outOfBoundaryPos =
      scrollBehaviorY.maxScrollPos + threshold + NEGATIVE_VALUE
    this.scroll.scroller.scrollBehaviorY.setMovingDirection(NEGATIVE_VALUE)
    this.scroll.scrollTo(
      this.scroll.x,
      outOfBoundaryPos,
      this.scroll.options.bounceTime
    )
  }
}
