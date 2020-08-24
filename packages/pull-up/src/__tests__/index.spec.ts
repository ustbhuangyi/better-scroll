import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')

import PullUp from '@better-scroll/pull-up'
import { Probe } from '@better-scroll/shared-utils'

const createPullUpElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)
  return { wrapper }
}

describe('pullUp plugins', () => {
  let scroll: BScroll
  let pullUp: PullUp

  beforeEach(() => {
    // create DOM
    const { wrapper } = createPullUpElements()
    scroll = new BScroll(wrapper, {})
    pullUp = new PullUp(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should proxy properties to scroll instance', () => {
    expect(scroll.proxy).toBeCalledWith([
      {
        key: 'finishPullUp',
        sourceKey: 'plugins.pullUpLoad.finishPullUp',
      },
      {
        key: 'openPullUp',
        sourceKey: 'plugins.pullUpLoad.openPullUp',
      },
      {
        key: 'closePullUp',
        sourceKey: 'plugins.pullUpLoad.closePullUp',
      },
      {
        key: 'autoPullUpLoad',
        sourceKey: 'plugins.pullUpLoad.autoPullUpLoad',
      },
    ])
  })

  it('should handle default options and user options', () => {
    // case 1
    scroll.options.pullUpLoad = true
    pullUp = new PullUp(scroll)

    expect(pullUp.options).toMatchObject({
      threshold: 0,
    })

    // case 2
    scroll.options.pullUpLoad = {
      threshold: 40,
    }
    pullUp = new PullUp(scroll)

    expect(pullUp.options).toMatchObject({
      threshold: 40,
    })

    // case 3
    scroll.options.pullUpLoad = {
      threshold: -40,
    }
    pullUp = new PullUp(scroll)

    expect(pullUp.options).toMatchObject({
      threshold: -40,
    })

    expect(scroll.options.probeType).toBe(Probe.Realtime)
  })

  it('should modify maxScrollY when content is full of wrapper', () => {
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
      minScrollPos: 0,
      maxScrollPos: -1,
    })
  })

  it('should checkPullUp', () => {
    const mockFn = jest.fn()
    scroll.on(scroll.eventTypes.pullingUp, mockFn)

    const pos1 = {
      x: 0,
      y: 100,
    }
    // simulate pullDown action
    scroll.movingDirectionY = -1

    scroll.trigger(scroll.eventTypes.scroll, pos1)
    expect(mockFn).toHaveBeenCalledTimes(0)

    // simulate pullUp action
    const pos2 = {
      x: 0,
      y: -100,
    }
    scroll.movingDirectionY = 1
    scroll.trigger(scroll.eventTypes.scroll, pos2)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should trigger pullingUp once', () => {
    const mockFn = jest.fn()
    const pos = {
      x: 0,
      y: -100,
    }
    scroll.on(scroll.eventTypes.pullingUp, mockFn)
    // when
    scroll.movingDirectionY = 1
    scroll.trigger(scroll.eventTypes.scroll, pos)
    scroll.trigger(scroll.eventTypes.scroll, pos)
    // then
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should work well when call finishPullUp()', () => {
    // simulate pullUp action
    const pos = {
      x: 0,
      y: -100,
    }
    scroll.movingDirectionY = 1
    scroll.trigger(scroll.eventTypes.scroll, pos)

    pullUp.finishPullUp()

    expect(scroll.scroller.scrollBehaviorY.setMovingDirection).toBeCalledWith(0)
    expect(scroll.events.scrollEnd.length).toBe(2)
    expect(pullUp.watching).toBe(false)
  })

  it('should work well when call closePullUp()', () => {
    pullUp.closePullUp()

    expect(pullUp.watching).toBe(false)
    expect(scroll.events.scroll.length).toBe(0)
  })

  it('should work well when call openPullUp()', () => {
    pullUp.closePullUp()

    expect(pullUp.watching).toBe(false)
    expect(pullUp.options).toMatchObject({
      threshold: 0,
    })

    // modify options
    pullUp.openPullUp({
      threshold: 200,
    })

    expect(pullUp.options).toMatchObject({
      threshold: 200,
    })
    expect(pullUp.watching).toBe(true)
  })

  it('should reset pulling when scrollEnd triggered', () => {
    // simulate pullUp action
    const pos = {
      x: 0,
      y: -100,
    }
    scroll.movingDirectionY = 1
    scroll.trigger(scroll.eventTypes.scroll, pos)

    expect(pullUp.pulling).toBe(true)

    scroll.trigger(scroll.eventTypes.scrollEnd)

    expect(pullUp.pulling).toBe(false)
  })

  it('should call watch() in scrollEnd hooks when pullingUp', () => {
    const pullUpMockFn = jest.fn()
    // simulate pullUp action
    const pos = {
      x: 0,
      y: -100,
    }
    scroll.on(scroll.eventTypes.pullingUp, pullUpMockFn)
    scroll.movingDirectionY = 1
    scroll.trigger(scroll.eventTypes.scroll, pos)

    expect(pullUpMockFn).toBeCalledTimes(1)
    expect(pullUp.pulling).toBe(true)

    pullUp.finishPullUp()
    // because pulling is true, won't trigger pullingUp
    scroll.trigger(scroll.eventTypes.scroll, pos)
    expect(pullUpMockFn).toBeCalledTimes(1)
    expect(pullUp.watching).toBe(false)

    // register another watch in scrollEnd
    scroll.trigger(scroll.eventTypes.scrollEnd)

    scroll.movingDirectionY = 1
    scroll.trigger(scroll.eventTypes.scroll, pos)
    expect(pullUpMockFn).toBeCalledTimes(2)
  })

  it('should work well when call autoPullUpLoad()', () => {
    pullUp.autoPullUpLoad()

    const outOfBoundaryPos = -1
    expect(scroll.scroller.scrollBehaviorY.setMovingDirection).toBeCalledWith(
      -1
    )
    expect(scroll.scrollTo).toBeCalledWith(0, outOfBoundaryPos, 800)
  })
})
