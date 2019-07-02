import { mockDomOffset } from '@better-scroll/core/src/__tests__/__utils__/layout'
import { DEFAULT_HEIGHT } from './constans'
import { connect } from 'http2'

export default class FakeList {
  private list: any[]
  constructor(size: number) {
    this.list = Array.from({ length: size }).map(i => {
      return {}
    })
  }

  fill(val: any, start: number = 0, end?: number): this {
    if (!end) {
      end = this.list.length
    }

    for (let i = start; i < end; i++) {
      Object.assign(this.list[i], val)
    }

    return this
  }

  fillDom(start: number, end?: number): this {
    if (!end) {
      end = this.list.length
    }

    for (let i = start; i < end; i++) {
      const dom = document.createElement('div')
      mockDomOffset(dom, { height: DEFAULT_HEIGHT })
      Object.assign(this.list[i], { dom, height: DEFAULT_HEIGHT, pos: -1 })
    }

    return this
  }

  syncDomTo(content: HTMLElement): this {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].dom) {
        content.appendChild(this.list[i].dom)
      }
    }
    return this
  }

  getList(): any[] {
    return this.list
  }
}
