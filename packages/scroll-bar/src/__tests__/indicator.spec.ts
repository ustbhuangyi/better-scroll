import BScroll from '@better-scroll/core'
import EventHandler from '../event-handler'
import { style } from '@better-scroll/shared-utils'

jest.mock('@better-scroll/core')
jest.mock('../event-handler')

import Indicator, { IndicatorOption } from '../indicator'
import { Direction } from '../index'
import { mockDomClient } from '@better-scroll/core/src/__tests__/__utils__/layout'

describe('indicator unit tests', () => {
  let bscroll: BScroll
  let indicatorOptions: IndicatorOption
  let indicator: Indicator

  beforeAll(() => {
    // create Dom
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    bscroll = new BScroll(wrapper, {})
    bscroll.options.translateZ = ''
    // given for vertical
    bscroll.hasVerticalScroll = true
    bscroll.scrollerHeight = 200
    bscroll.maxScrollY = -100
    bscroll.x = bscroll.y = -10
  })

  beforeEach(() => {
    // create Dom indicator
    const indicatorWrapper = document.createElement('div')
    const indicatorEl = document.createElement('div')
    indicatorWrapper.appendChild(indicatorEl)
    // mock clientHeight and clientWidth
    mockDomClient(indicatorWrapper, { height: 100, width: 100 })

    indicatorOptions = {
      wrapper: indicatorWrapper,
      direction: 'vertical' as Direction,
      fade: true,
      interactive: true
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
    bscroll.off()
  })

  describe('refresh', () => {
    beforeEach(() => {
      // given for horizontal
      bscroll.hasHorizontalScroll = true
      bscroll.scrollerWidth = 200
      bscroll.maxScrollX = -100
    })

    it('should update position and size correctly when direction is horizontal', () => {
      // given

      indicatorOptions.direction = 'horizontal' as Direction
      indicator = new Indicator(bscroll, indicatorOptions)
      // when
      bscroll.trigger('refresh')
      // then
      expect(indicator.el.style.width).toBe('50px')
      expect(indicator.el.style[style.transform as any]).toBe('translateX(5px)')
    })

    it('should update position and size correctly when direction is vertical', () => {
      // given
      indicatorOptions.direction = 'vertical' as Direction
      indicator = new Indicator(bscroll, indicatorOptions)
      // when
      bscroll.trigger('refresh')
      // then
      expect(indicator.el.style.height).toBe('50px')
      expect(indicator.el.style[style.transform as any]).toBe('translateY(5px)')
    })
  })

  describe('listen translater event translate', () => {
    beforeEach(() => {
      // given
      indicator = new Indicator(bscroll, indicatorOptions)
    })

    it('should calculate correctlly when content scroll down out of bounds', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: 10 })
      // then
      expect(indicator.el.style.height).toBe('35px')
    })

    it('should reach minimum size when content scroll down out of bounds too much', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: 30 })
      // then
      expect(indicator.el.style.height).toBe('8px')
    })

    it('should calculate correctlly when content scroll up out of bounds', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: -110 })
      // then
      expect(indicator.el.style.height).toBe('35px')
    })

    it('should reach minimum size when content scroll up out of bounds too much', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: -130 })
      // then
      expect(indicator.el.style.height).toBe('8px')
    })
  })

  describe('indicator fade', () => {
    it('indicator visible forever when fade false', () => {
      // given
      indicatorOptions.fade = false
      indicator = new Indicator(bscroll, indicatorOptions)
      // when
      bscroll.trigger('scrollEnd')
      // then
      expect(indicator.wrapperStyle.opacity).toBe('')
    })

    it('indicator fade visible when trigger scrollEnd', () => {
      // given
      indicator = new Indicator(bscroll, indicatorOptions)
      // when
      bscroll.trigger('scrollStart')
      // then
      expect(indicator.wrapperStyle.opacity).toBe('1')
      expect(indicator.wrapperStyle[style.transitionDuration as any]).toBe(
        '250ms'
      )
    })

    it('indicator fade invisible when trigger scrollEnd', () => {
      // given
      indicator = new Indicator(bscroll, indicatorOptions)
      // when
      bscroll.trigger('scrollEnd')
      // then
      expect(indicator.wrapperStyle.opacity).toBe('0')
      expect(indicator.wrapperStyle[style.transitionDuration as any]).toBe(
        '500ms'
      )
    })
  })

  describe('indicator interactive', () => {
    it('should not instantiate EventHandler when interactive false', () => {
      // given
      indicatorOptions.interactive = false
      // when
      indicator = new Indicator(bscroll, indicatorOptions)
      // then
      expect(EventHandler).toHaveBeenCalledTimes(0)
    })

    describe('listen eventHandler touchStart', () => {
      let beforeScrollStartHandler = jest.fn()
      beforeEach(() => {
        // given
        indicatorOptions.interactive = true
        indicator = new Indicator(bscroll, indicatorOptions)
        bscroll.on('beforeScrollStart', beforeScrollStartHandler)
      })

      it('should trigger beforeScrollStart', () => {
        // when
        indicator.eventHandler.hooks.trigger('touchStart')
        // then
        expect(beforeScrollStartHandler).toBeCalledTimes(1)
      })
    })

    describe('listen eventHandler touchMove', () => {
      let scrollHandler = jest.fn()
      let scrollStartHandler = jest.fn()
      beforeEach(() => {
        // given
        indicatorOptions.interactive = true
        indicator = new Indicator(bscroll, indicatorOptions)
        bscroll.on('scrollStart', scrollStartHandler)
        bscroll.on('scroll', scrollHandler)
      })

      it('should trigger scrollStart', () => {
        // given
        const moved = false
        // when
        indicator.eventHandler.hooks.trigger('touchMove', moved, 10)
        // then
        expect(scrollStartHandler).toBeCalledTimes(1)
      })

      it('should trigger scroll event', () => {
        // given
        const moved = true
        // when
        indicator.eventHandler.hooks.trigger('touchMove', moved, -10)
        // then
        expect(scrollHandler).toBeCalledTimes(1)
      })

      it('should scroll to correct position', () => {
        // given
        const moved = true
        // when
        indicator.eventHandler.hooks.trigger('touchMove', moved, 10)
        // then
        expect(bscroll.scrollTo).toBeCalledWith(-10, -30)
      })

      it('should scroll to top when reach top boundary', () => {
        // given
        const moved = true
        // when
        indicator.eventHandler.hooks.trigger('touchMove', moved, -10)
        // then
        expect(bscroll.scrollTo).toBeCalledWith(-10, -0)
      })

      it('should scroll to bottom when reach bottom boundary', () => {
        // given
        const moved = true
        // when
        indicator.eventHandler.hooks.trigger('touchMove', moved, 60)
        // then
        expect(bscroll.scrollTo).toBeCalledWith(-10, -100)
      })
    })

    describe('listen eventHandler touchEnd', () => {
      let scrollEndHandler = jest.fn()

      beforeEach(() => {
        // given
        indicatorOptions.interactive = true
        indicator = new Indicator(bscroll, indicatorOptions)
        bscroll.on('scrollEnd', scrollEndHandler)
      })

      it('should not trigger scrollEnd when not moved', () => {
        // given
        const moved = false
        // when
        indicator.eventHandler.hooks.trigger('touchEnd', moved)
        // then
        expect(scrollEndHandler).toBeCalledTimes(0)
      })

      it('should trigger scrollEnd when moved', () => {
        // given
        const moved = true
        // when
        indicator.eventHandler.hooks.trigger('touchEnd', moved)
        // then
        expect(scrollEndHandler).toBeCalledTimes(1)
      })
    })
  })
})
