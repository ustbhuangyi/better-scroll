import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')

import PullUp, { pullUpLoadOptions } from '@better-scroll/pull-up'

describe('pull up tests', () => {
  let bscroll: BScroll
  const MAX_SCROLL_Y = -1000
  const THRESHOLD = 0
  const MOVING_DIRECTION_Y = 1
  let pullup: PullUp
  const pullingUpHandler = jest.fn()

  beforeAll(() => {
    // create DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    bscroll = new BScroll(wrapper, {})
    bscroll.maxScrollY = MAX_SCROLL_Y
    bscroll.movingDirectionY = MOVING_DIRECTION_Y
  })

  afterEach(() => {
    bscroll.off()
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    // given when
    pullup = new PullUp(bscroll)
    // then
    expect(bscroll.proxy).toBeCalledWith([
      {
        key: 'finishPullUp',
        sourceKey: 'plugins.pullUpLoad.finish'
      },
      {
        key: 'openPullUp',
        sourceKey: 'plugins.pullUpLoad.open'
      },
      {
        key: 'closePullUp',
        sourceKey: 'plugins.pullUpLoad.close'
      }
    ])
  })

  describe('trigger pullingUp', () => {
    beforeEach(() => {
      // given
      bscroll.options.pullUpLoad = { threshold: THRESHOLD }
      pullup = new PullUp(bscroll)
      bscroll.on('pullingUp', pullingUpHandler)
    })

    it('should not trigger event pullingUp when not set pullUpLoad', () => {
      // given
      bscroll.options.pullUpLoad = false
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toHaveBeenCalledTimes(0)
    })

    it('should trigger event pullingUp when set pullUpLoad', () => {
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toHaveBeenCalledTimes(1)
    })

    it('should trigger event pullingUp once', () => {
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toBeCalledTimes(1)
    })
  })

  describe('api close', () => {
    beforeEach(() => {
      // given
      bscroll.options.pullUpLoad = { threshold: THRESHOLD }
      pullup = new PullUp(bscroll)
      bscroll.on('pullingUp', pullingUpHandler)
    })

    it('should not trigger pullingUp when invoking api close', () => {
      // when
      pullup.close()
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toBeCalledTimes(0)
    })
  })

  describe('api open', () => {
    beforeEach(() => {
      // given
      bscroll.options.pullUpLoad = { threshold: THRESHOLD }
      pullup = new PullUp(bscroll)
      bscroll.on('pullingUp', pullingUpHandler)
    })

    it('should trigger pullingUp when invoking api open', () => {
      // when
      pullup.open({ threshold: THRESHOLD })
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toBeCalledTimes(1)
    })
  })

  describe('finish api', () => {
    beforeEach(() => {
      // given
      bscroll.options.pullUpLoad = { threshold: THRESHOLD }
      pullup = new PullUp(bscroll)
      bscroll.on('pullingUp', pullingUpHandler)
    })

    it('should trigger pullingUp once when invoking api finish before scrollEnd', () => {
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      pullup.finish()
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toBeCalledTimes(1)
    })

    it('should trigger pullingUp twice when invoking api finish after scrollEnd', () => {
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      bscroll.trigger('scrollEnd')
      pullup.finish()
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(pullingUpHandler).toBeCalledTimes(2)
    })
  })
})
