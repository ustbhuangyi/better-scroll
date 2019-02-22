import { extend, fixInboundValue, warn } from '../../util'
import BScroll from '../../index'
import { slideConfig } from '../../Options'
import PagesPos from './PagesPos'

export type SlidePoint = {
  x?: number
  y?: number
  pageX: number
  pageY: number
}
enum Direction {
  Positive = 'positive',
  Negative = 'negative'
}
enum LoopStage {
  Head = 'head',
  Tail = 'tail',
  Middle = 'middle'
}
export default class PageInfo {
  loopX: boolean
  loopY: boolean
  needLoop: boolean
  pagesPos: PagesPos
  currentPage: SlidePoint
  constructor(public scroll: BScroll, private slideOpt: Partial<slideConfig>) {}
  init() {
    this.pagesPos = new PagesPos(this.scroll, this.slideOpt)
    this.checkSlideLoop()
  }
  change2safePage(pageX: number, pageY: number): SlidePoint | undefined {
    if (!this.pagesPos.hasInfo()) {
      return
    }
    if (pageX >= this.pagesPos.xLen) {
      pageX = this.pagesPos.xLen - 1
    } else if (pageX < 0) {
      pageX = 0
    }

    if (!this.pagesPos.pages[pageX]) {
      return
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
  getRealPage(): SlidePoint {
    let currentPage = extend({}, this.currentPage) as SlidePoint
    if (this.loopX) {
      currentPage.pageX = currentPage.pageX - 1
    }
    if (this.loopY) {
      currentPage.pageY = currentPage.pageY - 1
    }
    return currentPage
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
    let len
    if (this.loopX) {
      len = this.pagesPos.xLen - 2
      if (x >= len) {
        x = len - 1
      } else if (x < 0) {
        x = 0
      }
      x += 1
    }
    if (this.loopY) {
      len = this.pagesPos.yLen - 2
      if (y >= len) {
        y = len - 1
      } else if (y < 0) {
        y = 0
      }
      y += 1
    }
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
  ): SlidePoint {
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
  private changedPageNum(
    direction: Direction
  ): { pageX: number; pageY: number } {
    let x = this.currentPage.pageX
    let y = this.currentPage.pageY
    if (this.loopX) {
      x = direction === Direction.Negative ? x - 1 : x + 1
    }
    if (this.loopY) {
      y = direction === Direction.Negative ? y - 1 : y + 1
    }
    return {
      pageX: x,
      pageY: y
    }
  }
  private checkSlideLoop() {
    this.needLoop = this.slideOpt.loop as boolean
    if (!this.needLoop) {
      return
    }
    if (this.pagesPos.xLen > 1) {
      this.loopX = true
    }
    if (this.pagesPos.pages[0] && this.pagesPos.yLen > 1) {
      this.loopY = true
    }
    if (this.loopX && this.loopY) {
      warn('Loop does not support two direction at the same time.')
    }
  }
}
