import BScroll from '@better-scroll/core'
import { Probe } from '@better-scroll/core/src/enums/probe'
import IndexCalculator from './IndexCalculator'
import DataManager from './DataManager'
import DomManager from './DomManager'
import Tombstone from './Tombstone'
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

const EXTRA_SCROLL_Y = -2000
// rendered els 需要渲染的元素
// visible els 可见的元素

export default class InfinityScroll {
  static pluginName = 'infinity'
  public wrapper: HTMLElement
  public list: Array<any> = []
  public tombstoneHeight = 37
  public lastPos = 0
  private tombstone: Tombstone
  private domManager: DomManager
  private dataManager: DataManager
  private indexCalculator: IndexCalculator

  constructor(public bscroll: BScroll) {
    if (bscroll.options.infinity) {
      this.bscroll.options.probeType = Probe.Realtime
      this.bscroll.scroller.scrollBehaviorY.hasScroll = true
      this.bscroll.scroller.scrollBehaviorY.maxScrollPos = EXTRA_SCROLL_Y

      this.init(bscroll.options.infinity)
    }
  }

  init(options: InfinityOptions): void {
    // 计算要展示的数据
    const {
      fetch: fetchFn,
      render: renderFn,
      createTombstone: createTombstoneFn
    } = options
    this.tombstone = new Tombstone(createTombstoneFn)
    this.indexCalculator = new IndexCalculator(
      this.bscroll.scroller.scrollBehaviorY.wrapperSize,
      this.tombstone.height
    )
    this.domManager = new DomManager(
      this.bscroll.scroller.content,
      renderFn,
      this.tombstone
    )
    this.dataManager = new DataManager(
      this.bscroll,
      [],
      fetchFn,
      this.domManager
    )

    this.update({ y: 0 })

    this.bscroll.on('scroll', this.update.bind(this))
  }

  update(pos: { y: number }) {
    const position = Math.round(-pos.y)
    const { start, end } = this.indexCalculator.calculate(
      position,
      this.dataManager.getList()
    )
    // tslint:disable-next-line: no-floating-promises
    this.dataManager.update(start, end)
  }
}
