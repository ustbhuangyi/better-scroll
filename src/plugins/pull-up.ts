import { Direction, Probe } from '../util/const'
import BScroll from '../index'
import { pullUpLoadConfig, pullUpLoadOptions } from '../Options'
import { propertiesProxy } from '../util/propertiesProxy'
import { staticImplements, PluginCtor } from './type'

@staticImplements<PluginCtor>()
export default class PullUp {
  public watching = false
  static pluginName = 'pullUpLoad'

  constructor(public scroll: BScroll) {
    this.init()
  }

  private init() {
    // must watch scroll in real time
    this.scroll.options.probeType = Probe.Realtime

    this.watching = false
    this.watch()

    // TODO 只运行一次
    propertiesProxy(this.scroll, 'finishPullUp', 'plugins[pullUp].finish')
  }

  private watch() {
    if (this.watching) {
      return
    }
    this.watching = true
    this.scroll.on('scroll', this.checkToEnd.bind(this))
  }

  private checkToEnd(pos: { y: number }) {
    const { threshold = 0 } = this.scroll.options.pullUpLoad as pullUpLoadConfig
    if (
      this.scroll.movingDirectionY === Direction.Negative &&
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

  finish() {
    if (this.watching) {
      this.scroll.once('scrollEnd', this.watch.bind(this))
    } else {
      this.watch()
    }
  }

  open(config: pullUpLoadOptions = true) {
    this.scroll.options.pullUpLoad = config

    this.init()
  }

  close() {
    this.scroll.options.pullUpLoad = false
    if (!this.watching) {
      return
    }
    this.watching = false
    this.scroll.off('scroll', this.checkToEnd)
  }
}
