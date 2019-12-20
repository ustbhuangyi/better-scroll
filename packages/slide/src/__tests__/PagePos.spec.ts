import PagesPos from '../PagesPos'
import BScroll from '@better-scroll/core'
import { bscrollHorizon, bscrollVertical } from './__utils__/bscroll'
import { mockDomOffset } from '@better-scroll/core/src/__tests__/__utils__/layout'

describe('slide test for pagePos class', () => {
  let pagesPos: PagesPos
  beforeAll(() => {})

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get right page pos for horizon slide', () => {
    pagesPos = new PagesPos(bscrollHorizon().partOfbscroll, {})
    expect(pagesPos.xLen).toBe(2)
    expect(pagesPos.yLen).toBe(1)
    expect(pagesPos.pages[0]).toMatchObject([
      {
        cx: -150,
        cy: -150,
        height: 300,
        width: 300,
        x: 0,
        y: 0
      }
    ])
    expect(pagesPos.pages[1]).toMatchObject([
      {
        cx: -450,
        cy: -150,
        height: 300,
        width: 300,
        x: -300,
        y: 0
      }
    ])
    expect(pagesPos.getPos(1, 0)).toMatchObject({
      cx: -450,
      cy: -150,
      height: 300,
      width: 300,
      x: -300,
      y: 0
    })
  })
  it('should get right nearest page number for horizon slide', () => {
    expect(pagesPos.getNearestPage(0, 0)).toMatchObject({
      pageX: 0,
      pageY: 0
    })
    expect(pagesPos.getNearestPage(-140, 0)).toMatchObject({
      pageX: 0,
      pageY: 0
    })
    expect(pagesPos.getNearestPage(-160, 0)).toMatchObject({
      pageX: 1,
      pageY: 0
    })
    expect(pagesPos.getNearestPage(-310, 0)).toMatchObject({
      pageX: 1,
      pageY: 0
    })
    expect(pagesPos.getNearestPage(-590, 0)).toMatchObject({
      pageX: 1,
      pageY: 0
    })
  })
  it('should get right page pos for horizon slide with el config', () => {
    pagesPos = new PagesPos(bscrollHorizon().partOfbscroll, {
      el: '.test-slide-item'
    })
    expect(pagesPos.xLen).toBe(2)
    expect(pagesPos.yLen).toBe(1)
    expect(pagesPos.pages[0]).toMatchObject([
      {
        cx: -150,
        cy: -150,
        height: 300,
        width: 300,
        x: -0,
        y: 0
      }
    ])
    expect(pagesPos.pages[1]).toMatchObject([
      {
        cx: -450,
        cy: -150,
        height: 300,
        width: 300,
        x: -300,
        y: 0
      }
    ])
    expect(pagesPos.getPos(1, 0)).toMatchObject({
      cx: -450,
      cy: -150,
      height: 300,
      width: 300,
      x: -300,
      y: 0
    })
  })

  it('should get right page pos for vertical slide', () => {
    pagesPos = new PagesPos(bscrollVertical().partOfbscroll, {})
    expect(pagesPos.xLen).toBe(1)
    expect(pagesPos.yLen).toBe(2)
    expect(pagesPos.pages[0]).toMatchObject([
      {
        cx: -150,
        cy: -150,
        height: 300,
        width: 300,
        x: 0,
        y: 0
      },
      {
        cx: -150,
        cy: -450,
        height: 300,
        width: 300,
        x: 0,
        y: -300
      }
    ])
    expect(pagesPos.getPos(0, 1)).toMatchObject({
      cx: -150,
      cy: -450,
      height: 300,
      width: 300,
      x: 0,
      y: -300
    })
  })
  it('should get right nearest page number for vertical slide', () => {
    expect(pagesPos.getNearestPage(0, 0)).toMatchObject({
      pageX: 0,
      pageY: 0
    })
    expect(pagesPos.getNearestPage(0, -140)).toMatchObject({
      pageX: 0,
      pageY: 0
    })
    expect(pagesPos.getNearestPage(0, -160)).toMatchObject({
      pageX: 0,
      pageY: 1
    })
    expect(pagesPos.getNearestPage(0, -310)).toMatchObject({
      pageX: 0,
      pageY: 1
    })
    expect(pagesPos.getNearestPage(0, -590)).toMatchObject({
      pageX: 0,
      pageY: 1
    })
  })
  it('should have right info for no page info', () => {
    const bscroll = bscrollHorizon().partOfbscroll
    const sliderDom = bscroll.scroller.content
    const wrapperDom = bscroll.scroller.wrapper
    mockDomOffset(sliderDom, {
      width: 0,
      height: 0
    })
    mockDomOffset(wrapperDom, {
      width: 0,
      height: 0
    })
    pagesPos = new PagesPos(bscroll as BScroll, {})
    expect(pagesPos.xLen).toBe(0)
    expect(pagesPos.yLen).toBe(0)
    expect(pagesPos.getNearestPage(0, 0)).toBeUndefined
  })
})
