import BScroll from '@better-scroll/core'
import { Probe } from '@better-scroll/core/src/enums/probe'
import IndexCalculator from './IndexCalculator'
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
    const { start, end } = indexCalculator.calculate(0, this.list)
    await this.update(start, end)
    this.bscroll.on('scroll', async (pos: any) => {
      const { start, end } = indexCalculator.calculate(pos.y, this.list)
      await this.update(start, end)
    })
  }

  async update(startIndex: number, endIndex: number) {
    const content = this.bscroll.scroller.content
    const { fetch, render } = this.bscroll.options.infinity!
    if (endIndex > this.list.length) {
      const min = endIndex - (this.list.length - 1)
      const newData = await fetch(min)
      for (let i = 0; i < newData.length; i++) {
        const newItem = {
          data: newData[i]
        }
        this.list.push(newItem)
      }
      console.log('fetch end', this.list)
    }
    const unusedNodes: Array<HTMLElement> = []
    for (let i = 0; i < this.list.length; i++) {
      if (i >= startIndex && i <= endIndex) {
        if (!this.list[i].node) {
          const el = render(this.list[i].data, unusedNodes.pop())
          el.style.position = 'absolute'
          this.list[i].node = el
          this.list[i].top = -1
          content.appendChild(el)
          this.list[i].height = el.offsetHeight
        }
      } else {
        if (this.list[i].node) {
          console.log('unused', i)
          unusedNodes.push(this.list[i].node)
          this.list[i].node = null
        }
      }
    }

    let pos = 0

    for (let i = 0; i < this.list.length; i++) {
      this.list[i].pos = pos
      if (this.list[i].node) {
        this.list[i].node.style.transform = `translateY(${pos}px)`
      }
      pos += this.list[i].height
    }
    this.bscroll.scroller.scrollBehaviorY.maxScrollPos =
      -(pos - this.bscroll.scroller.scrollBehaviorY.wrapperSize) +
      EXTRA_SCROLL_Y
  }
}
