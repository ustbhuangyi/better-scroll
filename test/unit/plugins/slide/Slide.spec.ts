import { mockClientWidth } from '../../utils/layout'
import BScroll from '../../../../src/index'
import Slide from '../../../../src/plugins/slide'
import EventEmitter from '../../../../src/base/EventEmitter'
import {
  bscrollHorizon,
  bscrollVertical,
  replaceBscrollProperties
} from './__mock__/bscroll'
import * as PageInfo from './__mock__/pageInfo'
jest.mock('../../../../src/plugins/slide/PageInfo', () => {
  return {
    default: require('./__mock__/pageInfo').pageInfo
  }
})
jest.mock('../../../../src/index')
jest.mock('../../../../src/animater/index')

function createBScroll(
  hooks: EventEmitter,
  options: {
    scrollX: boolean
    scrollY: boolean
    slideOpt: { [key: string]: any }
    slideNum: number
    direction: 'horizon' | 'vertical'
  }
) {
  const mockscrollTo = jest.fn()
  let partOfbscroll
  if (options.direction === 'horizon') {
    partOfbscroll = bscrollHorizon(options.slideNum)
  }
  if (options.direction === 'vertical') {
    partOfbscroll = bscrollVertical(options.slideNum)
  }
  const bscroll = new BScroll('test') as any
  partOfbscroll.options.scrollX = options.scrollX
  partOfbscroll.options.scrollY = options.scrollY
  partOfbscroll.options.slide = options.slideOpt
  replaceBscrollProperties(bscroll, partOfbscroll)
  bscroll.hooks = hooks
  bscroll.scroller.hooks = hooks
  bscroll.scroller.animater = {
    hooks: hooks
  }
  bscroll.scroller.scrollTo = mockscrollTo
  const originSlideLen = bscroll.scroller.element.children.length
  return {
    bscroll,
    mockscrollTo,
    originSlideLen
  }
}

