import { fixInboundValue, extend, warn } from '@better-scroll/shared-utils'
import BScroll from '@better-scroll/core'
import { Config } from './index'
import PagesPos from './PagesPos'

export interface Page {
  pageX: number
  pageY: number
}
export interface Position {
  x: number
  y: number
}

const enum Direction {
  Positive = 'positive',
  Negative = 'negative'
}
const enum LoopStage {
  Head = 'head',
  Tail = 'tail',
  Middle = 'middle'
}
export default class PageInfo {
  loopX: boolean
  loopY: boolean
  slideX: boolean
  slideY: boolean
  needLoop: boolean
  pagesPos: PagesPos
  currentPage: Page & Position
  constructor(public scroll: BScroll, private slideOpt: Partial<Config>) {}
  init() {
    this.currentPage = {
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    }
    this.pagesPos = new PagesPos(this.scroll, this.slideOpt)
    this.checkSlideLoop()
  }
  changeCurrentPage(newPage: Page & Position): void {
    this.currentPage = newPage
  }
  change2safePage(pageX: number, pageY: number): Page & Position | undefined {
    if (!this.pagesPos.hasInfo()) {
      return
    }
    if (pageX >= this.pagesPos.xLen) {
      pageX = this.pagesPos.xLen - 1
    } else if (pageX < 0) {
      pageX = 0
    }

    if (pageY >= this.pagesPos.yLen) {
      pageY = this.pagesPos.yLen - 1
    } else if (pageY < 0) {
      pageY = 0
    }

    let { x, y } = this.pagesPos.getPos(pageX, pageY)
    return {
      pageX,
      pageY,
      x: x,
      y: y
    }
  }
  getInitPage(): Page {
    let initPageX = this.loopX ? 1 : 0
    let initPageY = this.loopY ? 1 : 0
    return {
      pageX: initPageX,
      pageY: initPageY
    }
  }
  getRealPage(page?: Page): Page {
    const fixedPage = (page: number, realPageLen: number) => {
      const pageIndex = []
      for (let i = 0; i < realPageLen; i++) {
        pageIndex.push(i)
      }
      pageIndex.unshift(realPageLen - 1)
      pageIndex.push(0)
      return pageIndex[page]
    }
    let currentPage = page
      ? (extend({}, page) as Page)
      : (extend({}, this.currentPage) as Page)
    if (this.loopX) {
      currentPage.pageX = fixedPage(currentPage.pageX, this.pagesPos.xLen - 2)
    }
    if (this.loopY) {
      currentPage.pageY = fixedPage(currentPage.pageY, this.pagesPos.yLen - 2)
    }
    return {
      pageX: currentPage.pageX,
      pageY: currentPage.pageY
    }
  }
  getPageSize(): { width: number; height: number } {
    return this.pagesPos.getPos(this.currentPage.pageX, this.currentPage.pageY)
  }
  realPage2Page(
    x: number,
    y: number
  ): { realX: number; realY: number } | undefined {
    if (!this.pagesPos.hasInfo()) {
      return
    }
    let lastX = this.pagesPos.xLen - 1
    let lastY = this.pagesPos.yLen - 1
    let firstX = 0
    let firstY = 0
    if (this.loopX) {
      x += 1
      firstX = firstX + 1
      lastX = lastX - 1
    }
    if (this.loopY) {
      y += 1
      firstY = firstY + 1
      lastY = lastY - 1
    }
    x = fixInboundValue(x, firstX, lastX)
    y = fixInboundValue(y, firstY, lastY)
    return {
      realX: x,
      realY: y
    }
  }
  nextPage(): { pageX: number; pageY: number } {
    return this.changedPageNum(Direction.Positive)
  }
  prevPage(): { pageX: number; pageY: number } {
    return this.changedPageNum(Direction.Negative)
  }
  nearestPage(
    x: number,
    y: number,
    directionX: number,
    directionY: number
  ): Page & Position {
    const pageInfo = this.pagesPos.getNearestPage(x, y)
    if (!pageInfo) {
      return {
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 0
      }
    }
    let pageX = pageInfo.pageX
    let pageY = pageInfo.pageY
    let newX
    let newY
    if (pageX === this.currentPage.pageX) {
      pageX += directionX
      pageX = fixInboundValue(pageX, 0, this.pagesPos.xLen - 1)
    }
    if (pageY === this.currentPage.pageY) {
      pageY += directionY
      pageY = fixInboundValue(pageInfo.pageY, 0, this.pagesPos.yLen - 1)
    }
    newX = this.pagesPos.getPos(pageX, 0).x
    newY = this.pagesPos.getPos(0, pageY).y
    return {
      x: newX,
      y: newY,
      pageX,
      pageY
    }
  }
  getLoopStage(): LoopStage {
    if (!this.needLoop) {
      return LoopStage.Middle
    }
    if (this.loopX) {
      if (this.currentPage.pageX === 0) {
        return LoopStage.Head
      }
      if (this.currentPage.pageX === this.pagesPos.xLen - 1) {
        return LoopStage.Tail
      }
    }
    if (this.loopY) {
      if (this.currentPage.pageY === 0) {
        return LoopStage.Head
      }
      if (this.currentPage.pageY === this.pagesPos.yLen - 1) {
        return LoopStage.Tail
      }
    }
    return LoopStage.Middle
  }
  resetLoopPage(): { pageX: number; pageY: number } | undefined {
    if (this.loopX) {
      if (this.currentPage.pageX === 0) {
        return {
          pageX: this.pagesPos.xLen - 2,
          pageY: this.currentPage.pageY
        }
      }
      if (this.currentPage.pageX === this.pagesPos.xLen - 1) {
        return {
          pageX: 1,
          pageY: this.currentPage.pageY
        }
      }
    }
    if (this.loopY) {
      if (this.currentPage.pageY === 0) {
        return {
          pageX: this.currentPage.pageX,
          pageY: this.pagesPos.yLen - 2
        }
      }
      if (this.currentPage.pageY === this.pagesPos.yLen - 1) {
        return {
          pageX: this.currentPage.pageX,
          pageY: 1
        }
      }
    }
  }
  isSameWithCurrent(page: Page): Boolean {
    if (
      page.pageX !== this.currentPage.pageX ||
      page.pageY !== this.currentPage.pageY
    ) {
      return false
    }
    return true
  }
  private changedPageNum(
    direction: Direction
  ): { pageX: number; pageY: number } {
    let x = this.currentPage.pageX
    let y = this.currentPage.pageY
    if (this.slideX) {
      x = direction === Direction.Negative ? x - 1 : x + 1
    }
    if (this.slideY) {
      y = direction === Direction.Negative ? y - 1 : y + 1
    }
    return {
      pageX: x,
      pageY: y
    }
  }
  private checkSlideLoop() {
    this.needLoop = this.slideOpt.loop!
    if (this.pagesPos.xLen > 1) {
      this.slideX = true
    }
    if (this.pagesPos.pages[0] && this.pagesPos.yLen > 1) {
      this.slideY = true
    }
    this.loopX = this.needLoop && this.slideX
    this.loopY = this.needLoop && this.slideY

    if (this.slideX && this.slideY) {
      warn('slide does not support two direction at the same time.')
    }
  }
}
