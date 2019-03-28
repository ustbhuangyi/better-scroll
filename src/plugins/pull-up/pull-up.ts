import { Direction, Probe } from '../../enums'
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

  constructor(public bscroll: BScroll) {
    if (bscroll.options.pullUpLoad) {
      this._watch()
    }

    this.bscroll.registerType(['pullingUp'])

    const prefix = `plugins.${PullUp.pluginName}.`
    propertiesProxyConfig.forEach(({ key, sourceKey }) => {
      propertiesProxy(this.bscroll, prefix + sourceKey, key)
    })
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
      .pullUpLoad as pullUpLoadConfig
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
