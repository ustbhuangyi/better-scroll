import BScroll from '@better-scroll/core'
import { PageIndex } from './SlidePages'

export interface PageStats {
  x: number
  y: number
  width: number
  height: number
  cx: number // center position of every page
  cy: number
}

export default class PagesMatrix {
  pages: Array<Array<PageStats>>
  pageLengthOfX: number
  pageLengthOfY: number
  private wrapperWidth: number
  private wrapperHeight: number
  private scrollerWidth: number
  private scrollerHeight: number
  constructor(private scroll: BScroll) {
    this.init()
  }
  init() {
    const scroller = this.scroll.scroller
    const { scrollBehaviorX, scrollBehaviorY } = scroller
    this.wrapperWidth = scrollBehaviorX.wrapperSize
    this.wrapperHeight = scrollBehaviorY.wrapperSize
    this.scrollerHeight = scrollBehaviorY.contentSize
    this.scrollerWidth = scrollBehaviorX.contentSize
    this.pages = this.buildPagesMatrix(this.wrapperWidth, this.wrapperHeight)
    this.pageLengthOfX = this.pages ? this.pages.length : 0
    this.pageLengthOfY = this.pages && this.pages[0] ? this.pages[0].length : 0
  }

  getPageStats(pageX: number, pageY: number): PageStats {
    return this.pages[pageX][pageY]
  }

  getNearestPageIndex(x: number, y: number): PageIndex {
    let pageX = 0
    let pageY = 0
    let l = this.pages.length
    for (; pageX < l - 1; pageX++) {
      if (x >= this.pages[pageX][0].cx) {
        break
      }
    }

    l = this.pages[pageX].length
    for (; pageY < l - 1; pageY++) {
      if (y >= this.pages[0][pageY].cy) {
        break
      }
    }
    return {
      pageX,
      pageY,
    }
  }

  // (n x 1) matrix for horizontal scroll or
  // (1 * n) matrix for vertical scroll
  private buildPagesMatrix(
    stepX: number,
    stepY: number
  ): Array<Array<PageStats>> {
    let pages: Array<Array<PageStats>> = []
    let x = 0
    let y
    let cx
    let cy
    let i = 0
    let l
    const maxScrollPosX = this.scroll.scroller.scrollBehaviorX.maxScrollPos
    const maxScrollPosY = this.scroll.scroller.scrollBehaviorY.maxScrollPos
    cx = Math.round(stepX / 2)
    cy = Math.round(stepY / 2)

    while (x > -this.scrollerWidth) {
      pages[i] = []
      l = 0
      y = 0
      while (y > -this.scrollerHeight) {
        pages[i][l] = {
          x: Math.max(x, maxScrollPosX),
          y: Math.max(y, maxScrollPosY),
          width: stepX,
          height: stepY,
          cx: x - cx,
          cy: y - cy,
        }

        y -= stepY
        l++
      }
      x -= stepX
      i++
    }
    return pages
  }
}
