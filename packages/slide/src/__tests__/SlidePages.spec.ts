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
  }
  beforeEach(() => {
    const { wrapper } = createSlideElements()
    scroll = new BScroll(wrapper, {})
    slidePages = new SlidePages(scroll, slideOptions)
    slidePages.refresh()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should has base current page', () => {
    expect(slidePages.currentPage).toMatchObject(BASE_PAGE)
  })

  it('should set loopX and loopY when new SlidePage', () => {
    expect(slidePages.loopX).toBe(true)
    expect(slidePages.loopY).toBe(false)
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

    // exceed maxPageY
    const page3 = slidePages.getInternalPage(1, 2)

    expect(page3).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: 0,
      y: 0,
    })
  })

  it('should work well with getInitialPage()', () => {
    const page = slidePages.getInitialPage()

    expect(page).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: 0,
      y: 0,
    })
  })

  it('should work well with getExposedPage() when loop is true', () => {
    slidePages.setCurrentPage({
      x: 0,
      y: 0,
      pageX: 1,
      pageY: 0,
    })
    const page = slidePages.getExposedPage()

    expect(page).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0,
    })
  })

  it('should work well with getWillChangedPage() when loop is true', () => {
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

  it('should work well with nearestPage()', () => {
    const pageIndex = slidePages.nearestPage(0, 0, 1, 1)

    expect(pageIndex).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: 0,
      y: 0,
    })
  })

  it('should work well with resetLoopPage()', () => {
    const page = slidePages.resetLoopPage()

    expect(page).toMatchObject({
      pageX: 2,
      pageY: 0,
    })
  })
})
