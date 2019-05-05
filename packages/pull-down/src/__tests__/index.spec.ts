import BScroll from '@/index'
import { propertiesProxy } from '@/util/propertiesProxy'
import { ease } from '@/util/ease'
jest.mock('@/index')
jest.mock('@/util/propertiesProxy')
jest.mock('@/util/ease')

import PullDown from '@/plugins/pull-down/pull-down'

describe('pull down tests', () => {
  let bscroll: BScroll
  const THRESHOLD = 90
  const STOP = 50
  const DIRECTION_Y = -1
  let pullDownHandler = jest.fn()

  beforeAll(() => {
    // create DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    bscroll = new BScroll(wrapper, {})
    bscroll.directionY = DIRECTION_Y
  })

  afterEach(() => {
    bscroll.off()
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    new PullDown(bscroll)

    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullDownRefresh.finish',
      'finishPullDown'
    )
    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullDownRefresh.open',
      'openPullDown'
    )
    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullDownRefresh.close',
      'closePullDown'
    )
    expect(propertiesProxy).toBeCalledWith(
      bscroll,
      'plugins.pullDownRefresh.autoPull',
      'autoPullDownRefresh'
    )
  })

  describe('trigger pullingDown event', () => {
    beforeEach(() => {
      // given
      bscroll.x = 0
      bscroll.options.pullDownRefresh = {
        threshold: THRESHOLD,
        stop: STOP
      }
      new PullDown(bscroll)
      bscroll.on('pullingDown', pullDownHandler)
    })

    it('should not trigger pullingDown event when no pullDownRefresh', () => {
      bscroll.options.pullDownRefresh = undefined
      // when
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      // then
      expect(pullDownHandler).toBeCalledTimes(0)
    })

    it('should trigger pullingDown event', () => {
      // when
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      // then
      expect(pullDownHandler).toBeCalledTimes(1)
    })

    it('should trigger pullingDown once', () => {
      // when
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      bscroll.trigger('touchEnd')
      // then
      expect(pullDownHandler).toBeCalledTimes(1)
    })

    it('should stop at correct position', () => {
      // when
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      // then
      expect(bscroll.scrollTo).toHaveBeenCalledWith(
        0,
        50,
        bscroll.options.bounceTime,
        ease.bounce
      )
    })
  })

  describe('api finish', () => {
    let pullDown: PullDown
    beforeEach(() => {
      // given
      bscroll.x = 0
      bscroll.options.pullDownRefresh = {
        threshold: THRESHOLD,
        stop: STOP
      }
      pullDown = new PullDown(bscroll)
      bscroll.on('pullingDown', pullDownHandler)
    })

    it('should restore to trigger pullingDown', () => {
      // when
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      pullDown.finish()
      bscroll.trigger('touchEnd')
      // then
      expect(pullDownHandler).toBeCalledTimes(2)
    })

    it('should resetPosition', () => {
      // when
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      pullDown.finish()
      // then
      expect(bscroll.resetPosition).toBeCalledTimes(1)
    })
  })

  describe('api close', () => {
    let pullDown: PullDown
    beforeEach(() => {
      // given
      bscroll.x = 0
      bscroll.options.pullDownRefresh = {
        threshold: THRESHOLD,
        stop: STOP
      }
      pullDown = new PullDown(bscroll)
      bscroll.on('pullingDown', pullDownHandler)
    })

    it('should close feature pullDown', () => {
      // when
      pullDown.close()
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      // then
      expect(pullDownHandler).toBeCalledTimes(0)
    })
  })

  describe('api open', () => {
    let pullDown: PullDown
    beforeEach(() => {
      // given
      bscroll.x = 0
      bscroll.options.pullDownRefresh = undefined
      pullDown = new PullDown(bscroll)
      bscroll.on('pullingDown', pullDownHandler)
    })

    it('should open feature pullDown', () => {
      // when
      pullDown.open({ threshold: THRESHOLD, stop: STOP })
      bscroll.y = THRESHOLD + 1
      bscroll.trigger('touchEnd')
      // then
      expect(pullDownHandler).toBeCalledTimes(1)
    })
  })

  describe('api autoPull', () => {
    let pullDown: PullDown
    beforeEach(() => {
      // given
      bscroll.x = 0
      bscroll.options.pullDownRefresh = { threshold: THRESHOLD, stop: STOP }
      pullDown = new PullDown(bscroll)
      bscroll.on('pullingDown', pullDownHandler)
    })

    it('should auto trigger pullingDown', () => {
      // when
      pullDown.autoPull()
      // then
      expect(pullDownHandler).toBeCalledTimes(1)
    })

    it('should scrollTo correct position', () => {
      // when
      pullDown.autoPull()
      // then
      expect(pullDownHandler).toBeCalledTimes(1)
    })
  })
})
