import SlidePages from '../SlidePages'
import PageMatrix from '../PagesMatrix'
import BScroll from '@better-scroll/core'
import { ease } from '@better-scroll/shared-utils'

jest.mock('@better-scroll/core')
jest.mock('../PagesMatrix')

const createSlideElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  for (let i = 0; i < 3; i++) {
    content.appendChild(document.createElement('p'))
  }
  wrapper.appendChild(content)
  return { wrapper }
}

describe('slide test for SlidePages class', () => {
  let slidePages: SlidePages
  let scroll: BScroll
  const BASE_PAGE = {
    pageX: 0,
    pageY: 0,
    x: 0,
    y: 0,
  }
  const slideOptions = {
    loop: true,
    threshold: 0.1,
    speed: 400,
    easing: ease.bounce,
    listenFlick: true,
    autoplay: true,
    interval: 3000,
    startPageXIndex: 0,
    startPageYIndex: 0,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('loopX', () => {
    beforeEach(() => {
      const { wrapper } = createSlideElements()
      scroll = new BScroll(wrapper, {
        scrollX: true,
        scrollY: false,
      })
      slidePages = new SlidePages(scroll, slideOptions)
      slidePages.refresh()
    })

    it('should has base current page', () => {
      expect(slidePages.currentPage).toMatchObject(BASE_PAGE)
    })

    it('should set loopX when new SlidePage', () => {
      expect(slidePages.loopX).toBe(true)
    })

    it('should work well with getExposedPageByPageIndex()', () => {
      const ret = slidePages.getExposedPageByPageIndex(1, 0)
      expect(ret).toMatchObject({
        x: 0,
        y: 0,
        pageX: 1,
        pageY: 0,
      })
    })

    it('should work well with setCurrentPage()', () => {
      const currentPage = {
        pageX: 1,
        pageY: 0,
        x: 200,
        y: 200,
      }
      slidePages.setCurrentPage(currentPage)
      expect(slidePages.currentPage).toMatchObject(currentPage)
    })

    it('should work well with getInternalPage()', () => {
      const page1 = slidePages.getInternalPage(1, 0)

      expect(page1).toMatchObject({
        pageX: 1,
        pageY: 0,
        x: 0,
        y: 0,
      })

      // exceed maxPageX
      const page2 = slidePages.getInternalPage(4, 0)

      expect(page2).toMatchObject({
        pageX: 3,
        pageY: 0,
        x: 0,
        y: 0,
      })

      // less than maxPageX
      const page3 = slidePages.getInternalPage(-1, 0)

      expect(page3).toMatchObject({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getInitialPage()', () => {
      const page = slidePages.getInitialPage(true)

      expect(page).toMatchObject({
        pageX: 1,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getExposedPage() when loopX is true', () => {
      const pageX = slidePages.getExposedPage({
        x: 0,
        y: 0,
        pageX: 1,
        pageY: 0,
      })

      expect(pageX).toMatchObject({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getWillChangedPage() when loopX is true', () => {
      const page = slidePages.getWillChangedPage({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      })

      expect(page).toMatchObject({
        pageX: 1,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getPageStats()', () => {
      const pageStats = slidePages.getPageStats()

      expect(pageStats).toMatchObject({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        cx: 50,
        cy: 50,
      })
    })

    it('should work well with getValidPageIndex()', () => {
      const pageIndex = slidePages.getValidPageIndex(1, 0)

      expect(pageIndex).toMatchObject({
        pageX: 2,
        pageY: 0,
      })
    })

    it('should work well with nextPageIndex()', () => {
      const pageIndex = slidePages.nextPageIndex()

      expect(pageIndex).toMatchObject({
        pageX: 1,
        pageY: 0,
      })
    })

    it('should work well with prevPageIndex()', () => {
      const pageIndex = slidePages.prevPageIndex()

      expect(pageIndex).toMatchObject({
        pageX: -1,
        pageY: 0,
      })
    })

    it('should work well with getNearestPage()', () => {
      const pageIndex = slidePages.getNearestPage(30, 0)

      expect(pageIndex).toMatchObject({
        pageX: 1,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })

    it('should work well with resetLoopPage()', () => {
      const page1 = slidePages.resetLoopPage()

      expect(page1).toMatchObject({
        pageX: 2,
        pageY: 0,
      })

      slidePages.setCurrentPage({
        pageX: 3,
        pageY: 0,
        x: 0,
        y: 0,
      })
      const page2 = slidePages.resetLoopPage()

      expect(page2).toMatchObject({
        pageX: 1,
        pageY: 0,
      })
    })

    it('should work well with getPageByDirection()', () => {
      const page = slidePages.getPageByDirection(
        {
          x: 0,
          y: 0,
          pageY: 0,
          pageX: 0,
        },
        1,
        0
      )

      expect(page.pageX).toBe(1)
    })
  })

  describe('loopY', () => {
    beforeEach(() => {
      const { wrapper } = createSlideElements()
      scroll = new BScroll(wrapper, {
        scrollX: false,
        scrollY: true,
      })
      slidePages = new SlidePages(scroll, slideOptions)
      slidePages.refresh()
    })

    it('should set loopY when new SlidePage', () => {
      expect(slidePages.loopY).toBe(true)
    })

    it('should work well with getExposedPageByPageIndex()', () => {
      const ret = slidePages.getExposedPageByPageIndex(0, 1)
      expect(ret).toMatchObject({
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 1,
      })
    })

    it('should work well with getInitialPage()', () => {
      const page = slidePages.getInitialPage(true, true)

      expect(page).toMatchObject({
        pageX: 0,
        pageY: 1,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getExposedPage() when loopY is true', () => {
      const pageY = slidePages.getExposedPage({
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 1,
      })

      expect(pageY).toMatchObject({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getWillChangedPage() when loopY is true', () => {
      const page = slidePages.getWillChangedPage({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      })

      expect(page).toMatchObject({
        pageX: 0,
        pageY: 1,
        x: 0,
        y: 0,
      })
    })

    it('should work well with getValidPageIndex()', () => {
      const pageIndex = slidePages.getValidPageIndex(0, 1)

      expect(pageIndex).toMatchObject({
        pageX: 0,
        pageY: 2,
      })
    })

    it('should work well with nextPageIndex()', () => {
      const pageIndex = slidePages.nextPageIndex()

      expect(pageIndex).toMatchObject({
        pageX: 0,
        pageY: 1,
      })
    })

    it('should work well with prevPageIndex()', () => {
      const pageIndex = slidePages.prevPageIndex()

      expect(pageIndex).toMatchObject({
        pageX: 0,
        pageY: -1,
      })
    })

    it('should work well with resetLoopPage()', () => {
      const page1 = slidePages.resetLoopPage()

      expect(page1).toMatchObject({
        pageX: 0,
        pageY: 2,
      })

      slidePages.setCurrentPage({
        pageX: 0,
        pageY: 3,
        x: 0,
        y: 0,
      })

      const page2 = slidePages.resetLoopPage()

      expect(page2).toMatchObject({
        pageX: 0,
        pageY: 1,
      })
    })

    it('should work well with getPageByDirection()', () => {
      const page = slidePages.getPageByDirection(
        {
          x: 0,
          y: 0,
          pageY: 0,
          pageX: 0,
        },
        0,
        1
      )

      expect(page.pageY).toBe(1)
    })

    it('should work well with getInternalPage()', () => {
      const page1 = slidePages.getInternalPage(0, 1)

      expect(page1).toMatchObject({
        pageX: 0,
        pageY: 1,
        x: 0,
        y: 0,
      })

      // exceed maxPageY
      const page2 = slidePages.getInternalPage(0, 4)

      expect(page2).toMatchObject({
        pageX: 0,
        pageY: 3,
        x: 0,
        y: 0,
      })

      // less than maxPageX
      const page3 = slidePages.getInternalPage(0, -1)

      expect(page3).toMatchObject({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      })
    })
  })

  describe('loopX & loopY', () => {
    it('should warn when loopX & loopY is true', () => {
      const spyFn = jest.spyOn(console, 'error')
      const { wrapper } = createSlideElements()
      scroll = new BScroll(wrapper, {
        scrollX: true,
        scrollY: true,
      })
      slidePages = new SlidePages(scroll, slideOptions)
      slidePages.refresh()
      expect(spyFn).toHaveBeenCalledTimes(1)
    })
  })
})
