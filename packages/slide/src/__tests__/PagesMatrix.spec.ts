import PagesMatrix from '../PagesMatrix'
import BScroll from '@better-scroll/core'

const createSlideElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  for (let i = 0; i < 3; i++) {
    content.appendChild(document.createElement('p'))
  }
  wrapper.appendChild(content)
  return { wrapper }
}

describe('slide test for PagesMatrix class', () => {
  let pageMatrix: PagesMatrix
  let scroll: BScroll

  beforeEach(() => {
    const { wrapper } = createSlideElements()
    scroll = new BScroll(wrapper, {})
    scroll.scroller.scrollBehaviorX.wrapperSize = 100
    scroll.scroller.scrollBehaviorX.contentSize = 400
    scroll.scroller.scrollBehaviorX.maxScrollPos = -300
    scroll.scroller.scrollBehaviorY.wrapperSize = 100
    scroll.scroller.scrollBehaviorY.contentSize = 100
    scroll.scroller.scrollBehaviorY.maxScrollPos = 0
    pageMatrix = new PagesMatrix(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create 4 * 1 matrix page in X direction', () => {
    expect(pageMatrix.pages.length).toBe(4)
    expect(pageMatrix.pages[0].length).toBe(1)
    expect(pageMatrix.pageLengthOfX).toBe(4)
    expect(pageMatrix.pageLengthOfY).toBe(1)
  })

  it('should create 1 * 4 matrix page in Y direction', () => {
    const { wrapper } = createSlideElements()
    scroll = new BScroll(wrapper, {})
    scroll.scroller.scrollBehaviorX.wrapperSize = 100
    scroll.scroller.scrollBehaviorX.contentSize = 100
    scroll.scroller.scrollBehaviorX.maxScrollPos = 0
    scroll.scroller.scrollBehaviorY.wrapperSize = 100
    scroll.scroller.scrollBehaviorY.contentSize = 400
    scroll.scroller.scrollBehaviorY.maxScrollPos = -300
    pageMatrix = new PagesMatrix(scroll)

    expect(pageMatrix.pages.length).toBe(1)
    expect(pageMatrix.pages[0].length).toBe(4)
    expect(pageMatrix.pageLengthOfX).toBe(1)
    expect(pageMatrix.pageLengthOfY).toBe(4)
  })

  it('should work well with getPageStats()', () => {
    const pageStats1 = pageMatrix.getPageStats(1, 0)

    expect(pageStats1).toMatchObject({
      x: -100,
      y: 0,
      width: 100,
      height: 100,
      cx: -150,
      cy: -50,
    })

    const pageStats2 = pageMatrix.getPageStats(2, 0)
    expect(pageStats2).toMatchObject({
      x: -200,
      y: 0,
      width: 100,
      height: 100,
      cx: -250,
      cy: -50,
    })
  })

  it('should work well with getNearestPageIndex() ', () => {
    const pageIndex1 = pageMatrix.getNearestPageIndex(0, 0)

    expect(pageIndex1).toMatchObject({
      pageX: 0,
      pageY: 0,
    })

    const pageIndex2 = pageMatrix.getNearestPageIndex(-175, 0)

    expect(pageIndex2).toMatchObject({
      pageX: 2,
      pageY: 0,
    })
  })
})
