import { getRect } from '@better-scroll/shared-utils'
import BScroll from '@better-scroll/core'
import { Config } from './index'

interface PagePos {
  x: number
  y: number
  width: number
  height: number
  cx: number
  cy: number
}

export default class PagesPos {
  pages: Array<Array<PagePos>>
  xLen: number
  yLen: number
  private wrapperWidth: number
  private wrapperHeight: number
  private scrollerWidth: number
  private scrollerHeight: number
  private slideEl: NodeListOf<HTMLElement> | null = null
  constructor(private scroll: BScroll, private slideOpt: Partial<Config>) {
    this.init()
  }
  init() {
    const scrollerIns = this.scroll.scroller
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY
    const wrapper = getRect(scrollerIns.wrapper)
    const scroller = getRect(scrollerIns.content)
    this.wrapperWidth = wrapper.width
    this.wrapperHeight = wrapper.height
    this.scrollerHeight = scrollBehaviorY.hasScroll
      ? scroller.height
      : wrapper.height
    this.scrollerWidth = scrollBehaviorX.hasScroll
      ? scroller.width
      : wrapper.width
    let stepX = this.slideOpt.stepX || this.wrapperWidth
    let stepY = this.slideOpt.stepY || this.wrapperHeight
    const slideEls = scrollerIns.content
    let el = this.slideOpt.el
    if (typeof el === 'string') {
      this.slideEl = slideEls.querySelectorAll(el)
    }
    this.pages = this.slideEl
      ? this.computePagePosInfoByEl(this.slideEl)
      : this.computePagePosInfo(stepX, stepY)
    this.xLen = this.pages ? this.pages.length : 0
    this.yLen = this.pages && this.pages[0] ? this.pages[0].length : 0
  }
  hasInfo(): boolean {
    if (!this.pages || !this.pages.length) {
      return false
    }
    return true
  }
  getPos(x: number, y: number): PagePos {
    return this.pages[x][y]
  }
  getNearestPage(
    x: number,
    y: number
  ): { pageX: number; pageY: number } | undefined {
    if (!this.hasInfo()) {
      return
    }
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
      pageY
    }
  }
  private computePagePosInfo(
    stepX: number,
    stepY: number
  ): Array<Array<PagePos>> {
    let pages: Array<Array<PagePos>> = []
    let x = 0
    let y
    let cx
    let cy
    let i = 0
    let l
    let m = 0
    let n
    let rect
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
          cy: y - cy
        }

        y -= stepY
        l++
      }
      x -= stepX
      i++
    }
    return pages
  }
  private computePagePosInfoByEl(
    el: NodeListOf<HTMLElement>
  ): Array<Array<PagePos>> {
    let pages: Array<Array<PagePos>> = []
    let x = 0
    let y = 0
    let cx
    let cy
    let i = 0
    let l = el.length
    let m = 0
    let n = -1
    let rect

    const maxScrollX = this.scroll.scroller.scrollBehaviorX.maxScrollPos
    const maxScrollY = this.scroll.scroller.scrollBehaviorY.maxScrollPos
    for (; i < l; i++) {
      rect = getRect(<HTMLElement>el[i])
      if (i === 0 || rect.left <= getRect(<HTMLElement>el[i - 1]).left) {
        m = 0
        n++
      }

      if (!pages[m]) {
        pages[m] = []
      }

      x = Math.max(-rect.left, maxScrollX)
      y = Math.max(-rect.top, maxScrollY)
      cx = x - Math.round(rect.width / 2)
      cy = y - Math.round(rect.height / 2)

      pages[m][n] = {
        x: x,
        y: y,
        width: rect.width,
        height: rect.height,
        cx: cx,
        cy: cy
      }

      if (x > maxScrollX) {
        m++
      }
    }
    return pages
  }
}
