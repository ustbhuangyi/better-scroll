import BScroll from '@better-scroll/core'
import { ease, Direction } from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

export type PullDownRefreshOptions = Partial<PullDownRefreshConfig> | boolean

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

export default class PullDown implements PluginAPI {
  static pluginName = 'pullDownRefresh'
  pulling: boolean = false
  originalMinScrollY: number

  constructor(public scroll: BScroll) {
    this.handleBScroll()
    this.watch()
  }

  private handleBScroll() {
    this.scroll.registerType(['pullingDown'])

    this.scroll.proxy(propertiesConfig)
  }

  private watch() {
    const scroller = this.scroll.scroller
    scroller.hooks.on(
      this.scroll.scroller.hooks.eventTypes.end,
      this.checkPullDown,
      this
    )
  }

  private checkPullDown() {
    if (!this.scroll.options.pullDownRefresh) {
      return
    }

    const { threshold = 90, stop = 40 } = this.scroll.options
      .pullDownRefresh as PullDownRefreshConfig

    // check if a real pull down action
    if (
      this.scroll.directionY !== Direction.Negative ||
      this.scroll.y < threshold
    ) {
      return false
    }

    if (!this.pulling) {
      this.pulling = true
      this.scroll.trigger('pullingDown')

      this.originalMinScrollY = this.scroll.minScrollY
      this.scroll.minScrollY = stop
    }

    this.scroll.scrollTo(
      this.scroll.x,
      stop,
      this.scroll.options.bounceTime,
      ease.bounce
    )

    return this.pulling
  }

  finishPullDown() {
    this.pulling = false
    this.scroll.minScrollY = this.originalMinScrollY
    this.scroll.resetPosition(this.scroll.options.bounceTime, ease.bounce)
  }

  openPullDown(config: PullDownRefreshOptions = true) {
    this.scroll.options.pullDownRefresh = config
    this.watch()
  }

  closePullDown() {
    this.scroll.options.pullDownRefresh = false
  }

  autoPullDownRefresh() {
    const { threshold = 90, stop = 40 } = this.scroll.options
      .pullDownRefresh as PullDownRefreshConfig

    if (this.pulling) {
      return
    }
    this.pulling = true

    this.originalMinScrollY = this.scroll.minScrollY
    this.scroll.minScrollY = threshold

    this.scroll.scrollTo(this.scroll.x, threshold)
    this.scroll.trigger('pullingDown')
    this.scroll.scrollTo(
      this.scroll.x,
      stop,
      this.scroll.options.bounceTime,
      ease.bounce
    )
  }
}
