import BScroll from '@better-scroll/core'
import { ease, Probe, Direction } from '@better-scroll/shared-utils'
import propertiesProxyConfig from './propertiesConfig'

export type pullDownRefreshOptions = Partial<PullDownRefreshConfig> | boolean
export interface PullDownRefreshConfig {
  threshold: number
  stop: number
}
declare module '@better-scroll/core' {
  interface Options {
    pullDownRefresh?: pullDownRefreshOptions
  }
}

export default class PullDown {
  static pluginName = 'pullDownRefresh'
  pulling: boolean = false
  originalMinScrollY: number

  constructor(public scroll: BScroll) {
    if (scroll.options.pullDownRefresh) {
      this._watch()
    }

    this.scroll.registerType(['pullingDown'])

    this.scroll.proxy(propertiesProxyConfig)
  }

  private _watch() {
    // 需要设置 probe = 3 吗？
    // must watch scroll in real time
    this.scroll.options.probeType = Probe.Realtime
    this.scroll.scroller.hooks.on('end', this._checkPullDown, this)
  }

  private _checkPullDown() {
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

  finish() {
    this.pulling = false
    this.scroll.minScrollY = this.originalMinScrollY
    this.scroll.resetPosition(this.scroll.options.bounceTime, ease.bounce)
  }

  open(config: pullDownRefreshOptions = true) {
    this.scroll.options.pullDownRefresh = config
    this._watch()
  }

  close() {
    this.scroll.options.pullDownRefresh = false
  }

  autoPull() {
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
