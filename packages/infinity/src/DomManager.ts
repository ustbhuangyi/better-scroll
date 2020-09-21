import { pListItem } from './DataManager'
import Tombstone from './Tombstone'
import { style, cssVendor } from '@better-scroll/shared-utils'

const ANIMATION_DURATION_MS = 200

export default class DomManager {
  private content: HTMLElement
  private unusedDom: HTMLElement[] = []
  private timers: Array<number> = []

  constructor(
    content: HTMLElement,
    private renderFn: (data: any, div?: HTMLElement) => HTMLElement,
    private tombstone: Tombstone
  ) {
    this.setContent(content)
  }

  update(
    list: Array<pListItem>,
    start: number,
    end: number
  ): {
    start: number
    end: number
    startPos: number
    startDelta: number
    endPos: number
  } {
    if (start >= list.length) {
      start = list.length - 1
    }

    if (end > list.length) {
      end = list.length
    }

    this.collectUnusedDom(list, start, end)
    this.createDom(list, start, end)
    this.cacheHeight(list, start, end)

    const { startPos, startDelta, endPos } = this.positionDom(list, start, end)

    return {
      start,
      startPos,
      startDelta,
      end,
      endPos,
    }
  }

  private collectUnusedDom(
    list: Array<pListItem>,
    start: number,
    end: number
  ): Array<any> {
    // TODO optimise
    for (let i = 0; i < list.length; i++) {
      if (i === start) {
        i = end - 1
        continue
      }

      if (list[i].dom) {
        const dom = list[i].dom as HTMLElement
        if (Tombstone.isTombstone(dom)) {
          this.tombstone.recycleOne(dom)
          dom.style.display = 'none'
        } else {
          this.unusedDom.push(dom)
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
        if (Tombstone.isTombstone(dom) && data) {
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
  }

  private cacheHeight(
    list: Array<pListItem>,
    start: number,
    end: number
  ): void {
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
        const tombstoneStyle = tombstone.style as any
        tombstoneStyle[
          style.transition
        ] = `${cssVendor}transform ${ANIMATION_DURATION_MS}ms, opacity ${ANIMATION_DURATION_MS}ms`
        tombstoneStyle[style.transform] = `translateY(${pos}px)`
        tombstoneStyle.opacity = '0'

        list[i].tombstone = null
        tombstoneEles.push(tombstone)
      }

      if (list[i].dom && list[i].pos !== pos) {
        list[i].dom!.style[style.transform as any] = `translateY(${pos}px)`
        list[i].pos = pos
      }
      pos += list[i].height || this.tombstone.height
    }

    const timerId = window.setTimeout(() => {
      this.tombstone.recycle(tombstoneEles)
    }, ANIMATION_DURATION_MS)
    this.timers.push(timerId)

    return {
      startPos,
      startDelta,
      endPos: pos,
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
        delta: 0,
      }
    }
    // TODO optimise
    let pos = list[0].pos === -1 ? 0 : list[0].pos
    for (let i = 0; i < start; i++) {
      pos += list[i].height || this.tombstone.height
    }
    let originPos = pos

    let i
    for (i = start; i < end; i++) {
      if (!Tombstone.isTombstone(list[i].dom) && list[i].pos !== -1) {
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
      delta: delta,
    }
  }

  removeTombstone(): void {
    const tombstones = this.content.querySelectorAll('.tombstone')
    for (let i = tombstones.length - 1; i >= 0; i--) {
      this.content.removeChild(tombstones[i])
    }
  }

  setContent(content: HTMLElement) {
    if (content !== this.content) {
      this.content = content
    }
  }

  destroy(): void {
    this.removeTombstone()
    this.timers.forEach((id) => {
      clearTimeout(id)
    })
  }
  resetState() {
    this.destroy()
    this.timers = []
    this.unusedDom = []
  }
}
