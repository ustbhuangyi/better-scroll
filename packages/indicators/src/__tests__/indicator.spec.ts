import Indicator from '../indicator'
import BScroll from '@better-scroll/core'
import { IndicatorOptions } from '../types'
import {
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd,
} from '@better-scroll/core/src/__tests__/__utils__/event'

jest.mock('@better-scroll/core')

const addProperties = <T extends Object, K extends Object>(
  target: T,
  source: K
) => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target
}

const createIndicatorElement = () => {
  // indicators DOM
  const indicatorWrapper = document.createElement('div')
  const indicatorEl = document.createElement('div')
  indicatorWrapper.appendChild(indicatorEl)
  return {
    indicatorWrapper,
  }
}

describe('Indicator unit tests', () => {
  let scroll: BScroll
  let indicatorOption: IndicatorOptions

  beforeEach(() => {
    // BScroll DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)

    scroll = new BScroll(wrapper, {})

    indicatorOption = {
      relationElement: createIndicatorElement().indicatorWrapper,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('refresh hook', () => {
    const indicator = new Indicator(scroll, indicatorOption)
    addProperties(scroll, {
      hasVerticalScroll: true,
      hasHorizontalScroll: true,
      maxScrollX: -1,
      maxScrollY: -1,
    })
    addProperties(indicatorOption, {
      ratio: {
        x: 1,
        y: 1,
      },
    })
    scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
    expect(indicator.currentPos).toMatchObject({
      x: 0,
      y: 0,
    })
    expect(indicator.indicatorEl.style.transform).toBe(
      'translateX(0px) translateY(0px)  translateZ(0)'
    )
  })

  it('translater hook', () => {
    const indicator = new Indicator(scroll, indicatorOption)
    addProperties(indicator, {
      ratioY: 2,
      translateYSign: 1,
    })
    const translaterHooks = scroll.scroller.translater.hooks
    translaterHooks.trigger(translaterHooks.eventTypes.translate, {
      x: 0,
      y: -20,
    })
    expect(indicator.currentPos).toMatchObject({
      x: 0,
      y: -40,
    })
  })

  it('animater hook', () => {
    const indicator = new Indicator(scroll, indicatorOption)
    const animaterHooks = scroll.scroller.animater.hooks
    animaterHooks.trigger(
      animaterHooks.eventTypes.timeFunction,
      'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    )
    animaterHooks.trigger(animaterHooks.eventTypes.time, 200)
    const style = indicator.indicatorEl.style as any
    expect(style['transition-timing-function']).toBe(
      'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    )
    expect(style['transition-duration']).toBe('200ms')
  })

  it('touch hooks', async () => {
    addProperties(scroll.options, {
      probeType: 3,
      disableMouse: false,
    })
    addProperties(scroll, {
      hasHorizontalScroll: true,
    })
    const indicator = new Indicator(scroll, indicatorOption)
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

    // scroll is disabled
    scroll.enabled = false
    dispatchTouchStart(indicatorOption.relationElement.children[0], [
      {
        pageX: 0,
        pageY: -20,
      },
    ])
    expect(beforeStartMockFn).not.toBeCalled()

    // scroll is enabled
    scroll.enabled = true
    dispatchTouchStart(indicatorOption.relationElement.children[0], [
      {
        pageX: 0,
        pageY: -20,
      },
    ])
    dispatchTouchMove(window, [
      {
        pageX: 0,
        pageY: -40,
      },
    ])

    dispatchTouchEnd(window, [])

    expect(beforeStartMockFn).toBeCalled()
    expect(startMockFn).toBeCalled()
    expect(moveMockFn).toBeCalled()
    expect(endMockFn).toBeCalled()

    // dispatch scroll in interval time
    addProperties(scroll.options, {
      probeType: 1,
    })
    const moveMockFn2 = jest.fn()
    scroller.hooks.on(scroller.hooks.eventTypes.scroll, moveMockFn2)
    dispatchTouchStart(indicatorOption.relationElement.children[0], [
      {
        pageX: 0,
        pageY: -20,
      },
    ])
    await new Promise((resolve) => {
      setTimeout(resolve, 400)
    })
    dispatchTouchMove(window, [
      {
        pageX: 0,
        pageY: -40,
      },
    ])
    expect(moveMockFn2).toBeCalled()
  })

  it('destroy', () => {
    addProperties(indicatorOption, {
      ratio: 1,
    })
    const indicator = new Indicator(scroll, indicatorOption)
    scroll.hooks.trigger(scroll.hooks.eventTypes.refresh)
    indicator.destroy()
    expect(indicator.hooksFn.length).toBe(0)
  })
})
