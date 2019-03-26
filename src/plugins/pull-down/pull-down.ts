import BScroll from '../../index'
import { Probe, Direction } from '../../enums'
import { ease } from '../../util/ease'
import { propertiesProxy } from '../../util/propertiesProxy'
import propertiesProxyConfig from './propertiesConfig'
import { Options } from '../../Options'

export type pullDownRefreshOptions = Partial<pullDownRefreshConfig> | boolean
export interface pullDownRefreshConfig {
  threshold: number
  stop: number
}
declare module '../../Options' {
  interface Options {
    pullDownRefresh?: pullDownRefreshOptions
  }
}

export default class PullDown {
  static pluginName = 'pullDownRefresh'
  pulling: boolean = false

  constructor(public scroll: BScroll) {
    if (scroll.options.pullDownRefresh) {
      this._watch()
    }

    this.scroll.registerType(['pullingDown'])

    const prefix = `plugins.${PullDown.pluginName}.`
    propertiesProxyConfig.forEach(({ key, sourceKey }) => {
      propertiesProxy(this.scroll, prefix + sourceKey, key)
    })

    this.tapIntohooks()
  }

  private _watch() {
    // 需要设置 probe = 3 吗？
    // must watch scroll in real time
    this.scroll.options.probeType = Probe.Realtime

    this.scroll.on('touchEnd', this._checkPullDown, this)
  }

  private tapIntohooks() {
    const scroller = this.scroll.scroller
    scroller.hooks.on(
      scroller.hooks.eventTypes.transitionEnd,
      (reset: { needReset: boolean }) => {
        if (this.pulling) {
          reset.needReset = false
        }
      }
    )
  }

  private _checkPullDown() {
    if (!this.scroll.options.pullDownRefresh) {
      return
    }

    const { threshold = 90, stop = 40 } = this.scroll.options
      .pullDownRefresh as pullDownRefreshConfig

    // check if a real pull down action
    if (
      this.scroll.directionY !== Direction.Negative ||
      this.scroll.y < threshold
    ) {
      return false
    }
    // TODO preventClick ? 处理 click 事件相关的逻辑
    if (!this.pulling) {
      this.pulling = true
      this.scroll.trigger('pullingDown')
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
      .pullDownRefresh as pullDownRefreshConfig

    if (this.pulling) {
      return
    }
    this.pulling = true

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
