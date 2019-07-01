import Fetcher from './Fetcher'
import DomManager from './DomManager'

export default class DataManager {
  public loadedNum = 0
  private endPos = 0
  private fetching = false
  constructor(
    public list: Array<any>,
    private fetchFn: (len: number) => Promise<Array<any>>,
    private domManager: DomManager
  ) {}

  async update(start: number, end: number): Promise<void> {
    if (end > this.list.length) {
      const len = end - this.list.length
      this.add(len)
    }
    this.updateDom(this.list, start, end)

    // tslint:disable-next-line: no-floating-promises
    return this.checkToFetch(end)
  }

  add(data: Array<any> | number): Array<any> {
    if (typeof data === 'number') {
      for (let i = 0; i < data; i++) {
        this.list.push({})
      }
    } else if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        this.list[this.loadedNum++] = {
          data: data[i]
        }
      }
      console.log('loadedNum', this.loadedNum)
    }
    return this.list
  }

  async fetch(len: number): Promise<Array<any> | boolean> {
    if (this.fetching) {
      return Promise.resolve([])
    }
    this.fetching = true
    const data = await this.fetchFn(len)
    this.fetching = false
    return data
  }

  private async checkToFetch(end: number): Promise<void> {
    console.log('checkToFetch', end, this.loadedNum)
    if (end > this.loadedNum) {
      const min = end - this.loadedNum
      const newData = await this.fetch(min)
      if (newData instanceof Array && newData.length) {
        this.add(newData)
        // TODO 每次 fetch 都会执行。优化？
        const { end } = this.updateDom(this.list)
        return this.checkToFetch(end)
      }
    }
  }

  private updateDom(list: Array<any>, start?: number, end?: number) {
    console.log('update dom', start, end)
    const res = this.domManager.update(this.list, start, end)
    const { endPos } = res
    this.endPos = endPos
    return res
  }

  getCurPos() {
    return this.endPos
  }

  getList() {
    return this.list
  }
}
