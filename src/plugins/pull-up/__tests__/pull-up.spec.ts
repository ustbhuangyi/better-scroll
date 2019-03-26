import BScroll from '@/index'
import { Options } from '@/options'
import { propertiesProxy } from '@/util/propertiesProxy'
jest.mock('@/options')
jest.mock('@/index')
jest.mock('@/util/propertiesProxy')

import PullUp, { pullUpLoadOptions } from '../pull-up'

describe('pull up tests', () => {
  let bscroll: BScroll
  const MAX_SCROLL_Y = -1000
  const THRESHOLD = 0
  const MOVING_DIRECTION_Y = 1
  let pullup
  let hasTriggerTimes = 0

  function hasTriggerTimesIncreaceOne() {
    hasTriggerTimes++
  }

  beforeAll(() => {
    let options: Options
    // create DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // instanciate mocked bscroll
    options = new Options()
    bscroll = new BScroll(wrapper, options)
    bscroll.options = options as Options
    bscroll.maxScrollY = MAX_SCROLL_Y
    bscroll.movingDirectionY = MOVING_DIRECTION_Y
  })

  beforeEach(() => {
    bscroll.options.pullUpLoad = undefined
  })

  afterEach(() => {
    bscroll.off()
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    // given when
    pullup = new PullUp(bscroll)
    // then
    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullUpLoad.finish',
      'finishPullUp'
    )
    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullUpLoad.open',
      'openPullUp'
    )
    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullUpLoad.close',
      'closePullUp'
    )
  })

  it('should not trigger event pullingUp when not set pullUpLoad', () => {
    // given
    pullup = new PullUp(bscroll)
    bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
    hasTriggerTimes = 0
    // when
    bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
    // then
    expect(hasTriggerTimes).toBe(0)
  })

  it('should trigger event pullingUp when set pullUpLoad', () => {
    // given
    bscroll.options.pullUpLoad = { threshold: THRESHOLD }
    pullup = new PullUp(bscroll)
    bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
    hasTriggerTimes = 0
    // when
    bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
    // then
    expect(hasTriggerTimes).toBe(1)
  })

  it('should trigger event pullingUp once', () => {
    // given
    bscroll.options.pullUpLoad = { threshold: THRESHOLD }
    pullup = new PullUp(bscroll)
    bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
    hasTriggerTimes = 0
    // when
    bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
    bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
    // then
    expect(hasTriggerTimes).toBe(1)
  })

  it('should reset watching when invoking api close', () => {
    // given
    bscroll.options.pullUpLoad = { threshold: THRESHOLD }
    pullup = new PullUp(bscroll)
    bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
    hasTriggerTimes = 0
    // when
    pullup.close()
    bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
    // then
    expect(hasTriggerTimes).toBe(0)
  })

  it('should set watching when invoking api open', () => {
    // given
    bscroll.options.pullUpLoad = { threshold: THRESHOLD }
    pullup = new PullUp(bscroll)
    bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
    hasTriggerTimes = 0
    // when
    const pullUpConfig: pullUpLoadOptions = { threshold: THRESHOLD }
    pullup.open(pullUpConfig)
    bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
    // then
    expect(hasTriggerTimes).toBe(1)
  })

  describe('finish api', () => {
    it('should trigger pullingUp once when invoking api finish before scrollEnd', () => {
      // given
      bscroll.options.pullUpLoad = { threshold: THRESHOLD }
      pullup = new PullUp(bscroll)
      bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
      hasTriggerTimes = 0
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      pullup.finish()
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(hasTriggerTimes).toBe(1)
    })

    it('should trigger pullingUp twice when invoking api finish after scrollEnd', () => {
      // given
      bscroll.options.pullUpLoad = { threshold: THRESHOLD }
      pullup = new PullUp(bscroll)
      bscroll.on('pullingUp', hasTriggerTimesIncreaceOne)
      hasTriggerTimes = 0
      // when
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      bscroll.trigger('scrollEnd')
      pullup.finish()
      bscroll.trigger('scroll', { y: MAX_SCROLL_Y + THRESHOLD - 1 })
      // then
      expect(hasTriggerTimes).toBe(2)
    })
  })
})
