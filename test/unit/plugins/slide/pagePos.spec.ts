import PagesPos from '../../../../src/plugins/slide/PagesPos'
import BScroll from '../../../../src'
jest.mock('../../../../src/util/dom', () => ({
  getRect: require('./__mock__/dom').mockGetRect
}))
import { bscrollHorizon, bscrollVertical } from './__mock__/bscroll'

describe('slide test for pagePos class', () => {
  let pagesPos: PagesPos
  beforeAll(() => {})

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get right page pos', () => {
    pagesPos = new PagesPos(bscrollHorizon(), {})
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
  it('nearest page function for horizon', () => {
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
  it('page pos of el', () => {
    pagesPos = new PagesPos(bscrollHorizon(), {
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

  it('vertical slide', () => {
    pagesPos = new PagesPos(bscrollVertical(), {})
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
  it('nearest page function for vertical', () => {
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
  it('no page info', () => {
    const bscroll = bscrollHorizon()
    const sliderDom = bscroll.scroller.element
    sliderDom.setAttribute('data-height', '0')
    sliderDom.setAttribute('data-width', '0')
    const wrapperDom = bscroll.scroller.wrapper
    wrapperDom.setAttribute('data-height', '0')
    wrapperDom.setAttribute('data-width', '0')
    pagesPos = new PagesPos(bscroll as BScroll, {})
    expect(pagesPos.xLen).toBe(0)
    expect(pagesPos.yLen).toBe(0)
    expect(pagesPos.getNearestPage(0, 0)).toBeUndefined
  })
})
