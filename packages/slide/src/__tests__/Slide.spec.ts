import BScroll from '@better-scroll/core'
import Slide from '../index'
import { EventEmitter } from '@better-scroll/shared-utils'
import {
  bscrollHorizon,
  bscrollVertical,
  replaceBscrollProperties
} from './__utils__/bscroll'
import * as SlidePage from './__utils__/SlidePage'
jest.mock('@better-scroll/slide/src/SlidePage', () => {
  return require('./__utils__/SlidePage').SlidePage
})
jest.mock('@better-scroll/core')
jest.mock('@better-scroll/core/src/animater/index')

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
  let mockData
  if (options.direction === 'horizon') {
    mockData = bscrollHorizon(options.slideNum)
  }
  if (options.direction === 'vertical') {
    mockData = bscrollVertical(options.slideNum)
  }
  let { partOfbscroll, dom } = mockData
  const bscroll = new BScroll(dom) as any
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
  const originSlideLen = bscroll.scroller.content.children.length
  return {
    bscroll,
    mockscrollTo,
    originSlideLen
  }
}

describe('slide test for SlidePage class', () => {
  let hooks: EventEmitter
  beforeAll(() => {
    hooks = new EventEmitter([
      'beforeStart',
      'scroll',
      'refresh',
      'momentum',
      'scrollEnd',
      'forceStop',
      'flick',
      'destroy',
      'resize'
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
  it('should hava right initial value & should off all events when destroy', () => {
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
    expect(bscroll.scroller.content.children.length).toBe(originSlideLen + 2)
    // setWidth
    expect(bscroll.scroller.content.style.width).toBe('1200px')
    // lazyInit
    expect(bscroll.refresh).toBeCalled()
    slide.destroy()
    // destroy
    expect(bscroll.scroller.content.children.length).toBe(originSlideLen)
    expect(hooks.events['refresh'].length).toBe(0)
    expect(hooks.events['momentum'].length).toBe(0)
    expect(bscroll.events['scrollEnd'].length).toBe(0)
    expect(hooks.events['flick'].length).toBe(0)
    expect(hooks.events['destroy'].length).toBe(0)
  })
  it('should support mousewheel event', () => {
    const { bscroll, originSlideLen } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    bscroll.eventTypes['mousewheelMove'] = 'mousewheelMove'
    bscroll.eventTypes['mousewheelEnd'] = 'mousewheelEnd'
    const slide = new Slide(bscroll)
    const nextSpy = jest.spyOn(slide, 'next').mockImplementation(() => {
      return true
    })
    const prevSpy = jest.spyOn(slide, 'prev').mockImplementation(() => {
      return true
    })
    // should prevent default action of mousewheelMove
    expect(bscroll.trigger('mousewheelMove')).toBe(true)

    bscroll.trigger('mousewheelEnd', { directionX: -1, directionY: 0 })
    expect(prevSpy).toHaveBeenCalled()
    bscroll.trigger('mousewheelEnd', { directionX: 1, directionY: 0 })
    expect(nextSpy).toHaveBeenCalled()

    nextSpy.mockClear()
    prevSpy.mockClear()

    bscroll.trigger('mousewheelEnd', { directionX: 0, directionY: -1 })
    expect(prevSpy).toHaveBeenCalled()
    bscroll.trigger('mousewheelEnd', { directionX: 0, directionY: 1 })
    expect(nextSpy).toHaveBeenCalled()

    nextSpy.mockReset()
    prevSpy.mockReset()
  })
  it('should hava right initial value in SlidePage no loop', () => {
    const { bscroll, originSlideLen } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: false
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0
      }
    })
    const slide = new Slide(bscroll)
    expect(bscroll.scroller.content.children.length).toBe(originSlideLen)
    expect(bscroll.refresh).toBeCalled()
    // setWidth
    expect(bscroll.scroller.content.style.width).toBe('600px')
    slide.destroy()
  })
  it('should hava right initial value with slide has one child on loop x', () => {
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
    expect(bscroll.scroller.content.children.length).toBe(originSlideLen)
    expect(bscroll.refresh).toBeCalled()
    // setWidth
    expect(bscroll.scroller.content.style.width).toBe('300px')
    slide.destroy()
  })
  it('should hava right initial value with slide has one child on loop y', () => {
    const { bscroll, originSlideLen } = createBScroll(hooks, {
      slideNum: 1,
      slideOpt: {
        loop: true
      },
      scrollX: false,
      scrollY: true,
      direction: 'vertical'
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 1
      }
    })
    const slide = new Slide(bscroll)
    expect(bscroll.options.slide.loop).toBe(false)
    expect(bscroll.scroller.content.children.length).toBe(originSlideLen)
    expect(bscroll.refresh).toBeCalled()
    // setHeight
    expect(bscroll.scroller.content.children[0].style.height).toBe('300px')
    slide.destroy()
  })
  it('should have right init slide state for loopX', () => {
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

    SlidePage.change2safePage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })
    SlidePage.loopXGetter.mockImplementation(() => {
      return true
    })
    SlidePage.slideXGetter.mockImplementation(() => {
      return true
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0
    hooks.trigger('refresh')
    expect(SlidePage.change2safePage).toBeCalledWith(1, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(0)
    slide.destroy()
    SlidePage.loopXGetter.mockReset()
    SlidePage.slideXGetter.mockReset()
  })
  it('should have right init slide state for loopY', () => {
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

    SlidePage.change2safePage.mockImplementationOnce(() => {
      return {
        x: 0,
        y: -300,
        pageX: 0,
        pageY: 1
      }
    })
    SlidePage.loopYGetter.mockImplementation(() => {
      return true
    })
    SlidePage.slideYGetter.mockImplementation(() => {
      return true
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 1
      }
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0
    hooks.trigger('refresh')
    expect(SlidePage.change2safePage).toBeCalledWith(0, 1)
    expect(mockscrollTo.mock.calls[0][0]).toBe(0)
    expect(mockscrollTo.mock.calls[0][1]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][2]).toBe(0)
    slide.destroy()
    SlidePage.loopYGetter.mockReset()
    SlidePage.slideYGetter.mockReset()
  })
  it('should have right init slide state for no loop', () => {
    SlidePage.change2safePage.mockImplementationOnce(() => {
      return {
        x: 0,
        y: -300,
        pageX: 0,
        pageY: 1
      }
    })
    SlidePage.loopYGetter.mockImplementation(() => {
      return false
    })
    SlidePage.slideYGetter.mockImplementation(() => {
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
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0
      }
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0
    const slide = new Slide(bscroll)
    hooks.trigger('refresh')
    expect(SlidePage.change2safePage).toBeCalledWith(0, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(0)
    expect(mockscrollTo.mock.calls[0][1]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][2]).toBe(0)
    slide.destroy()
    SlidePage.loopYGetter.mockReset()
    SlidePage.slideYGetter.mockReset()
  })
  it('should have correct behavior for next function', () => {
    SlidePage.nextPage.mockImplementationOnce(() => {
      return {
        pageX: 2,
        pageY: 0
      }
    })
    SlidePage.change2safePage.mockImplementationOnce(() => {
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
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    const slide = new Slide(bscroll)
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0

    slide.next()
    expect(SlidePage.changeCurrentPage).toBeCalledWith({
      x: -600,
      y: 0,
      pageX: 2,
      pageY: 0
    })
    expect(SlidePage.change2safePage).toBeCalledWith(2, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-600)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(600)
    slide.destroy()
  })
  it('should have correct behavior for prev page & set speed', () => {
    SlidePage.prevPage.mockImplementationOnce(() => {
      return {
        pageX: 2,
        pageY: 0
      }
    })
    SlidePage.change2safePage.mockImplementationOnce(() => {
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
    expect(SlidePage.changeCurrentPage).toBeCalledWith({
      x: -600,
      y: 0,
      pageX: 2,
      pageY: 0
    })
    expect(SlidePage.change2safePage).toBeCalledWith(2, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-600)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(100)
    slide.destroy()
  })
  it('should have correct behavior for goTopage', () => {
    SlidePage.realPage2Page.mockImplementationOnce(() => {
      return {
        realX: 2,
        realY: 0
      }
    })
    SlidePage.change2safePage.mockImplementationOnce(() => {
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
    expect(SlidePage.changeCurrentPage).toBeCalledWith({
      x: -600,
      y: 0,
      pageX: 2,
      pageY: 0
    })
    expect(SlidePage.realPage2Page).toBeCalledWith(1, 1)
    expect(SlidePage.change2safePage).toBeCalledWith(2, 0)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-600)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(600)
    slide.destroy()
  })
  it('should not scroll with newPos = oldPos when goTo', () => {
    SlidePage.realPage2Page.mockImplementationOnce(() => {
      return {
        realX: 2,
        realY: 0
      }
    })
    SlidePage.change2safePage.mockImplementationOnce(() => {
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
    bscroll.scroller.scrollBehaviorX.currentPos = -600
    bscroll.scroller.scrollBehaviorY.currentPos = 0

    slide.goToPage(1, 1)
    expect(mockscrollTo).not.toHaveBeenCalled()
    slide.destroy()
  })
  it('should have correct behavior for getCurrentPage', () => {
    SlidePage.getRealPage.mockImplementationOnce(() => {
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
      pageX: 1,
      pageY: 1
    })
    slide.destroy()
  })
  it('should modify scroll data when momentum event be trigged', () => {
    const { bscroll } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 1,
        pageY: 0
      }
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
    hooks.trigger('momentum', metaData)
    expect(SlidePage.nearestPage).not.toBeCalled()
    expect(SlidePage.changeCurrentPage).toBeCalledWith({
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

    SlidePage.nearestPage.mockClear()
    SlidePage.currentPageSetter.mockClear()
    // > threshold & set threshold = 50
    SlidePage.nearestPage.mockImplementationOnce(() => {
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
    hooks.trigger('momentum', metaData)
    expect(SlidePage.nearestPage).toBeCalledWith(-160, 0, -1, 0)
    expect(SlidePage.changeCurrentPage).toBeCalledWith({
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
  it('should not scroll with loop is false when scrollEnd', () => {
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
    bscroll.trigger('scrollEnd')
    expect(mockscrollTo).not.toBeCalled()
    slide.destroy()
  })

  it('should resetLoop with loop=true when scrollEnd', () => {
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

    // loop: true and newPos != oldPos
    SlidePage.resetLoopPage.mockImplementationOnce(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    SlidePage.change2safePage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPage = 0
    bscroll.trigger('scrollEnd')
    expect(SlidePage.changeCurrentPage).toHaveBeenCalled()
    expect(mockscrollTo).toHaveBeenCalled()
    SlidePage.changeCurrentPage.mockClear()
    mockscrollTo.mockClear()

    SlidePage.resetLoopPage.mockImplementationOnce(() => {
      return undefined
    })
    bscroll.trigger('scrollEnd')
    expect(SlidePage.changeCurrentPage).not.toBeCalled()
    expect(mockscrollTo).not.toBeCalled()

    slide.destroy()
  })
  it('should scroll to right page when flick', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: false
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0
      }
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
    SlidePage.change2safePage.mockImplementationOnce(() => {
      return {
        x: -300,
        y: 0,
        pageX: 1,
        pageY: 0
      }
    })

    hooks.trigger('flick')
    expect(SlidePage.change2safePage).toBeCalledWith(1, 1)
    expect(mockscrollTo.mock.calls[0][0]).toBe(-300)
    expect(mockscrollTo.mock.calls[0][1]).toBe(0)
    expect(mockscrollTo.mock.calls[0][2]).toBe(600)
    slide.destroy()
  })
  it('should trigger slideWillChange event when slide > threshold', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      slideNum: 2,
      slideOpt: {
        loop: true
      },
      scrollX: true,
      scrollY: false,
      direction: 'horizon'
    })
    SlidePage.getInitPage.mockImplementation(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    const slide = new Slide(bscroll)
    hooks.trigger('refresh')

    let pageIndex = { pageX: 0, pageY: 0 }
    bscroll.on('slideWillChange', (page: { pageX: number; pageY: number }) => {
      pageIndex = page
    })
    SlidePage.getRealPage.mockImplementationOnce(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    SlidePage.nearestPage.mockImplementationOnce(() => {
      return {
        pageX: 1,
        pageY: 0
      }
    })
    bscroll.scroller.scrollBehaviorX.absStartPos = -200
    bscroll.scroller.scrollBehaviorY.absStartPos = 0

    hooks.trigger('beforeStart')
    hooks.trigger('scroll', {
      x: -50,
      y: 0
    })
    expect(pageIndex.pageX).toBe(1)
    slide.destroy()
  })
  it('should trigger slideWillChange event when pre/next be called', () => {
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
    hooks.trigger('refresh')

    let pageIndex = { pageX: 0, pageY: 0 }
    bscroll.on('slideWillChange', (page: { pageX: number; pageY: number }) => {
      pageIndex = page
    })
    bscroll.scroller.scrollBehaviorX.currentPos = 0
    bscroll.scroller.scrollBehaviorY.currentPos = 0

    SlidePage.nextPage.mockImplementationOnce(() => {
      return {
        pageX: 2,
        pageY: 0
      }
    })
    SlidePage.change2safePage.mockImplementationOnce(() => {
      return {
        x: -600,
        y: 0,
        pageX: 2,
        pageY: 0
      }
    })
    SlidePage.getRealPage.mockImplementationOnce(() => {
      return {
        pageX: 2,
        pageY: 0
      }
    })
    slide.next()

    expect(pageIndex.pageX).toBe(2)
    slide.destroy()
  })
})
