import DataManager from './DataManager'
import { style } from '@better-scroll/shared-utils'

const DEFAULT_HEIGHT = 37

export default class DomManager {
  private lastStart = -1
  private lastEnd = -1
  private unusedDom: HTMLElement[] = []

  constructor(
    private content: HTMLElement,
    private renderFn: (data: any, div?: HTMLElement) => HTMLElement
  ) {}

  update(
    list: Array<any>,
    start?: number,
    end?: number
  ): {
    start: number
    end: number
    startPos: number
    endPos: number
  } {
    if (start !== undefined && end !== undefined) {
      this.lastStart = start
      this.lastEnd = end
    } else {
      start = this.lastStart
      end = this.lastEnd
    }
    this.collectUnusedDom(list, start, end)
    this.createDom(list, start, end)
    const { startPos, endPos } = this.positionDom(list, start, end)
    return {
      start,
      startPos,
      end,
      endPos
    }
  }

  private collectUnusedDom(
    list: Array<any>,
    start: number,
    end: number
  ): Array<any> {
    // TODO 优化 是否可以避免循环全部
    for (let i = 0; i < list.length; i++) {
      if (i === start) {
        i = end - 1
        continue
      }
      if (list[i].dom) {
        console.log('unused dom', i)
        this.unusedDom.push(list[i].dom)
        list[i].dom = null
      }
    }

    return list
  }

  private createDom(list: Array<any>, start: number, end: number): Array<any> {
    for (let i = start; i < end; i++) {
      const dom = list[i].dom
      const data = list[i].data
      if (!dom && data) {
        const dom = this.renderFn(data, this.unusedDom.pop())
        dom.style.position = 'absolute'
        list[i].dom = dom
        list[i].pos = -1
        this.content.appendChild(dom)
        list[i].height = dom.offsetHeight
      }
    }

    return list
  }

  private positionDom(
    list: Array<any>,
    start: number,
    end: number
  ): { startPos: number; endPos: number } {
    const startPos = this.getStartPos(list, start)
    let pos = startPos
    for (let i = start; i < end; i++) {
      if (list[i].dom && list[i].pos !== pos) {
        list[i].dom.style[style.transform] = `translateY(${pos}px)`
        list[i].pos = pos
      }
      pos += list[i].height || DEFAULT_HEIGHT
    }

    return {
      startPos,
      endPos: pos
    }
  }

  private getStartPos(list: Array<any>, start: number): number {
    if (list[start] && list[start].pos) {
      return list[start].pos
    }
    // TODO 只能从头计算吗？ lastStart?
    let pos = 0
    for (let i = 0; i < start; i++) {
      pos += list[i].height || DEFAULT_HEIGHT
    }

    return pos
  }
}
