import DomManager from './DomManager'
import BScroll from '@better-scroll/core'

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
  private list: Array<pListItem>
  constructor(
    list: Array<pListItem>,
    private fetchFn: (len: number) => Promise<Array<any> | boolean>,
    private onFetchFinish: (list: Array<pListItem>, hasMore: boolean) => number
  ) {
    this.list = list || []
  }

  async update(end: number): Promise<void> {
    if (!this.hasMore) {
      end = Math.min(end, this.list.length)
    }

    // add data placeholder
    if (end > this.list.length) {
      const len = end - this.list.length
      this.add(len)
    }

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

  async checkToFetch(end: number): Promise<void> {
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

      const currentEnd = this.onFetchFinish(this.list, true)

      return this.checkToFetch(currentEnd)
    } else if (typeof newData === 'boolean' && newData === false) {
      this.hasMore = false
      this.list.splice(this.loadedNum)

      this.onFetchFinish(this.list, false)
    }
  }

  getList() {
    return this.list
  }
}
