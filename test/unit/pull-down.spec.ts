import BScroll from '../../src/index'
import PullDown from '../../src/plugins/pull-down/pull-down'
import Scroller from '../../src/scroller/Scroller'
import { Options } from '../../src/options'
import { propertiesProxy } from '../../src/util/propertiesProxy'
jest.mock('../../src/options')
jest.mock('../../src/index')
jest.mock('../../src/scroller/Scroller')
jest.mock('../../src/util/propertiesProxy')

describe('pull down tests', () => {
  let wrapper: HTMLElement
  let options: Options
  let bscroll: BScroll
  const THRESHOLD = 90
  const STOP = 50
  const DIRECTION_Y = -1

  beforeAll(() => {
    wrapper = document.createElement('div')
    options = new Options()
    options.pullDownRefresh = {
      threshold: THRESHOLD,
      stop: STOP
    }
    bscroll = new BScroll(wrapper, options)
    bscroll.options = options
    bscroll.directionY = DIRECTION_Y
    bscroll.scrollTo = jest.fn()
    bscroll.resetPosition = jest.fn()

    jest.useFakeTimers()
  })

  beforeEach(() => {
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

  it('should trigger pullingDown event', () => {
    bscroll.y = THRESHOLD + 1
    bscroll.x = 0
    // 这里假装订阅 end，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, checkPullDown: () => void) => {
        setTimeout(() => {
          checkPullDown() // 触发下拉
        }, 10)
      }
    )

    new PullDown(bscroll)

    expect(bscroll.trigger).not.toBeCalledWith('pullingDown')
    jest.advanceTimersByTime(11)
    expect(bscroll.trigger).toBeCalledWith('pullingDown')
    expect(bscroll.scrollTo.mock.calls[0].slice(0, 2)).toEqual([0, STOP])
  })

  it('should finish pulling when invoking api finish', () => {
    bscroll.y = THRESHOLD + 1
    // 这里假装订阅 end，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, checkPullDown: () => void) => {
        setTimeout(() => {
          checkPullDown() // 触发下拉
        }, 10)
      }
    )

    const pullDown = new PullDown(bscroll)
    expect(pullDown.pulling).toBe(false)
    expect(bscroll.trigger).not.toBeCalledWith('pullingDown')

    jest.advanceTimersByTime(11)
    expect(pullDown.pulling).toBe(true)
    expect(bscroll.trigger).toBeCalledWith('pullingDown')
    expect(bscroll.scrollTo.mock.calls[0].slice(0, 2)).toEqual([0, STOP])

    pullDown.finish()
    expect(pullDown.pulling).toBe(false)
    expect(bscroll.resetPosition).toBeCalled()
  })

  it('should trigger event pullingDown once before invoking api finish', () => {
    bscroll.y = THRESHOLD + 1
    // 这里假装订阅 end，分别在 10ms 和 20ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, checkPullDown: () => void) => {
        setTimeout(() => {
          checkPullDown() // 触发下拉
        }, 10)

        setTimeout(() => {
          checkPullDown() // 触发下拉
        }, 20)
      }
    )

    const pullDown = new PullDown(bscroll)
    expect(pullDown.pulling).toBe(false)
    expect(bscroll.trigger).not.toBeCalledWith('pullingDown')

    jest.advanceTimersByTime(11) // 第一次触发下拉
    expect(pullDown.pulling).toBe(true)
    expect(bscroll.trigger).toBeCalledWith('pullingDown')
    expect(bscroll.scrollTo.mock.calls[0].slice(0, 2)).toEqual([0, STOP])

    jest.advanceTimersByTime(10) // 第二次触发下拉
    expect(pullDown.pulling).toBe(true)
    expect(bscroll.trigger).toBeCalledTimes(1)

    pullDown.finish()
    expect(pullDown.pulling).toBe(false)
    expect(bscroll.resetPosition).toBeCalled()
  })

  it('should close feature pullDown when invoking api close', () => {
    bscroll.y = THRESHOLD + 1
    // 这里假装订阅 end，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, checkPullDown: () => void) => {
        setTimeout(() => {
          checkPullDown() // 触发下拉
        }, 10)
      }
    )

    const pullDown = new PullDown(bscroll)
    pullDown.close()

    jest.advanceTimersByTime(11)
    expect(pullDown.pulling).toBe(false)
    expect(bscroll.trigger).not.toBeCalledWith('pullingDown')
  })

  it('should open feature pullDown when invoking api open', () => {
    bscroll.y = THRESHOLD + 1
    const pullDownOption = {
        threshold: THRESHOLD,
        stop: STOP
      }
      // 这里假装订阅 end，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, checkPullDown: () => void) => {
        setTimeout(() => {
          checkPullDown() // 触发下拉
        }, 10)
      }
    )

    const pullDown = new PullDown(bscroll)
    pullDown.close()

    pullDown.open(pullDownOption)

    expect(pullDown.pulling).toBe(false)
    jest.advanceTimersByTime(11)
    expect(pullDown.pulling).toBe(true)
    expect(bscroll.trigger).toBeCalledWith('pullingDown')
    expect(bscroll.scrollTo.mock.calls[0].slice(0, 2)).toEqual([0, STOP])
  })

  it('should auto trigger pullingDown when invoking api autoPull', () => {
    const pullDown = new PullDown(bscroll)
    expect(pullDown.pulling).toBe(false)

    pullDown.autoPull()
    expect(pullDown.pulling).toBe(true)
    expect(bscroll.trigger).toBeCalledWith('pullingDown')
    expect(bscroll.scrollTo.mock.calls[0].slice(0, 2)).toEqual([0, THRESHOLD])
    expect(bscroll.scrollTo.mock.calls[1].slice(0, 2)).toEqual([0, STOP])
  })
})
