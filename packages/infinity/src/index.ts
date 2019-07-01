import BScroll from '@better-scroll/core'
import { Probe } from '@better-scroll/core/src/enums/probe'
import IndexCalculator from './IndexCalculator'
import DataManager from './DataManager'
import Fetcher from './Fetcher'
import DomManager from './DomManager'
export interface InfinityOptions {
  fetch: (count: number) => Promise<Array<any>>
  render: (item: any, div?: HTMLElement) => HTMLElement
  createTombstone: () => HTMLElement
}

declare module '@better-scroll/core' {
  interface Options {
    infinity?: InfinityOptions
  }
}

const PRE_NUM = 10
const POST_NUM = 30
const EXTRA_SCROLL_Y = -2000

// rendered els 需要渲染的元素
// visible els 可见的元素

export default class InfinityScroll {
  static pluginName = 'infinity'
  public wrapper: HTMLElement
  public list: Array<any> = []
  public tombstoneHeight = 37
  public lastPos = 0

  constructor(public bscroll: BScroll) {
    if (bscroll.options.infinity) {
      this.bscroll.options.probeType = Probe.Realtime
      this.bscroll.scroller.scrollBehaviorY.hasScroll = true
      this.bscroll.scroller.scrollBehaviorY.maxScrollPos = EXTRA_SCROLL_Y
      this.init(bscroll.y, bscroll.options.infinity)
    }
  }

  async init(currentPos: number, options: InfinityOptions): Promise<void> {
    // 计算要展示的数据
    const indexCalculator = new IndexCalculator(
      this.bscroll.scroller.scrollBehaviorY.wrapperSize
    )
    const { fetch, render } = options
    const domManager = new DomManager(this.bscroll.scroller.content, render)
    const dataManager = new DataManager([], fetch, domManager)
    const { start, end } = indexCalculator.calculate(0, dataManager.getList())
    // tslint:disable-next-line: no-floating-promises
    dataManager.update(start, end)
    const endPos = dataManager.getCurPos()
    this.bscroll.scroller.scrollBehaviorY.maxScrollPos =
      -(endPos - this.bscroll.scroller.scrollBehaviorY.wrapperSize) +
      EXTRA_SCROLL_Y

    this.bscroll.on('scroll', async (pos: any) => {
      const { start, end } = indexCalculator.calculate(
        -pos.y,
        dataManager.getList()
      )
      // tslint:disable-next-line: no-floating-promises
      dataManager.update(start, end)
      const endPos = dataManager.getCurPos()
      this.bscroll.scroller.scrollBehaviorY.maxScrollPos =
        -(endPos - this.bscroll.scroller.scrollBehaviorY.wrapperSize) +
        EXTRA_SCROLL_Y
    })
  }
}
