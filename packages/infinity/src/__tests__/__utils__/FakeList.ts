import { mockDomOffset } from '@better-scroll/core/src/__tests__/__utils__/layout'
import { TOMBSTONE_HEIGHT } from './constans'

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

  fillPos(end?: number): this {
    if (!end) {
      end = this.list.length
    }

    let startPos = 0

    for (let i = 0; i < end; i++) {
      Object.assign(this.list[i], { pos: startPos })
      const height = this.list[i].height
      startPos += height
    }

    return this
  }

  fillDom(start: number, end?: number, height = TOMBSTONE_HEIGHT): this {
    if (!end) {
      end = this.list.length
    }

    for (let i = start; i < end; i++) {
      const dom = document.createElement('div')
      mockDomOffset(dom, { height })
      Object.assign(this.list[i], { dom, height, pos: -1 })
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
