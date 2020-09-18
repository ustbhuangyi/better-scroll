import BScroll, { Boundary } from '@better-scroll/core'
import { Probe, warn } from '@better-scroll/shared-utils'
import IndexCalculator from './IndexCalculator'
import DataManager from './DataManager'
import DomManager from './DomManager'
import Tombstone from './Tombstone'

export interface InfinityOptions {
  fetch: (count: number) => Promise<Array<any> | false>
  render: (item: any, div?: HTMLElement) => HTMLElement
  createTombstone: () => HTMLElement
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    infinity?: InfinityOptions
  }
}

const EXTRA_SCROLL_Y = -2000

export default class InfinityScroll {
  static pluginName = 'infinity'
  start: number = 0
  end: number = 0
  options: InfinityOptions
  private tombstone: Tombstone
  private domManager: DomManager
  private dataManager: DataManager
  private indexCalculator: IndexCalculator

  constructor(public scroll: BScroll) {
    this.init()
  }

  init() {
    this.handleOptions()

    const {
      fetch: fetchFn,
      render: renderFn,
      createTombstone: createTombstoneFn,
    } = this.options

    this.tombstone = new Tombstone(createTombstoneFn)
    this.indexCalculator = new IndexCalculator(
      this.scroll.scroller.scrollBehaviorY.wrapperSize,
      this.tombstone.height
    )
    this.domManager = new DomManager(
      this.scroll.scroller.content,
      renderFn,
      this.tombstone
    )
    this.dataManager = new DataManager(
      [],
      fetchFn,
      this.onFetchFinish.bind(this)
    )

    this.scroll.on(this.scroll.eventTypes.destroy, this.destroy, this)
    this.scroll.on(this.scroll.eventTypes.scroll, this.update, this)

    this.scroll.on(
      this.scroll.eventTypes.contentChanged,
      (content: HTMLElement) => {
        this.domManager.setContent(content)
        this.indexCalculator.resetState()
        this.domManager.resetState()
        this.dataManager.resetState()
        this.update({ y: 0 })
      }
    )
    const { scrollBehaviorY } = this.scroll.scroller

    scrollBehaviorY.hooks.on(
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      this.modifyBoundary,
      this
    )

    this.update({ y: 0 })
  }

  private modifyBoundary(boundary: Boundary) {
    // manually set position to allow scroll
    boundary.maxScrollPos = EXTRA_SCROLL_Y
  }

  private handleOptions() {
    // narrow down type to an object
    const infinityOptions = this.scroll.options.infinity
    if (infinityOptions) {
      if (typeof infinityOptions.fetch !== 'function') {
        warn('Infinity plugin need fetch Function to new data.')
      }
      if (typeof infinityOptions.render !== 'function') {
        warn('Infinity plugin need render Function to render each item.')
      }
      if (typeof infinityOptions.render !== 'function') {
        warn(
          'Infinity plugin need createTombstone Function to create tombstone.'
        )
      }
      this.options = infinityOptions
    }

    this.scroll.options.probeType = Probe.Realtime
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
      this.scroll.scroller.animater.stop()
      this.scroll.resetPosition()
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

    if (startDelta) {
      this.scroll.minScrollY = startDelta
    }

    if (endPos > this.scroll.maxScrollY) {
      this.scroll.maxScrollY = -(
        endPos - this.scroll.scroller.scrollBehaviorY.wrapperSize
      )
    }

    return {
      end,
      startPos,
      endPos,
    }
  }

  destroy() {
    const { content, scrollBehaviorY } = this.scroll.scroller
    while (content.firstChild) {
      content.removeChild(content.firstChild)
    }
    this.domManager.destroy()
    this.scroll.off('scroll', this.update)
    this.scroll.off('destroy', this.destroy)
    scrollBehaviorY.hooks.off(scrollBehaviorY.hooks.eventTypes.computeBoundary)
  }
}
