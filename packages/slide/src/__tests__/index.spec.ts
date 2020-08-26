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
  return { wrapper }
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
    expect(scroll.registerType).toHaveBeenCalledWith(['slideWillChange'])

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

  describe('tap into scroll', () => {
    it('should pause play when BScroll trigger beforeScrollStart hook', () => {
      const spyFn = jest.spyOn(Slide.prototype, 'pausePlay')
      slide = new Slide(scroll)
      scroll.trigger(scroll.eventTypes.beforeScrollStart)

      expect(spyFn).toBeCalled()
    })

    it('should call modifyCurrentPage() when BScroll trigger scrollEnd hook', () => {
      const spyFn = jest.spyOn(Slide.prototype, 'startPlay')
      slide = new Slide(scroll)
      scroll.trigger(scroll.eventTypes.scrollEnd)
      expect(spyFn).toBeCalled()
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
      const spyFn = jest.spyOn(Slide.prototype, 'startPlay')
      slide = new Slide(scroll)
      const position = {}
      scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
      scroll.hooks.trigger(
        scroll.hooks.eventTypes.beforeInitialScrollTo,
        position
      )

      expect(slide.pages.refresh).toBeCalled()
      expect(slide.pages.getInitialPage).toBeCalled()
      expect(slide.pages.setCurrentPage).toBeCalledWith({
        pageX: 0,
        pageY: 0,
        x: 10,
        y: 10,
      })
      expect(position).toMatchObject({
        x: 10,
        y: 10,
      })
      expect(spyFn).toBeCalled()
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

      expect(slide.pages.setCurrentPage).toBeCalledWith({
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 0,
      })

      expect(slide.pages.getWillChangedPage).toBeCalledWith({
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 0,
      })
    })

    it('should call setTouchFlag when scroller.hooks.scroll triggered', () => {
      const position = {
        x: 0,
        y: 0,
      }
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.scroll,
        position
      )

      expect(slide.pages.getWillChangedPage).not.toBeCalled()

      const scrollMeta = {
        newX: -1,
        newY: -1,
        time: 0,
      }
      // set isTouching = true
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.momentum,
        scrollMeta
      )
      scroll.scroller.hooks.trigger(
        scroll.scroller.hooks.eventTypes.scroll,
        position
      )

      expect(slide.pages.getWillChangedPage).toBeCalled()
    })

    it('should start a new autoPlay timer when scroller.hooks.checkClick triggered', () => {
      const spyFn = jest.spyOn(Slide.prototype, 'startPlay')
      slide = new Slide(scroll)

      expect(spyFn).toBeCalled()
    })
  })
})
