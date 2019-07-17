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

export default class InfinityScroll {
  static pluginName = 'infinity'
  public start: number = 0
  public end: number = 0
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
      [],
      fetchFn,
      this.onFetchFinish.bind(this)
    )

    this.bscroll.on('destroy', this.destroy, this)
    this.bscroll.on('scroll', this.update, this)

    this.update({ y: 0 })
  }

  update(pos: { y: number }): void {
    const position = Math.round(-pos.y)
    // important! calculate start/end index to render
    const { start, end } = this.indexCalculator.calculate(
      position,
      this.dataManager.getList()
    )
    this.start = start
    this.end = end
    // tslint:disable-next-line: no-floating-promises
    this.dataManager.update(end)
    this.updateDom(this.dataManager.getList())
  }

  private onFetchFinish(list: Array<any>, hasMore: boolean) {
    const { end } = this.updateDom(list)
    if (!hasMore) {
      this.domManager.removeTombstone()
      this.bscroll.scroller.animater.stop()
      this.bscroll.resetPosition()
    }
    // tslint:disable-next-line: no-floating-promises
    return end
  }

  private updateDom(
    list: Array<any>
  ): { end: number; startPos: number; endPos: number } {
    const { end, startPos, endPos, startDelta } = this.domManager.update(
      list,
      this.start,
      this.end
    )

    // important!
    if (startDelta) {
      this.bscroll.minScrollY = startDelta
    }

    if (endPos > this.bscroll.maxScrollY) {
      this.bscroll.maxScrollY = -(
        endPos - this.bscroll.scroller.scrollBehaviorY.wrapperSize
      )
    }

    return {
      end,
      startPos,
      endPos
    }
  }

  destroy() {
    const content: HTMLElement = this.bscroll.scroller.content
    while (content.firstChild) {
      content.removeChild(content.firstChild)
    }
    this.domManager.destroy()
    this.bscroll.off('scroll', this.update)
  }
}
