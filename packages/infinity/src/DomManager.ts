import DataManager from './DataManager'
import Tombstone from './Tombstone'
import { style, cssVendor } from '@better-scroll/shared-utils'

const ANIMATION_DURATION_MS = 200

export default class DomManager {
  private lastStart = -1
  private lastEnd = -1
  private unusedDom: HTMLElement[] = []

  constructor(
    private content: HTMLElement,
    private renderFn: (data: any, div?: HTMLElement) => HTMLElement,
    private tombstone: Tombstone
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
        if (this.tombstone.isTombstone(list[i].dom)) {
          this.tombstone.cached.push(list[i].dom)
        } else {
          this.unusedDom.push(list[i].dom)
        }
        list[i].dom = null
      }
    }

    return list
  }

  private createDom(list: Array<any>, start: number, end: number): void {
    for (let i = start; i < end; i++) {
      let dom = list[i].dom
      const data = list[i].data
      if (dom) {
        if (this.tombstone.isTombstone(dom) && data) {
          list[i].tombstone = dom
          list[i].dom = null
        } else {
          continue
        }
      }
      dom = data
        ? this.renderFn(data, this.unusedDom.pop())
        : this.tombstone.getOne()
      dom.style.position = 'absolute'
      list[i].dom = dom
      list[i].pos = -1
      this.content.appendChild(dom)
    }

    for (let i = start; i < end; i++) {
      if (list[i].data && !list[i].height) {
        list[i].height = list[i].dom.offsetHeight
      }
    }
  }

  private positionDom(
    list: Array<any>,
    start: number,
    end: number
  ): { startPos: number; endPos: number } {
    const tombstoneEles: Array<HTMLElement> = []
    const startPos = this.getStartPos(list, start, end)
    let pos = startPos

    for (let i = start; i < end; i++) {
      const tombstone = list[i].tombstone
      if (tombstone) {
        ;(<any>tombstone.style)[
          style.transition
        ] = `${cssVendor}transform ${ANIMATION_DURATION_MS}ms, opacity ${ANIMATION_DURATION_MS}ms`
        ;(<any>tombstone.style)[style.transform] = `translateY(${pos}px)`
        tombstone.style.opacity = '0'

        list[i].tombstone = null
        tombstoneEles.push(tombstone)
      }

      if (list[i].dom && list[i].pos !== pos) {
        list[i].dom.style[style.transform] = `translateY(${pos}px)`
        list[i].pos = pos
      }
      pos += list[i].height || this.tombstone.height
    }

    this.tombstone.waitForRecycle(tombstoneEles, ANIMATION_DURATION_MS)

    return {
      startPos,
      endPos: pos
    }
  }

  private getStartPos(list: Array<any>, start: number, end: number): number {
    if (list[start] && list[start].pos !== -1) {
      return list[start].pos
    }
    // TODO 只能从头计算吗？ lastStart?
    let pos = 0
    for (let i = 0; i < start; i++) {
      pos += list[i].height || this.tombstone.height
    }
    let pos2 = pos

    let i
    for (i = start; i < end; i++) {
      if (!this.tombstone.isTombstone(list[i].dom) && list[i].pos !== -1) {
        pos = list[i].pos
        break
      }
    }
    let x = i
    if (x < end) {
      while (x > start) {
        pos -= list[i - 1].height
        x--
      }
    }
    console.log('修正前', pos2, '修正后', pos, 'i', i, 'x', x)

    return pos
  }
}
