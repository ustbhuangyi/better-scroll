import BScroll from '@better-scroll/core'
import { Probe } from '@better-scroll/shared-utils'
import { ease } from '@better-scroll/shared-utils/src/ease'
jest.mock('@better-scroll/core')

import PullDown from '../index'

const createPullDownElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)
  return { wrapper }
}

describe('pull down tests', () => {
  let scroll: BScroll
  let pullDown: PullDown
  beforeEach(() => {
    // create DOM
    const { wrapper } = createPullDownElements()
    scroll = new BScroll(wrapper, {})
    pullDown = new PullDown(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    new PullDown(scroll)

    expect(scroll.proxy).toBeCalledWith([
      {
        key: 'finishPullDown',
        sourceKey: 'plugins.pullDownRefresh.finishPullDown',
      },
      {
        key: 'openPullDown',
        sourceKey: 'plugins.pullDownRefresh.openPullDown',
      },
      {
        key: 'closePullDown',
        sourceKey: 'plugins.pullDownRefresh.closePullDown',
      },
      {
        key: 'autoPullDownRefresh',
        sourceKey: 'plugins.pullDownRefresh.autoPullDownRefresh',
      },
    ])
  })

  it('should handle default options and user options', () => {
    // case 1
    scroll.options.pullDownRefresh = true
    pullDown = new PullDown(scroll)

    expect(pullDown.options).toMatchObject({
      threshold: 90,
      stop: 40,
    })

    // case 2
    scroll.options.pullDownRefresh = {
      threshold: 100,
      stop: 50,
    }
    pullDown = new PullDown(scroll)

    expect(pullDown.options).toMatchObject({
      threshold: 100,
      stop: 50,
    })

    expect(scroll.options.probeType).toBe(Probe.Realtime)
  })

  it('should cache originalMinScrollY', () => {
    expect(pullDown.cachedOriginanMinScrollY).toBe(0)
    expect(pullDown.currentMinScrollY).toBe(0)
  })

  it('should modify minScrollY when necessary', () => {
    pullDown.currentMinScrollY = 50
    const scrollBehaviorY = scroll.scroller.scrollBehaviorY
    let boundary = {
      minScrollPos: 0,
      maxScrollPos: 20,
    }
    scrollBehaviorY.hooks.trigger(
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      boundary
    )
    expect(boundary).toMatchObject({
      minScrollPos: 50,
      maxScrollPos: -1,
    })
  })

  it('should checkPullDown', () => {
    const mockFn = jest.fn()
    scroll.on(scroll.eventTypes.pullingDown, mockFn)

    // simulate pullUp action
    scroll.y = -100
    scroll.directionY = 1
    scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.end)
    expect(mockFn).toHaveBeenCalledTimes(0)

    // simulate pullDown action
    scroll.y = 100
    scroll.directionY = -1

    scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.end)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should trigger pullingDown once', () => {
    const mockFn = jest.fn()
    scroll.on(scroll.eventTypes.pullingDown, mockFn)
    // when
    scroll.directionY = -1
    scroll.y = 100
    scroll.scroller.hooks.trigger('end')
    scroll.scroller.hooks.trigger('end')
    // then
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should stop at correct position', () => {
    // when
    scroll.directionY = -1
    scroll.y = 100
    scroll.scroller.hooks.trigger('end')
    expect(scroll.scrollTo).toHaveBeenCalledWith(
      0,
      40,
      scroll.options.bounceTime,
      ease.bounce
    )
  })

  it('should work well when call finishPullDown()', () => {
    pullDown.finishPullDown()

    expect(pullDown.pulling).toBe(false)
    expect(scroll.scroller.scrollBehaviorY.computeBoundary).toBeCalled()
    expect(scroll.resetPosition).toBeCalled()
  })

  it('should work well when call closePullDown()', () => {
    pullDown.closePullDown()

    expect(pullDown.watching).toBe(false)
    expect(scroll.scroller.hooks.events.end.length).toBe(0)
  })

  it('should work well when call openPullDown()', () => {
    pullDown.closePullDown()

    expect(pullDown.watching).toBe(false)
    expect(pullDown.options).toMatchObject({
      threshold: 90,
      stop: 40,
    })

    // modify options
    pullDown.openPullDown({
      threshold: 200,
      stop: 80,
    })

    expect(pullDown.options).toMatchObject({
      threshold: 200,
      stop: 80,
    })
    expect(pullDown.watching).toBe(true)
  })

  it('should work well when call autoPullDownRefresh()', () => {
    const mockFn = jest.fn()
    scroll.on(scroll.eventTypes.pullingDown, mockFn)
    pullDown.autoPullDownRefresh()
    expect(pullDown.watching).toBe(true)
    expect(pullDown.currentMinScrollY).toBe(40)
    expect(scroll.scroller.scrollBehaviorY.computeBoundary).toBeCalled()
    expect(scroll.scrollTo).toHaveBeenCalledTimes(2)
    expect(scroll.scrollTo).toHaveBeenLastCalledWith(
      0,
      40,
      scroll.options.bounceTime,
      ease.bounce
    )
  })
})
