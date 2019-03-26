import { Options } from '@/Options'
import BScroll from '@/index'

jest.mock('@/index')
jest.mock('@/Options')
jest.mock('@/util/dom')

import Indicator, { IndicatorOption } from '@/plugins/scroll-bar/indicator'
import { Direction } from '@/plugins/scroll-bar/const'

describe('indicator unit tests', () => {
  let options: Options
  let bscroll: BScroll
  let indicatorOptions: IndicatorOption

  beforeAll(() => {
    // MOCK for BScroll
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    options = new Options()
    options.scrollY = true
    bscroll = new BScroll(wrapper, options)
    bscroll.translateZ = ''
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
    // MOCK for indicator
    const indicatorWrapper = document.createElement('div')
    const indicatorEl = document.createElement('div')
    indicatorWrapper.appendChild(indicatorEl)

    Object.defineProperties(indicatorWrapper, {
      clientHeight: {
        get: function() {
          return 100
        }
      },
      clientWidth: {
        get: function() {
          return 100
        }
      }
    })
    indicatorOptions = {
      wrapper: indicatorWrapper,
      direction: 'vertical' as Direction,
      fade: true,
      interactive: true
    }

    jest.clearAllMocks()
  })
  describe('should update position and size when bscroll refresh', () => {
    it('direction is vertical', () => {
      const indicator = new Indicator(bscroll, indicatorOptions)

      expect(bscroll.hooks.on).toBeCalledWith(
        'refresh',
        indicator.refresh,
        indicator
      )

      indicator.refresh()

      expect(indicator.el.style.height).toBe('50px')
      expect(indicator.el.style.top).toBe('5px')
    })

    it('direction is horizontal', () => {
      indicatorOptions.direction = 'horizontal' as Direction
      const indicator = new Indicator(bscroll, indicatorOptions)

      expect(bscroll.hooks.on).toBeCalledWith(
        'refresh',
        indicator.refresh,
        indicator
      )

      indicator.refresh()

      expect(indicator.el.style.width).toBe('50px')
      expect(indicator.el.style.left).toBe('5px')
    })

    it('useTransform', () => {
      indicatorOptions.direction = 'horizontal' as Direction
      bscroll.options.useTransform = true
      const indicator = new Indicator(bscroll, indicatorOptions)

      expect(bscroll.hooks.on).toBeCalledWith(
        'refresh',
        indicator.refresh,
        indicator
      )

      indicator.refresh()

      expect(indicator.el.style.width).toBe('50px')
      expect(indicator.el.style.transform).toBe('translateX(5px)')
    })
  })

  describe('updatePosAndSize unit test', () => {
    it('should calculate correctlly when content scroll down out of bounds', () => {
      const indicator = new Indicator(bscroll, indicatorOptions)
      indicator.refresh() // manual refresh for updating keyValues

      expect(bscroll.scroller.animater.hooks.on).toBeCalledWith(
        'translate',
        indicator.updatePosAndSize,
        indicator
      )

      indicator.updatePosAndSize({ x: 0, y: 10 })

      expect(indicator.el.style.height).toBe('35px')
      expect(indicator.el.style.top).toBe('0px')
    })

    it('should reach minimum size when content scroll down out of bounds too much', () => {
      const indicator = new Indicator(bscroll, indicatorOptions)
      indicator.refresh() // manual refresh for updating keyValues

      expect(bscroll.scroller.animater.hooks.on).toBeCalledWith(
        'translate',
        indicator.updatePosAndSize,
        indicator
      )

      indicator.updatePosAndSize({ x: 0, y: 30 })

      expect(indicator.el.style.height).toBe('8px')
      expect(indicator.el.style.top).toBe('0px')
    })

    it('should calculate correctlly when content scroll up out of bounds', () => {
      const indicator = new Indicator(bscroll, indicatorOptions)
      indicator.refresh() // manual refresh for updating keyValues

      expect(bscroll.scroller.animater.hooks.on).toBeCalledWith(
        'translate',
        indicator.updatePosAndSize,
        indicator
      )

      indicator.updatePosAndSize({ x: 0, y: -110 })

      expect(indicator.el.style.height).toBe('35px')
      expect(indicator.el.style.top).toBe('65px')
    })

    it('should reach minimum size when content scroll up out of bounds too much', () => {
      const indicator = new Indicator(bscroll, indicatorOptions)
      indicator.refresh() // manual refresh for updating keyValues

      expect(bscroll.scroller.animater.hooks.on).toBeCalledWith(
        'translate',
        indicator.updatePosAndSize,
        indicator
      )

      indicator.updatePosAndSize({ x: 0, y: -130 })

      expect(indicator.el.style.height).toBe('8px')
      expect(indicator.el.style.top).toBe('92px')
    })
  })
})
