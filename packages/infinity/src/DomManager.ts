import DataManager from './DataManager'
import Tombstone from './Tombstone'
import { style, cssVendor } from '@better-scroll/shared-utils'
import BScroll from '@better-scroll/core'

const ANIMATION_DURATION_MS = 200

export default class DomManager {
  private lastStart = -1
  private lastEnd = -1
  private unusedDom: HTMLElement[] = []
  private content: HTMLElement

  constructor(
    private bscroll: BScroll,
    private renderFn: (data: any, div?: HTMLElement) => HTMLElement,
    private tombstone: Tombstone
  ) {
    this.content = this.bscroll.scroller.content
  }

  update(
    list: Array<any>,
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

    this.collectUnusedDom(list, start, end)
    this.createDom(list, start, end)

    const { startPos, startDelta, endPos } = this.positionDom(list, start, end)
    if (startDelta) {
      const originMinScrollY = this.bscroll.minScrollY
      this.bscroll.minScrollY = startDelta
      // console.log(
      //   'minScrollY change:',
      //   startDelta,
      //   'current minScrollY',
      //   this.bscroll.minScrollY
      // )
    }

    return {
      start,
      startPos,
      startDelta,
      end,
      endPos
    }
  }

  private collectUnusedDom(
    list: Array<any>,
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
      if (list[i].dom) {
        const dom = list[i].dom
        if (this.tombstone.isTombstone(dom)) {
          this.tombstone.cached.push(dom)
          dom.style.display = 'none'
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
        list[i].dom.style[style.transform] = `translateY(${pos}px)`
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
    // console.log(
    //   '修正前',
    //   originPos,
    //   '修正后',
    //   pos,
    //   '差值',
    //   delta,
    //   'i',
    //   i,
    //   'x',
    //   x
    // )

    return {
      start: pos,
      delta: delta
    }
  }
}
