import BScroll from '@better-scroll/core'
import Slide from '../index'
import SlidePages from '../SlidePages'
import { ease } from '@better-scroll/shared-utils'

jest.mock('@better-scroll/core')
jest.mock('../SlidePages')

const createSlideElements = (len = 3) => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  for (let i = 0; i < len; i++) {
    content.appendChild(document.createElement('p'))
  }
  wrapper.appendChild(content)
  return { wrapper, content }
}

describe('slide test for SlidePage class', () => {
  let scroll: BScroll
  let slide: Slide
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    const { wrapper } = createSlideElements()
    scroll = new BScroll(wrapper, {})
    slide = new Slide(scroll)
  })

  afterAll(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should fail when slideContent has no children element', () => {
    const spyFn = jest.spyOn(console, 'error')
    const { wrapper } = createSlideElements(0)
    scroll = new BScroll(wrapper, {})
    slide = new Slide(scroll)

    expect(spyFn).toBeCalled()
  })

  it('should proxy hooks to BScroll instance', () => {
    expect(scroll.registerType).toHaveBeenCalledWith([
      'slideWillChange',
      'slidePageChanged',
    ])

    expect(scroll.proxy).toHaveBeenLastCalledWith([
      {
        key: 'next',
        sourceKey: 'plugins.slide.next',
      },
      {
        key: 'prev',
        sourceKey: 'plugins.slide.prev',
      },
      {
        key: 'goToPage',
        sourceKey: 'plugins.slide.goToPage',
      },
      {
        key: 'getCurrentPage',
        sourceKey: 'plugins.slide.getCurrentPage',
      },
      {
        key: 'startPlay',
        sourceKey: 'plugins.slide.startPlay',
      },
      {
        key: 'pausePlay',
        sourceKey: 'plugins.slide.pausePlay',
      },
    ])
  })

  it('should handle default options and user options', () => {
    // case 1
    scroll.options.slide = true
    slide = new Slide(scroll)

    expect(slide.options).toMatchObject({
      loop: true,
      threshold: 0.1,
      speed: 400,
      easing: ease.bounce,
      listenFlick: true,
      autoplay: true,
      interval: 3000,
    })

    // case 2
    scroll.options.slide = {
      loop: false,
      autoplay: false,
    }
    slide = new Slide(scroll)

    expect(slide.options).toMatchObject({
      loop: false,
      threshold: 0.1,
      speed: 400,
      easing: ease.bounce,
      listenFlick: true,
      autoplay: false,
      interval: 3000,
    })
  })

  it('should clone the first and last page when loop is true', () => {
    const content = scroll.scroller.content
    scroll.scroller.hooks.trigger(
      scroll.scroller.hooks.eventTypes.beforeRefresh
    )
    expect(content.children.length).toBe(5)
  })

  it('should not clone the first and last page when loop is false', () => {
    const { wrapper } = createSlideElements()
    scroll = new BScroll(wrapper)
    scroll.options.slide = {
      loop: false,
    }
    slide = new Slide(scroll)
    scroll.scroller.hooks.trigger(
      scroll.scroller.hooks.eventTypes.beforeRefresh
    )
    const content = scroll.scroller.content
    expect(content.children.length).toBe(3)
  })

  it('should failed to initialised slide when only has a child', () => {
    const { wrapper } = createSlideElements(0)
    const spyFn = jest.spyOn(console, 'error')
    scroll = new BScroll(wrapper, {})
    slide = new Slide(scroll)
    expect(spyFn).toBeCalled()
  })

  describe('api', () => {
    it('goToPage()', () => {
      slide.goToPage(2, 0)

      expect(scroll.scroller.scrollTo).toBeCalledWith(
        20,
        20,
        400,
        expect.anything()
      )
    })

    it('getCurrentPage()', () => {
      slide.getCurrentPage()

      expect(slide.pages.getInitialPage).toBeCalled()
    })

    it('startPlay()', () => {
      slide.startPlay()
      jest.advanceTimersByTime(4000)
      expect(scroll.scroller.scrollTo).toBeCalledWith(
        20,
        20,
        400,
        expect.anything()
      )
    })
  })

  describe('tap into scroll', () => {
    it('should pause play when BScroll trigger beforeScrollStart hook', () => {
      const spyFn = jest.spyOn(Slide.prototype, 'pausePlay')
      slide = new Slide(scroll)
      scroll.trigger(scroll.eventTypes.beforeScrollStart)

      expect(spyFn).toBeCalled()
    })

    it('should call modifyCurrentPage() when BScroll trigger scrollEnd hook', () => {
      // simulate stopping from animation
      scroll.scroller.animater.forceStopped = true
      scroll.trigger(scroll.eventTypes.scrollEnd, { x: 0, y: 0 })

      expect(slide.pages.setCurrentPage).toBeCalled()

      scroll.trigger(scroll.eventTypes.scrollEnd, { x: 0, y: 0 })
      expect(slide.pages.resetLoopPage).toBeCalledTimes(1)
    })

    it('slidePageChanged event', () => {
      const { wrapper } = createSlideElements()
      const scroll = new BScroll(wrapper, {})
      const slide = new Slide(scroll)
      scroll.trigger(scroll.eventTypes.scrollEnd, { x: 0, y: 0 })
      expect(slide.pages.getExposedPageByPageIndex).toBeCalled()
    })

    it('should stop mousewheelMove handler chain', () => {
      scroll.registerType(['mousewheelMove'])
      slide = new Slide(scroll)
      const mock = jest.fn()
      scroll.on(scroll.eventTypes.mousewheelMove, mock)
      scroll.trigger(scroll.eventTypes.mousewheelMove)
      expect(mock).not.toBeCalled()
    })

    it('should call next/prev in mousewheelEnd hook', () => {
      scroll.registerType(['mousewheelMove', 'mousewheelEnd'])
      slide = new Slide(scroll)
      const nextSpyFn = jest.spyOn(Slide.prototype, 'next')
      const prevSpyFn = jest.spyOn(Slide.prototype, 'prev')
      const delta1 = {
        directionX: -1,
        directionY: -1,
      }
      scroll.trigger(scroll.eventTypes.mousewheelEnd, delta1)
      expect(prevSpyFn).toBeCalled()
      const delta2 = {
        directionX: 1,
        directionY: 1,
      }
      scroll.trigger(scroll.eventTypes.mousewheelEnd, delta2)
      expect(nextSpyFn).toBeCalled()
    })
  })

  describe('tap into scroll hooks', () => {
    it('should call refreshHandler when Bscroll.hooks.refresh triggered', () => {
      // case 1 content changed
      let wrapper1 = createSlideElements().wrapper
      scroll = new BScroll(wrapper1, {
        slide: {
          threshold: 100,
        },
      })
      slide = new Slide(scroll)
      ;(slide as any).initialised = true
      scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)

      expect(scroll.scroller.scrollTo).toBeCalledWith(
        20,
        20,
        0,
        expect.anything()
      )
      expect(slide.pages.getInitialPage).toHaveBeenCalled()

      // case 2 content has only no child
      let { wrapper: wrapper2, content: content2 } = createSlideElements(1)
      scroll = new BScroll(wrapper2, {})
      slide = new Slide(scroll)
      content2.removeChild(content2.children[0])
      scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
      expect(slide.pages.refresh).not.toBeCalled()

      // case3 common refresh
      let { wrapper: wrapper3 } = createSlideElements(1)
      scroll = new BScroll(wrapper3, {})
      slide = new Slide(scroll)
      const spyFn2 = jest.spyOn(Slide.prototype, 'startPlay')
      const position = {}
      scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
      scroll.hooks.trigger(
        scroll.hooks.eventTypes.beforeInitialScrollTo,
        position
      )

      expect(slide.pages.refresh).toBeCalled()
      expect(slide.pages.getInitialPage).toBeCalled()
      expect(position).toMatchObject({
        x: 10,
        y: 10,
      })
      expect(spyFn2).toBeCalled()
    })
  })

  describe('tap into scroller hooks', () => {
    it('should call modifyScrollMetaHandler when scroller.hooks.momentum triggered', () => {
      const scrollMeta = {
        newX: -1,
        newY: -1,
        time: 0,
      }
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.momentum,
        scrollMeta
      )
      expect(scrollMeta.newX).toBe(0)
      expect(scrollMeta.newY).toBe(0)
      expect(scrollMeta.time).toBe(400)

      expect(slide.pages.getPageByDirection).toBeCalledWith(
        {
          x: 0,
          y: 0,
          pageX: 0,
          pageY: 0,
        },
        0,
        0
      )
    })
    it('should start a new autoPlay timer when scroller.hooks.checkClick triggered', () => {
      const spyFn = jest.spyOn(Slide.prototype, 'startPlay')
      slide = new Slide(scroll)

      scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.checkClick)
      expect(spyFn).toBeCalled()
    })

    it('should go to next/pre page scroller.hooks.flickHandler triggered', () => {
      slide = new Slide(scroll)

      scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.flick)

      expect(scroll.scroller.scrollTo).toBeCalledWith(
        20,
        20,
        400,
        expect.anything()
      )
    })

    it('should dispatch slideWillChange event when scroller.hooks.scroll triggered', () => {
      slide = new Slide(scroll)
      let pageX = 0

      scroll.on(scroll.eventTypes.slideWillChange, (Page: any) => {
        pageX = Page.pageX
      })
      slide.pages.getWillChangedPage = jest.fn().mockImplementation(() => {
        return {
          pageX: 1,
          pageY: 0,
          x: 0,
          y: 0,
        }
      })
      scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
      scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.scroll, {
        x: 0,
        y: 0,
      })
      expect(pageX).toBe(0)

      scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.scroll, {
        x: 200,
        y: 0,
      })
      expect(pageX).toBe(1)
    })

    it('scroller.hooks.beforeRefresh', () => {
      const { wrapper } = createSlideElements()
      const scroll = new BScroll(wrapper, {})
      const slide = new Slide(scroll)

      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.beforeRefresh
      )
      expect(scroll.scroller.content.children.length).toBe(5)

      // slideContent changed
      slide.prevContent = document.createElement('p')
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.beforeRefresh
      )
      expect(scroll.scroller.content.children.length).toBe(7)

      // many pages reduce to one page
      const mockFn1 = jest.fn()
      slide.initialised = true
      slide.prevContent = wrapper.children[0] as HTMLElement
      const childrenEl = [...Array.from(scroll.scroller.content.children)]
      for (let i = 1; i < 5; i++) {
        scroll.scroller.content.removeChild(childrenEl[i])
      }
      scroll.on(scroll.eventTypes.scrollEnd, mockFn1)
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.beforeRefresh
      )
      scroll.trigger(scroll.eventTypes.scrollEnd, { x: 0, y: 0 })
      expect(scroll.scroller.content.children.length).toBe(1)
      expect(mockFn1).not.toBeCalled()

      // one page increases to many page
      const mockFn2 = jest.fn()
      scroll.scroller.content.appendChild(document.createElement('div'))
      scroll.on(scroll.eventTypes.scrollEnd, mockFn1)
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.beforeRefresh
      )
      scroll.trigger(scroll.eventTypes.scrollEnd, { x: 0, y: 0 })
      expect(scroll.scroller.content.children.length).toBe(4)
      expect(mockFn2).not.toBeCalled()
      while (scroll.scroller.content.children.length) {
        const len = scroll.scroller.content.children.length
        scroll.scroller.content.removeChild(
          scroll.scroller.content.children[len - 1]
        )
      }
      // reset loop changed status
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.beforeRefresh
      )
    })
  })

  it('should destroy all events', () => {
    scroll.scroller.hooks.trigger(
      scroll.scroller.hooks.eventTypes.beforeRefresh
    )
    scroll.hooks.trigger(scroll.hooks.eventTypes.destroy)

    expect(scroll.scroller.content.children.length).toBe(3)
    expect(scroll.events['beforeScrollStart'].length).toBe(0)
    expect(scroll.events['scrollEnd'].length).toBe(0)
  })
})
