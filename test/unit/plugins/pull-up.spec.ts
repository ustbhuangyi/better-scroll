import BScroll from '../../../src/index'
import { Options } from '../../../src/options'
import { propertiesProxy } from '../../../src/util/propertiesProxy'
jest.mock('../../../src/options')
jest.mock('../../../src/index')
jest.mock('../../../src/util/propertiesProxy')
import PullUp, { pullUpLoadOptions } from '../../../src/plugins/pull-up/pull-up'

describe('pull up tests', () => {
  let wrapper: HTMLElement
  let options: Partial<Options>
  let bscroll: BScroll
  const MAX_SCROLL_Y = -1000
  const THRESHOLD = 0
  const MOVING_DIRECTION_Y = 1

  beforeAll(() => {
    wrapper = document.createElement('div')
    options = new Options()
    bscroll = new BScroll(wrapper, options)
    bscroll.options = options as Options
    bscroll.maxScrollY = MAX_SCROLL_Y
    bscroll.movingDirectionY = MOVING_DIRECTION_Y
  })

  beforeEach(() => {
    options.pullUpLoad = undefined
    jest.resetAllMocks()
    jest.useFakeTimers()
  })

  it('should proxy properties to BScroll instance', () => {
    new PullUp(bscroll)

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
    let pullup: PullUp
      // 这里假装订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd.call(pullup, { y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )

    pullup = new PullUp(bscroll)

    jest.advanceTimersByTime(11) // 触发 scroll 事件
    expect(bscroll.trigger).not.toBeCalledWith('pullingUp')
  })

  it('should trigger event pullingUp when set pullUpLoad', () => {
    options.pullUpLoad = { threshold: THRESHOLD }

    let pullup: PullUp
      // 这里假装订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd.call(pullup, { y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )

    pullup = new PullUp(bscroll)

    jest.advanceTimersByTime(11) // 触发 scroll 事件
    expect(bscroll.trigger).toBeCalledWith('pullingUp')
  })

  it('should reset watching when invoking api close', () => {
    options.pullUpLoad = { threshold: THRESHOLD }

    let pullup: PullUp
    let timer: any
      // 这里假装订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        timer = setTimeout(() => {
          pullUpCheckToEnd.call(pullup, { y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )
    ;(<jest.Mock>bscroll.off).mockImplementationOnce(() => {
      jest.clearAllTimers()
    })
    pullup = new PullUp(bscroll)

    pullup.close()

    jest.advanceTimersByTime(11) // 触发 scroll 事件
    expect(bscroll.trigger).not.toBeCalled()
  })

  it('should set watching when invoking api open', () => {
    options.pullUpLoad = undefined
    let pullup: PullUp
      // 这里假装订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd.call(pullup, { y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )
    pullup = new PullUp(bscroll)

    const pullUpConfig: pullUpLoadOptions = { threshold: 2 }
    pullup.open(pullUpConfig)

    jest.advanceTimersByTime(11) // 触发 scroll 事件
    expect(bscroll.trigger).toBeCalledWith('pullingUp')
  })

  it('should set watching when invoking api finish after scrollEnd', () => {
    options.pullUpLoad = { threshold: THRESHOLD }
    let pullup: PullUp
      // 这里假装bscroll订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd.call(pullup, { y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )

    // 这里假装订阅 scrollEnd，20ms 后触发执行
    ;(<jest.Mock>bscroll.once).mockImplementationOnce(
      (eventName: string, resetWatching: () => void) => {
        setTimeout(resetWatching.bind(pullup), 20)
      }
    )

    pullup = new PullUp(bscroll)

    jest.advanceTimersByTime(11) // 触发 上拉
    expect(bscroll.trigger).toBeCalledWith('pullingUp')
    expect((<jest.Mock>bscroll.off).mock.calls[0][0]).toBe('scroll')

    jest.advanceTimersByTime(21) // 触发 scrollEnd, 上拉结束
    expect(pullup.watching).toBe(false)

    pullup.finish()
    expect(pullup.watching).toBe(true)
    expect((<jest.Mock>bscroll.on).mock.calls[1][0]).toBe('scroll')
  })

  it('should set watching after scrollEnd when invoking api finish before scrollEnd', () => {
    options.pullUpLoad = { threshold: THRESHOLD }
    let pullup: PullUp
      // 这里假装bscroll订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd.call(pullup, { y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )

    // 这里假装订阅 scrollEnd，20ms 后触发执行
    ;(<jest.Mock>bscroll.once)
      .mockImplementationOnce(
        (eventScrollEnd: string, resetWatching: () => void) => {
          setTimeout(resetWatching.bind(pullup), 20)
        }
      )
      .mockImplementationOnce((eventName: string, setWatching: () => void) => {
        setTimeout(setWatching.bind(pullup), 20)
      })

    pullup = new PullUp(bscroll)

    jest.advanceTimersByTime(11) // 触发 上拉
    expect(bscroll.trigger).toBeCalledWith('pullingUp')

    expect(pullup.watching).toBe(true)
    pullup.finish()

    jest.advanceTimersByTime(20) // 触发 scrollEnd, 上拉结束
  })
})