describe('slide test for PageInfo class', () => {
  let hooks: EventEmitter
  beforeAll(() => {
    hooks = new EventEmitter([
      'refresh',
      'modifyScrollMeta',
      'scrollEnd',
      'forceStop',
      'flick',
      'destroy'
    ])
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      get: function() {
        return 0
      }
    })
  })
  it('new PageInfo/destroy', () => {
    mockClientWidth.get.mockImplementation(() => {
      return 300
    })
    const { bscroll, originSlideLen } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    expect(bscroll.proxy).toBeCalledTimes(1)
    expect(bscroll.scroller.element.children.length).toBe(originSlideLen + 2)
    // setWidth
    expect(bscroll.scroller.element.style.width).toBe('1200px')
    // lazyInit
    expect(bscroll.refresh).toBeCalled()
    slide.destroy()
    // destroy
    expect(bscroll.scroller.element.children.length).toBe(originSlideLen)
    expect(hooks.events['refresh'].length).toBe(0)
    expect(hooks.events['modifyScrollMeta'].length).toBe(0)
    expect(hooks.events['scrollEnd'].length).toBe(0)
    expect(hooks.events['flick'].length).toBe(0)
    expect(hooks.events['forceStop'].length).toBe(0)
    expect(hooks.events['destroy'].length).toBe(0)
  })
  it('new PageInfo no loop', () => {
    mockClientWidth.get.mockImplementation(() => {
      return 300
    })
    const { bscroll, originSlideLen } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: false
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    // init currentPage
    expect(PageInfo.currentPageSetter).toBeCalledWith({
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    })
    expect(bscroll.scroller.element.children.length).toBe(originSlideLen)
    expect(bscroll.refresh).not.toBeCalled()
    // setWidth
    expect(bscroll.scroller.element.style.width).toBe('600px')
    slide.destroy()
  })
  it('reset loop for one child', () => {
    const { bscroll, originSlideLen } = createBScroll(hooks, {
      slideNum: 1,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    expect(bscroll.options.slide.loop).toBe(false)
    expect(bscroll.scroller.element.children.length).toBe(originSlideLen)
    expect(bscroll.refresh).not.toBeCalled()
    // setWidth
    expect(bscroll.scroller.element.style.width).toBe('300px')
    slide.destroy()
  })
  it('init slide state for loopX', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)

    expect(bscroll.refresh).toBeCalled()

    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })
    PageInfo.loopXGetter.mockImplementation(() => {
      return true
    })
    PageInfo.slideXGetter.mockImplementation(() => {
      return true
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0
    hooks.trigger('refresh')
    expect(PageInfo.change2safePage).toBeCalledWith(1, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(0)
    slide.destroy()
    PageInfo.loopXGetter.mockReset()
    PageInfo.slideXGetter.mockReset()
  })
  it('init slide state for loopY', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: false,
      scrollY: true,
      direction: 'vertical'
    })
    const slide = new Slide(bscroll)

    expect(bscroll.refresh).toBeCalled()

    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: 0,
        y: -300,
        pageX: 0,
        pageY: 1
      }
    })
    PageInfo.loopYGetter.mockImplementation(() => {
      return true
    })
    PageInfo.slideYGetter.mockImplementation(() => {
      return true
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0
    hooks.trigger('refresh')
    expect(PageInfo.change2safePage).toBeCalledWith(0, 1)
    expect(mockscrollTo.mock.calls[0][0]).toBe(0)
    expect(mockscrollTo.mock.calls[0][1]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][2]).toBe(0)
    slide.destroy()
    PageInfo.loopYGetter.mockReset()
    PageInfo.slideYGetter.mockReset()
  })
  it('init slide state for no loop', () => {
    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: 0,
        y: -300,
        pageX: 0,
        pageY: 1
      }
    })
    PageInfo.loopYGetter.mockImplementation(() => {
      return false
    })
    PageInfo.slideYGetter.mockImplementation(() => {
      return true
    })
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: false
      },
      scrollX: false,
      scrollY: true,
      direction: 'vertical'
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0
    const slide = new Slide(bscroll)

    expect(PageInfo.change2safePage).toBeCalledWith(0, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(0)
    expect(mockscrollTo.mock.calls[0][1]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][2]).toBe(0)
    slide.destroy()
    PageInfo.loopYGetter.mockReset()
    PageInfo.slideYGetter.mockReset()
  })
  it('next page', () => {
    PageInfo.nextPage.mockImplementationOnce(() => {
      return {
        pageX: 2,
        pageY: 0
      }
    })
    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: -600,
        y: 0,
        pageX: 2,
        pageY: 0
      }
    })
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0

    slide.next()
    expect(PageInfo.currentPageSetter).toBeCalledWith({
      x: -600,
      y: 0,
      pageX: 2,
      pageY: 0
    })
    expect(PageInfo.change2safePage).toBeCalledWith(2, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-600)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(600)
    slide.destroy()
  })
  it('prev page & set speed', () => {
    PageInfo.prevPage.mockImplementationOnce(() => {
      return {
        pageX: 2,
        pageY: 0
      }
    })
    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: -600,
        y: 0,
        pageX: 2,
        pageY: 0
      }
    })
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true,
        speed: 100
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0

    slide.prev()
    expect(PageInfo.currentPageSetter).toBeCalledWith({
      x: -600,
      y: 0,
      pageX: 2,
      pageY: 0
    })
    expect(PageInfo.change2safePage).toBeCalledWith(2, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-600)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(100)
    slide.destroy()
  })
  it('go to page', () => {
    PageInfo.realPage2Page.mockImplementationOnce(() => {
      return {
        realX: 2,
        realY: 0
      }
    })
    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: -600,
        y: 0,
        pageX: 2,
        pageY: 0
      }
    })
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0

    slide.goToPage(1, 1)
    expect(PageInfo.currentPageSetter).toBeCalledWith({
      x: -600,
      y: 0,
      pageX: 2,
      pageY: 0
    })
    expect(PageInfo.realPage2Page).toBeCalledWith(1, 1)
    expect(PageInfo.change2safePage).toBeCalledWith(2, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-600)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(600)
    slide.destroy()
  })
  it('getCurrentPage', () => {
    PageInfo.getRealPage.mockImplementationOnce(() => {
      return {
        x: 1,
        y: 1,
        pageX: 1,
        pageY: 1
      }
    })
    const { bscroll } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    expect(slide.getCurrentPage()).toMatchObject({
      x: 1,
      y: 1,
      pageX: 1,
      pageY: 1
    })
    slide.destroy()
  })
  it('modifyScrollMeta', () => {
    const { bscroll } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)

    // < threshold,default:(30,30)
    bscroll.scroller.scrollBehaviorX.absStartPos = -90
    bscroll.scroller.scrollBehaviorY.absStartPos = 0
    let metaData = {
      newX: -100,
      newY: 0,
      time: 600
    }
    hooks.trigger('refresh')
    hooks.trigger('modifyScrollMeta', metaData)
    expect(PageInfo.nearestPage).not.toBeCalled()
    expect(PageInfo.currentPageSetter).toBeCalledWith({
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    })
    expect(metaData).toMatchObject({
      newX: 0,
      newY: 0,
      time: 300
    })

    PageInfo.nearestPage.mockClear()
    PageInfo.currentPageSetter.mockClear()
    // > threshold & set threshold = 50
    PageInfo.nearestPage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })
    bscroll.options.slide.threshold = 50
    bscroll.scroller.scrollBehaviorX.absStartPos = -90
    bscroll.scroller.scrollBehaviorY.absStartPos = 0
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -1200
    bscroll.scroller.scrollBehaviorX.minScrollPos = 0
    bscroll.scroller.scrollBehaviorY.maxScrollPos = 0
    bscroll.scroller.scrollBehaviorY.minScrollPos = 0
    bscroll.scroller.scrollBehaviorX.direction = -1
    bscroll.scroller.scrollBehaviorY.direction = 0
    metaData = {
      newX: -160,
      newY: -20,
      time: 800
    }
    hooks.trigger('refresh')
    hooks.trigger('modifyScrollMeta', metaData)
    expect(PageInfo.nearestPage).toBeCalledWith(-160, 0, -1, 0)
    expect(PageInfo.currentPageSetter).toBeCalledWith({
      x: -300,
      y: 0,
      pageX: 1,
      pageY: 0
    })
    expect(metaData).toMatchObject({
      newX: -300,
      newY: 0,
      time: 300
    })
    slide.destroy()
  })
  it('scrollEnd', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: false
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)
    hooks.trigger('scrollEnd')
    expect(mockscrollTo).not.toBeCalled()

    bscroll.options.slide.loop = true
    PageInfo.resetLoopPage.mockImplementationOnce(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })
    hooks.trigger('scrollEnd')
    expect(PageInfo.currentPageSetter).toHaveBeenCalled()
    expect(mockscrollTo).toHaveBeenCalled()

    PageInfo.currentPageSetter.mockClear()
    mockscrollTo.mockClear()
    PageInfo.resetLoopPage.mockImplementationOnce(() => {
      return undefined
    })
    hooks.trigger('scrollEnd')
    expect(PageInfo.currentPageSetter).not.toBeCalled()
    expect(mockscrollTo).not.toBeCalled()

    slide.destroy()
  })
  it('flick', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: false
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    const slide = new Slide(bscroll)

    const scrollBehaviorX = bscroll.scroller.scrollBehaviorX
    const scrollBehaviorY = bscroll.scroller.scrollBehaviorY
    scrollBehaviorX.currentPos = -600
    scrollBehaviorY.currentPos = 0
    scrollBehaviorX.startPos = 0
    scrollBehaviorY.startPos = 0
    scrollBehaviorX.direction = 1
    scrollBehaviorY.direction = 1
    PageInfo.change2safePage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })

    hooks.trigger('flick')
    expect(PageInfo.change2safePage).toBeCalledWith(1, 1)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(600)
    slide.destroy()
  })
})
