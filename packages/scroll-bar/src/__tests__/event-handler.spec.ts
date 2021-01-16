import Indicator, { IndicatorDirection, OffsetType } from '../indicator'
import BScroll from '@better-scroll/core'
import EventHandler from '../event-handler'
import {
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd,
} from '@better-scroll/core/src/__tests__/__utils__/event'

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
  let EventHandlerOptions = {
    disableMouse: false,
    disableTouch: false,
  }

  beforeEach(() => {
    // create Dom
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    scroll = new BScroll(wrapper, {})
    indicator = new Indicator(scroll, indicatorOptions)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('touchStart | touchMove | touchEnd hooks', () => {
    const eventHandler = new EventHandler(indicator, EventHandlerOptions)
    expect(Object.keys(eventHandler.hooks.eventTypes)).toMatchObject([
      'touchStart',
      'touchMove',
      'touchEnd',
    ])

    const touchStartMockFn = jest.fn()
    const touchMoveMockFn = jest.fn()
    const touchEndMockFn = jest.fn()
    const eventHandlerHooks = eventHandler.hooks
    eventHandlerHooks.on(
      eventHandlerHooks.eventTypes.touchStart,
      touchStartMockFn
    )
    eventHandlerHooks.on(
      eventHandlerHooks.eventTypes.touchMove,
      touchMoveMockFn
    )
    eventHandlerHooks.on(eventHandlerHooks.eventTypes.touchEnd, touchEndMockFn)

    // scroll is disabled
    addProperties(scroll, {
      enabled: false,
    })
    dispatchTouchStart(indicatorEl, [
      {
        pageX: 0,
        pageY: 0,
      },
    ])
    dispatchTouchMove(window, [
      {
        pageX: 10,
        pageY: 10,
      },
    ])
    dispatchTouchEnd(window, [
      {
        pageX: 20,
        pageY: 20,
      },
    ])
    expect(touchStartMockFn).not.toBeCalled()
    expect(touchMoveMockFn).not.toBeCalled()
    expect(touchEndMockFn).not.toBeCalled()

    // scroll is enabled
    addProperties(scroll, {
      enabled: true,
    })
    dispatchTouchStart(indicatorEl, [
      {
        pageX: 0,
        pageY: 0,
      },
    ])
    dispatchTouchMove(window, [
      {
        pageX: 10,
        pageY: 10,
      },
    ])
    dispatchTouchEnd(window, [
      {
        pageX: 20,
        pageY: 20,
      },
    ])
    expect(touchStartMockFn).toBeCalled()
    expect(touchMoveMockFn).toBeCalled()
    expect(touchEndMockFn).toBeCalled()
  })

  it('destroy', () => {
    const eventHandler = new EventHandler(indicator, EventHandlerOptions)
    eventHandler.destroy()
  })
})
