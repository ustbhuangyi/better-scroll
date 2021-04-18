import { between, extend, warn } from '@better-scroll/shared-utils'
import BScroll from '@better-scroll/core'
import { SlideConfig } from './index'
import PagesMatrix, { PageStats } from './PagesMatrix'
import { BASE_PAGE } from './constants'

export interface PageIndex {
  pageX: number
  pageY: number
}
export interface Position {
  x: number
  y: number
}

export type Page = PageIndex & Position

const enum Direction {
  Positive = 'positive',
  Negative = 'negative',
}

export default class SlidePages {
  loopX: boolean
  loopY: boolean
  slideX: boolean = false
  slideY: boolean = false
  wannaLoop: boolean
  pagesMatrix: PagesMatrix
  currentPage: Page
  constructor(public scroll: BScroll, private slideOptions: SlideConfig) {
    this.currentPage = extend({}, BASE_PAGE)
  }

  refresh() {
    this.pagesMatrix = new PagesMatrix(this.scroll)
    this.checkSlideLoop()
    this.currentPage = this.getAdjustedCurrentPage()
  }

  getAdjustedCurrentPage(): Page {
    let { pageX, pageY } = this.currentPage
    // page index should be handled
    // because page counts may reduce
    pageX = Math.min(pageX, this.pagesMatrix.pageLengthOfX - 1)
    pageY = Math.min(pageY, this.pagesMatrix.pageLengthOfY - 1)
    // loop scene should also be respected
    // because clonedNode will cause pageLength increasing
    if (this.loopX) {
      pageX = Math.min(pageX, this.pagesMatrix.pageLengthOfX - 2)
    }
    if (this.loopY) {
      pageY = Math.min(pageY, this.pagesMatrix.pageLengthOfY - 2)
    }
    const { x, y } = this.pagesMatrix.getPageStats(pageX, pageY)
    return { pageX, pageY, x, y }
  }

  setCurrentPage(newPage: Page) {
    this.currentPage = newPage
  }

  getInternalPage(pageX: number, pageY: number): Page {
    if (pageX >= this.pagesMatrix.pageLengthOfX) {
      pageX = this.pagesMatrix.pageLengthOfX - 1
    } else if (pageX < 0) {
      pageX = 0
    }

    if (pageY >= this.pagesMatrix.pageLengthOfY) {
      pageY = this.pagesMatrix.pageLengthOfY - 1
    } else if (pageY < 0) {
      pageY = 0
    }

    let { x, y } = this.pagesMatrix.getPageStats(pageX, pageY)

    return {
      pageX,
      pageY,
      x,
      y,
    }
  }

  getInitialPage(
    showFirstPage: boolean = false,
    firstInitialised: boolean = false
  ): Page {
    const { startPageXIndex, startPageYIndex } = this.slideOptions
    let firstPageX = this.loopX ? 1 : 0
    let firstPageY = this.loopY ? 1 : 0

    let pageX = showFirstPage ? firstPageX : this.currentPage.pageX
    let pageY = showFirstPage ? firstPageY : this.currentPage.pageY

    if (firstInitialised) {
      pageX = this.loopX ? startPageXIndex + 1 : startPageXIndex
      pageY = this.loopY ? startPageYIndex + 1 : startPageYIndex
    } else {
      pageX = showFirstPage ? firstPageX : this.currentPage.pageX
      pageY = showFirstPage ? firstPageY : this.currentPage.pageY
    }

    const { x, y } = this.pagesMatrix.getPageStats(pageX, pageY)

    return {
      pageX,
      pageY,
      x,
      y,
    }
  }

  getExposedPage(page: Page): Page {
    let exposedPage = extend({}, page)
    // only pageX or pageY need fix
    if (this.loopX) {
      exposedPage.pageX = this.fixedPage(
        exposedPage.pageX,
        this.pagesMatrix.pageLengthOfX - 2
      )
    }
    if (this.loopY) {
      exposedPage.pageY = this.fixedPage(
        exposedPage.pageY,
        this.pagesMatrix.pageLengthOfY - 2
      )
    }
    return exposedPage
  }

  getExposedPageByPageIndex(pageIndexX: number, pageIndexY: number): Page {
    const page = {
      pageX: pageIndexX,
      pageY: pageIndexY,
    }
    if (this.loopX) {
      page.pageX = pageIndexX + 1
    }
    if (this.loopY) {
      page.pageY = pageIndexY + 1
    }
    const { x, y } = this.pagesMatrix.getPageStats(page.pageX, page.pageY)
    return {
      x,
      y,
      pageX: pageIndexX,
      pageY: pageIndexY,
    }
  }

