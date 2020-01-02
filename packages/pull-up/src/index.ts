import BScroll from '@better-scroll/core'
import { Probe, Direction } from '@better-scroll/shared-utils'
import propertiesProxyConfig from './propertiesConfig'

export type pullUpLoadOptions = Partial<PullUpLoadConfig> | boolean
export interface PullUpLoadConfig {
  threshold: number
}

declare module '@better-scroll/core' {
  interface Options {
    pullUpLoad?: pullUpLoadOptions
  }
}

export default class PullUp {
  public watching = false
  static pluginName = 'pullUpLoad'

  constructor(public bscroll: BScroll) {
    if (bscroll.options.pullUpLoad) {
      this._watch()
    }

    this.bscroll.registerType(['pullingUp'])

    this.bscroll.proxy(propertiesProxyConfig)
  }

  private _watch() {
    if (this.watching) {
      return
    }
    // must watch scroll in real time
    this.bscroll.options.probeType = Probe.Realtime
    this.watching = true
    this.bscroll.on('scroll', this._checkToEnd, this)
  }

  private _checkToEnd(pos: { y: number }) {
    if (!this.bscroll.options.pullUpLoad) {
      return
    }

    const { threshold = 0 } = this.bscroll.options
      .pullUpLoad as PullUpLoadConfig
    if (
      this.bscroll.movingDirectionY === Direction.Positive &&
      pos.y <= this.bscroll.maxScrollY + threshold
    ) {
      // reset pullupWatching status after scroll end to promise that trigger 'pullingUp' only once when pulling up
      this.bscroll.once('scrollEnd', () => {
        this.watching = false
      })
      this.bscroll.trigger('pullingUp')
      this.bscroll.off('scroll', this._checkToEnd)
    }
  }

  finish() {
    if (this.watching) {
      this.bscroll.once('scrollEnd', this._watch, this)
    } else {
      this._watch()
    }
  }

  open(config: pullUpLoadOptions = true) {
    this.bscroll.options.pullUpLoad = config

    this._watch()
  }

  close() {
    this.bscroll.options.pullUpLoad = false
    if (!this.watching) {
      return
    }
    this.watching = false
    this.bscroll.off('scroll', this._checkToEnd)
  }
}
