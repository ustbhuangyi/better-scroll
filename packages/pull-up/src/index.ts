import BScroll from '@better-scroll/core'
import { Probe, Direction } from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

export type PullUpLoadOptions = Partial<PullUpLoadConfig> | boolean
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
}

export default class PullUp implements PluginAPI {
  public watching = false
  static pluginName = 'pullUpLoad'

  constructor(public scroll: BScroll) {
    this.handleBScroll()
    this.watch()
  }

  private handleBScroll() {
    this.scroll.registerType(['pullingUp'])

    this.scroll.proxy(propertiesConfig)
  }

  private watch() {
    if (this.watching) {
      return
    }
    // must watch scroll in real time
    this.scroll.options.probeType = Probe.Realtime
    this.watching = true
    this.scroll.on(this.scroll.eventTypes.scroll, this.checkToEnd, this)
  }

  private checkToEnd(pos: { y: number }) {
    if (!this.scroll.options.pullUpLoad) {
      return
    }

    const { threshold = 0 } = this.scroll.options.pullUpLoad as PullUpLoadConfig
    if (
      this.scroll.movingDirectionY === Direction.Positive &&
      pos.y <= this.scroll.maxScrollY + threshold
    ) {
      // reset pullupWatching status after scroll end to promise that trigger 'pullingUp' only once when pulling up
      this.scroll.once('scrollEnd', () => {
        this.watching = false
      })
      this.scroll.trigger('pullingUp')
      this.scroll.off('scroll', this.checkToEnd)
    }
  }

  finishPullUp() {
    // reset Direction, fix #936
    this.scroll.movingDirectionY = Direction.Default
    if (this.watching) {
      this.scroll.once('scrollEnd', this.watch, this)
    } else {
      this.watch()
    }
  }

  openPullUp(config: PullUpLoadOptions = true) {
    this.scroll.options.pullUpLoad = config

    this.watch()
  }

  closePullUp() {
    this.scroll.options.pullUpLoad = false
    if (!this.watching) {
      return
    }
    this.watching = false
    this.scroll.off('scroll', this.checkToEnd)
  }
}