  getWillChangedPage(page: Page): Page {
    page = extend({}, page)
    // Page need fix
    if (this.loopX) {
      page.pageX = this.fixedPage(
        page.pageX,
        this.pagesMatrix.pageLengthOfX - 2
      )
      page.x = this.pagesMatrix.getPageStats(page.pageX + 1, 0).x
    }
    if (this.loopY) {
      page.pageY = this.fixedPage(
        page.pageY,
        this.pagesMatrix.pageLengthOfY - 2
      )
      page.y = this.pagesMatrix.getPageStats(0, page.pageY + 1).y
    }
    return page
  }

  private fixedPage(page: number, realPageLen: number): number {
    const pageIndex = []
    for (let i = 0; i < realPageLen; i++) {
      pageIndex.push(i)
    }
    pageIndex.unshift(realPageLen - 1)
    pageIndex.push(0)
    return pageIndex[page]
  }

  getPageStats(): PageStats {
    return this.pagesMatrix.getPageStats(
      this.currentPage.pageX,
      this.currentPage.pageY
    )
  }

  getValidPageIndex(x: number, y: number): PageIndex {
    let lastX = this.pagesMatrix.pageLengthOfX - 1
    let lastY = this.pagesMatrix.pageLengthOfY - 1
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
    x = between(x, firstX, lastX)
    y = between(y, firstY, lastY)

    return {
      pageX: x,
      pageY: y,
    }
  }

  nextPageIndex(): PageIndex {
    return this.getPageIndexByDirection(Direction.Positive)
  }

  prevPageIndex(): PageIndex {
    return this.getPageIndexByDirection(Direction.Negative)
  }

  getNearestPage(x: number, y: number): Page {
    const pageIndex = this.pagesMatrix.getNearestPageIndex(x, y)
    let { pageX, pageY } = pageIndex

    let newX = this.pagesMatrix.getPageStats(pageX, 0).x
    let newY = this.pagesMatrix.getPageStats(0, pageY).y

    return {
      x: newX,
      y: newY,
      pageX,
      pageY,
    }
  }

  getPageByDirection(page: Page, directionX: number, directionY: number): Page {
    let { pageX, pageY } = page
    if (pageX === this.currentPage.pageX) {
      pageX = between(pageX + directionX, 0, this.pagesMatrix.pageLengthOfX - 1)
    }
    if (pageY === this.currentPage.pageY) {
      pageY = between(pageY + directionY, 0, this.pagesMatrix.pageLengthOfY - 1)
    }

    const x = this.pagesMatrix.getPageStats(pageX, 0).x
    const y = this.pagesMatrix.getPageStats(0, pageY).y

    return {
      x,
      y,
      pageX,
      pageY,
    }
  }

  resetLoopPage(): PageIndex | undefined {
    if (this.loopX) {
      if (this.currentPage.pageX === 0) {
        return {
          pageX: this.pagesMatrix.pageLengthOfX - 2,
          pageY: this.currentPage.pageY,
        }
      }
      if (this.currentPage.pageX === this.pagesMatrix.pageLengthOfX - 1) {
        return {
          pageX: 1,
          pageY: this.currentPage.pageY,
        }
      }
    }
    if (this.loopY) {
      if (this.currentPage.pageY === 0) {
        return {
          pageX: this.currentPage.pageX,
          pageY: this.pagesMatrix.pageLengthOfY - 2,
        }
      }
      if (this.currentPage.pageY === this.pagesMatrix.pageLengthOfY - 1) {
        return {
          pageX: this.currentPage.pageX,
          pageY: 1,
        }
      }
    }
  }

  private getPageIndexByDirection(direction: Direction): PageIndex {
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
      pageY: y,
    }
  }

  private checkSlideLoop() {
    this.wannaLoop = this.slideOptions.loop
    if (this.pagesMatrix.pageLengthOfX > 1) {
      this.slideX = true
    } else {
      this.slideX = false
    }
    if (this.pagesMatrix.pages[0] && this.pagesMatrix.pageLengthOfY > 1) {
      this.slideY = true
    } else {
      this.slideY = false
    }
    this.loopX = this.wannaLoop && this.slideX
    this.loopY = this.wannaLoop && this.slideY

    if (this.slideX && this.slideY) {
      warn('slide does not support two direction at the same time.')
    }
  }
}
