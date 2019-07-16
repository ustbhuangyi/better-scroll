import DomManager from './DomManager'
import BScroll from '@better-scroll/core'
import Tombstone from './Tombstone'

const EXTRA_SCROLL_Y = -2000

interface ListItem {
  data: any | null
  dom: HTMLElement | null
  tombstone: HTMLElement | null
  width: number
  height: number
  pos: number
}

export type pListItem = Partial<ListItem>

export default class DataManager {
  public loadedNum = 0
  private fetching = false
  private hasMore = true
  constructor(
    private bscroll: BScroll,
    public list: Array<pListItem>,
    private fetchFn: (len: number) => Promise<Array<any> | boolean>,
    private domManager: DomManager
  ) {}

  async update(start: number, end: number): Promise<void> {
    if (!this.hasMore) {
      end = Math.min(end, this.list.length)
    }

    // 先添加占位数据
    if (end > this.list.length) {
      const len = end - this.list.length
      this.add(len)
    }

    this.updateDom(start, end)

    // tslint:disable-next-line: no-floating-promises
    return this.checkToFetch(end)
  }

  add(data: Array<any> | number): Array<pListItem> {
    if (typeof data === 'number') {
      for (let i = 0; i < data; i++) {
        this.list.push({
          data: null,
          dom: null,
          height: 0,
          width: 0,
          pos: 0
        })
      }
    } else if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        if (!this.list[this.loadedNum]) {
          this.list[this.loadedNum] = { data: data[i] }
        } else {
          Object.assign(this.list[this.loadedNum], { data: data[i] })
        }
        this.loadedNum++
      }
    }
    return this.list
  }

  async fetch(len: number): Promise<Array<any> | boolean> {
    if (this.fetching) {
      return []
    }
    this.fetching = true
    const data = await this.fetchFn(len)
    this.fetching = false
    return data
  }

  private async checkToFetch(end: number): Promise<void> {
    if (!this.hasMore) {
      return
    }

    if (end <= this.loadedNum) {
      return
    }

    const min = end - this.loadedNum
    const newData = await this.fetch(min)

    if (newData instanceof Array && newData.length) {
      this.add(newData)

      const { end } = this.updateDom()

      return this.checkToFetch(end)
    } else if (typeof newData === 'boolean' && newData === false) {
      this.hasMore = false

      this.handleNoMore()
    }
  }

  private handleNoMore() {
    this.domManager.removeTombstone(this.list, this.loadedNum)
    this.list.splice(this.loadedNum)
    this.updateDom()

    // bscroll 的处理放在 dataManager 总觉得很奇怪，
    // console.log('resetPosition')
    this.bscroll.scroller.animater.stop()
    this.bscroll.resetPosition()
  }

  private updateDom(start?: number, end?: number) {
    const res = this.domManager.update(this.list, start, end)

    // bscroll 的处理放在 dataManager 总觉得很奇怪，但是 bscroll 的处理又和 hasMore 变量纠缠
    const { endPos, startDelta } = res
    if (startDelta) {
      this.bscroll.minScrollY = startDelta
    }

    let extraScroll = EXTRA_SCROLL_Y
    if (!this.hasMore && end === this.list.length) {
      extraScroll = 0
    }
    this.bscroll.maxScrollY =
      -(endPos - this.bscroll.scroller.scrollBehaviorY.wrapperSize) +
      extraScroll

    return res
  }

  getList() {
    return this.list
  }
}
