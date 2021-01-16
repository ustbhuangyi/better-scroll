import Indicator, { IndicatorDirection, OffsetType } from '../indicator'
import EventHandler from '../event-handler'
import BScroll from '@better-scroll/core'
import { dispatchClick } from '@better-scroll/core/src/__tests__/__utils__/event'

jest.mock('@better-scroll/core')
jest.mock('../event-handler')

const addProperties = <T extends Object, K extends Object>(
  target: T,
  source: K
) => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target
}

describe('scroll-bar indicator tests', () => {
  let scroll: BScroll
  let indicator: Indicator
  let wrapper = document.createElement('div')
  let indicatorEl = document.createElement('div')
  wrapper.appendChild(indicatorEl)
  let indicatorOptions = {
    wrapper,
    direction: IndicatorDirection.Vertical,
    fade: true,
    interactive: false,
    minSize: 8,
    isCustom: false,
    scrollbarTrackClickable: false,
    scrollbarTrackOffsetType: OffsetType.Step,
    scrollbarTrackOffsetTime: 300,
  }

  beforeEach(() => {
    // create Dom
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    scroll = new BScroll(wrapper, {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should have corrent key', () => {
    indicator = new Indicator(scroll, indicatorOptions)
    expect(indicator.keysMap).toMatchObject({
      hasScroll: 'hasVerticalScroll',
      size: 'height',
      wrapperSize: 'clientHeight',
      scrollerSize: 'scrollerHeight',
      maxScrollPos: 'maxScrollY',
      pos: 'y',
      point: 'pageY',
      translateProperty: 'translateY',
      domRect: 'top',
    })
    expect(wrapper.style.opacity).toEqual('0')
  })

  it('refresh hook', () => {
    Object.assign(indicatorOptions, {
      direction: IndicatorDirection.Horizontal,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    addProperties(scroll, {
      hasHorizontalScroll: true,
      maxScrollX: 8,
    })
    scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
    expect(indicator.currentPos).toBe(-8)
  })

  it('translate hook', () => {
    Object.assign(indicatorOptions, {
      direction: IndicatorDirection.Horizontal,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    addProperties(scroll, {
      hasHorizontalScroll: true,
      maxScrollX: 8,
    })
    const translaterHooks = scroll.scroller.translater.hooks
    scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
    translaterHooks.trigger(translaterHooks.eventTypes.translate, {
      x: 10,
      y: 0,
    })
    expect(indicator.currentPos).toBe(0)
  })

  it('transitionTime and transitionTimingFunction hook', () => {
    Object.assign(indicatorOptions, {
      direction: IndicatorDirection.Horizontal,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    const animaterHooks = scroll.scroller.animater.hooks
    animaterHooks.trigger(animaterHooks.eventTypes.time)
    animaterHooks.trigger(
      animaterHooks.eventTypes.timeFunction,
      'cubic-bezier(0.23, 1, 0.32, 1)'
    )
    expect(indicator.indicatorEl.style.transitionDuration).toBe('0ms')
    expect(indicator.indicatorEl.style.transitionTimingFunction).toBe(
      'cubic-bezier(0.23, 1, 0.32, 1)'
    )
  })

  it("about scrolling's hook", () => {
    Object.assign(indicatorOptions, {
      direction: IndicatorDirection.Horizontal,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    scroll.trigger(scroll.eventTypes.scrollStart)
    expect(indicator.wrapper.style.opacity).toBe('1')
    scroll.trigger(scroll.eventTypes.scrollEnd)
    expect(indicator.wrapper.style.opacity).toBe('0')
  })

  it("about mouse-wheel scrolling's hook", () => {
    Object.assign(indicatorOptions, {
      direction: IndicatorDirection.Horizontal,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    scroll.registerType(['mousewheelStart', 'mousewheelMove', 'mousewheelEnd'])
    scroll.trigger(scroll.eventTypes.mousewheelStart)
    expect(indicator.wrapper.style.opacity).toBe('1')
    scroll.trigger(scroll.eventTypes.mousewheelEnd)
    expect(indicator.wrapper.style.opacity).toBe('0')
    scroll.trigger(scroll.eventTypes.mousewheelMove)
    expect(indicator.wrapper.style.opacity).toBe('1')
  })

  it('interactive option', () => {
    // horizontal
    addProperties(scroll.options, {
      probeType: 3,
    })
    addProperties(scroll, {
      hasHorizontalScroll: true,
      maxScrollX: 8,
    })
    Object.assign(indicatorOptions, {
      direction: IndicatorDirection.Horizontal,
      interactive: true,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    indicator.refresh()
    const beforeStartMockFn = jest.fn()
    const startMockFn = jest.fn()
    const moveMockFn = jest.fn()
    const endMockFn = jest.fn()
    const scroller = scroll.scroller
    scroller.hooks.on(
      scroller.hooks.eventTypes.beforeScrollStart,
      beforeStartMockFn
    )
    scroller.hooks.on(scroller.hooks.eventTypes.scrollStart, startMockFn)
    scroller.hooks.on(scroller.hooks.eventTypes.scroll, moveMockFn)
    scroller.hooks.on(scroller.hooks.eventTypes.scrollEnd, endMockFn)

    const eventHandlerHooks = indicator.eventHandler.hooks
    indicator.scrollInfo.maxScrollPos = 10
    eventHandlerHooks.trigger(eventHandlerHooks.eventTypes.touchStart)
    eventHandlerHooks.trigger(eventHandlerHooks.eventTypes.touchMove, 2)
    eventHandlerHooks.trigger(eventHandlerHooks.eventTypes.touchEnd)
    expect(beforeStartMockFn).toBeCalled()
    expect(startMockFn).toBeCalled()
    expect(moveMockFn).toBeCalled()
    expect(endMockFn).toBeCalled()
    expect(scroll.scroller.translater.translate).toBeCalled()

    // vertical
    addProperties(scroll.options, {
      probeType: 1,
    })
    addProperties(scroll, {
      hasHorizontalScroll: false,
      hasVerticalScroll: true,
      maxScrollX: 0,
      maxScrollY: 8,
    })
    addProperties(indicator, {
      direction: IndicatorDirection.Vertical,
    })

    eventHandlerHooks.trigger(eventHandlerHooks.eventTypes.touchStart)
    indicator.startTime = indicator.startTime - 400
    indicator.scrollInfo.maxScrollPos = 10
    eventHandlerHooks.trigger(eventHandlerHooks.eventTypes.touchMove, 2)
    eventHandlerHooks.trigger(eventHandlerHooks.eventTypes.touchEnd)

    expect(beforeStartMockFn).toBeCalledTimes(2)
    expect(startMockFn).toBeCalledTimes(2)
    expect(moveMockFn).toBeCalledTimes(2)
    expect(endMockFn).toBeCalledTimes(2)
    expect(scroll.scroller.translater.translate).toBeCalledTimes(2)
  })

  it('updatePosition', () => {
    addProperties(scroll, {
      maxScrollY: -8,
    })
    addProperties(indicatorOptions, {
      direction: IndicatorDirection.Vertical,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    indicator.refresh()
    indicator.updatePosition({
      x: 0,
      y: -2,
    })
    expect(indicator.currentPos).toBe(0)

    addProperties(scroll, {
      maxScrollY: 8,
    })
    addProperties(indicator.options, {
      isCustom: true,
    })
    indicator.refresh()
    indicator.updatePosition({
      x: 0,
      y: 2,
    })
    expect(indicator.currentPos).toBe(0)
  })

  it('click', () => {
    addProperties(scroll, {
      maxScrollY: -8,
    })
    addProperties(indicatorOptions, {
      direction: IndicatorDirection.Vertical,
      scrollbarTrackClickable: true,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    indicator.refresh()
    dispatchClick(indicator.wrapper, 'click')
    expect(scroll.scrollTo).toBeCalled()

    addProperties(indicator, {
      direction: IndicatorDirection.Horizontal,
    })
    addProperties(indicator.options, {
      scrollbarTrackClickable: true,
      scrollbarTrackOffsetType: OffsetType.Point,
    })
    dispatchClick(indicator.wrapper, 'click')
    expect(scroll.scrollTo).toBeCalled()
  })

  it('destroy', () => {
    const parentNode = document.createElement('div')
    parentNode.appendChild(wrapper)
    addProperties(indicatorOptions, {
      direction: IndicatorDirection.Vertical,
      scrollbarTrackClickable: true,
      isCustom: false,
    })
    indicator = new Indicator(scroll, indicatorOptions)
    indicator.destroy()
    expect(indicator.eventHandler.destroy).toBeCalled()
    expect(indicator.hooksFn.length).toBe(0)
  })
})
