import { Direction, Probe } from '../../util/const'
import BScroll from '../../index'
import { Options } from '../../Options'
import { propertiesProxy } from '../../util/propertiesProxy'
import propertiesProxyConfig from './propertiesConfig'

export type pullUpLoadOptions = Partial<pullUpLoadConfig> | boolean
export interface pullUpLoadConfig {
  threshold: number
}

declare module '../../Options' {
  interface Options {
    pullUpLoad?: pullUpLoadOptions
  }
}

export default class PullUp {
  public watching = false
  static pluginName = 'pullUpLoad'

  constructor(public scroll: BScroll) {
    if (scroll.options.pullUpLoad) {
      this._init()
    }

    const prefix = `plugins.${PullUp.pluginName}.`
    propertiesProxyConfig.forEach(({ key, sourceKey }) => {
      propertiesProxy(this.scroll, prefix + sourceKey, key)
    })
  }

  private _init() {
    // must watch scroll in real time
    this.scroll.options.probeType = Probe.Realtime

    this.scroll.registerType(['pullingUp'])

    this.watching = false
    this._watch()
  }

  private _watch() {
    if (this.watching) {
      return
    }
    this.watching = true
    this.scroll.on('scroll', this._checkToEnd.bind(this))
  }

  private _checkToEnd(pos: { y: number }) {
    const { threshold = 0 } = this.scroll.options.pullUpLoad as pullUpLoadConfig
    if (
      this.scroll.movingDirectionY === Direction.Positive &&
      pos.y <= this.scroll.maxScrollY + threshold
    ) {
      // reset pullupWatching status after scroll end to promise that trigger 'pullingUp' only once when pulling up
      this.scroll.once('scrollEnd', () => {
        this.watching = false
      })
      this.scroll.trigger('pullingUp')
      this.scroll.off('scroll', this._checkToEnd)
    }
  }

  finish() {
    if (this.watching) {
      this.scroll.once('scrollEnd', this._watch.bind(this))
    } else {
      this._watch()
    }
  }

  open(config: pullUpLoadOptions = true) {
    this.scroll.options.pullUpLoad = config

    this._init()
  }

  close() {
    this.scroll.options.pullUpLoad = false
    if (!this.watching) {
      return
    }
    this.watching = false
    this.scroll.off('scroll', this._checkToEnd)
  }
}
