import DataManager, { pListItem } from './DataManager'
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
    list: Array<pListItem>,
    start?: number,
    end?: number
  ): {
    start: number
    end: number
    startPos: number
    startDelta: number
    endPos: number
  } {
    if (start !== undefined && end !== undefined) {
      this.lastStart = start
      this.lastEnd = end
    } else {
      start = this.lastStart
      end = this.lastEnd
    }

    if (start >= list.length) {
      start = list.length - 1
      end = list.length
    }

    if (end > list.length) {
      end = list.length
    }

    // console.log('noMore', 'start', start, 'end', end)

    this.collectUnusedDom(list, start, end)
    this.createDom(list, start, end)

    const { startPos, startDelta, endPos } = this.positionDom(list, start, end)

    return {
      start,
      startPos,
      startDelta,
      end,
      endPos
    }
  }

  private collectUnusedDom(
    list: Array<pListItem>,
    start: number,
    end: number
  ): Array<any> {
    // TODO 优化 istart
    // let istart = Math.min(start, this.lastStart)
    // let iend = Math.max(end, this.lastEnd)
    for (let i = 0; i < list.length; i++) {
      if (i === start) {
        i = end - 1
        continue
      }
      const dom = list[i].dom
      if (dom) {
        const dom = list[i].dom
        if (this.tombstone.isTombstone(dom!)) {
          this.tombstone.cached.push(dom!)
          dom!.style.display = 'none'
        } else {
          this.unusedDom.push(dom!)
        }
        list[i].dom = null
      }
    }

    return list
  }

  private createDom(list: Array<pListItem>, start: number, end: number): void {
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
        list[i].height = list[i].dom!.offsetHeight
      }
    }
  }

  private positionDom(
    list: Array<pListItem>,
    start: number,
    end: number
  ): { startPos: number; startDelta: number; endPos: number } {
    const tombstoneEles: Array<HTMLElement> = []
    const { start: startPos, delta: startDelta } = this.getStartPos(
      list,
      start,
      end
    )
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
        ;(<any>list[i].dom!.style)[style.transform] = `translateY(${pos}px)`
        list[i].pos = pos
      }
      pos += list[i].height || this.tombstone.height
    }

    this.tombstone.waitForRecycle(tombstoneEles, ANIMATION_DURATION_MS)

    return {
      startPos,
      startDelta,
      endPos: pos
    }
  }

  private getStartPos(
    list: Array<any>,
    start: number,
    end: number
  ): { start: number; delta: number } {
    if (list[start] && list[start].pos !== -1) {
      return {
        start: list[start].pos,
        delta: 0
      }
    }
    // TODO 只能从头计算吗？ lastStart?
    let pos = list[0].pos === -1 ? 0 : list[0].pos
    for (let i = 0; i < start; i++) {
      pos += list[i].height || this.tombstone.height
    }
    let originPos = pos

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
        pos -= list[x - 1].height
        x--
      }
    }
    const delta = originPos - pos

    return {
      start: pos,
      delta: delta
    }
  }

  removeTombstone(list: Array<any>, end: number) {
    for (let i = list.length - 1; i >= end; i--) {
      const dom = list[i].dom
      const data = list[i].data
      if (!data && this.tombstone.isTombstone(dom)) {
        this.content.removeChild(dom)
      }
    }
  }
}
