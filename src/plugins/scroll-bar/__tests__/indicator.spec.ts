import { Options } from '@/Options'
import BScroll from '@/index'

jest.mock('@/index')
jest.mock('@/Options')
jest.mock('@/util/dom')

import Indicator, { IndicatorOption } from '@/plugins/scroll-bar/indicator'
import { Direction } from '@/plugins/scroll-bar/const'
import { mockDomClient } from '@/../test/unit/utils/layout'

describe('indicator unit tests', () => {
  let options: Options
  let bscroll: BScroll
  let indicatorOptions: IndicatorOption
  let indicator: Indicator

  beforeAll(() => {
    // MOCK for BScroll
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    options = new Options()
    options.scrollY = true
    options.translateZ = ''
    bscroll = new BScroll(wrapper, options)
    bscroll.hasVerticalScroll = true
    bscroll.hasHorizontalScroll = true
    bscroll.scrollerHeight = 200
    bscroll.scrollerWidth = 200
    bscroll.maxScrollY = -100
    bscroll.maxScrollX = -100
    bscroll.x = bscroll.y = -10
  })

  beforeEach(() => {
    bscroll.options.useTransform = false
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

    jest.clearAllMocks()
  })

  afterEach(() => {
    bscroll.hooks.off()
    bscroll.scroller.translater.hooks.off()
    bscroll.scroller.animater.hooks.off()
  })

  describe('should update position and size when bscroll refresh', () => {
    it('direction is vertical', () => {
      const indicator = new Indicator(bscroll, indicatorOptions)

      bscroll.hooks.trigger('refresh')

      expect(indicator.el.style.height).toBe('50px')
      expect(indicator.el.style.top).toBe('5px')
    })

    it('direction is horizontal', () => {
      indicatorOptions.direction = 'horizontal' as Direction
      const indicator = new Indicator(bscroll, indicatorOptions)

      bscroll.hooks.trigger('refresh')

      expect(indicator.el.style.width).toBe('50px')
      expect(indicator.el.style.left).toBe('5px')
    })

    it('useTransform', () => {
      indicatorOptions.direction = 'horizontal' as Direction
      bscroll.options.useTransform = true
      const indicator = new Indicator(bscroll, indicatorOptions)

      bscroll.hooks.trigger('refresh')

      expect(indicator.el.style.width).toBe('50px')
      expect(indicator.el.style.transform).toBe('translateX(5px)')
    })
  })

  describe('updatePosAndSize unit test', () => {
    beforeEach(() => {
      // given
      indicator = new Indicator(bscroll, indicatorOptions)
    })
    it('should calculate correctlly when content scroll down out of bounds', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: 10 })
      // then
      expect(indicator.el.style.height).toBe('35px')
      expect(indicator.el.style.top).toBe('0px')
    })

    it('should reach minimum size when content scroll down out of bounds too much', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: 30 })
      // then
      expect(indicator.el.style.height).toBe('8px')
      expect(indicator.el.style.top).toBe('0px')
    })

    it('should calculate correctlly when content scroll up out of bounds', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: -110 })
      // then
      expect(indicator.el.style.height).toBe('35px')
      expect(indicator.el.style.top).toBe('65px')
    })

    it('should reach minimum size when content scroll up out of bounds too much', () => {
      // when
      bscroll.scroller.translater.hooks.trigger('translate', { x: 0, y: -130 })
      // then
      expect(indicator.el.style.height).toBe('8px')
      expect(indicator.el.style.top).toBe('92px')
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
      expect(indicator.wrapperStyle.transitionDuration).toBe('250ms')
    })

    it('indicator fade invisible when trigger scrollEnd', () => {
      // given
      indicator = new Indicator(bscroll, indicatorOptions)
      // when
      bscroll.trigger('scrollEnd')
      // then
      expect(indicator.wrapperStyle.opacity).toBe('0')
      expect(indicator.wrapperStyle.transitionDuration).toBe('500ms')
    })
  })
})
