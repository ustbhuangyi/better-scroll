import BScroll from '../../src/index'
import PullUp from '../../src/plugins/pull-up/pull-up'
import Options, { pullUpLoadOptions } from '../../src/options'
jest.mock('../../src/options')
jest.mock('../../src/index')

describe('pull up tests', () => {
  let wrapper: HTMLElement
  let options: Options
  let bscroll: BScroll
  const MAX_SCROLL_Y = -1000
  const THRESHOLD = 0

  beforeAll(() => {
    wrapper = document.createElement('div')
    options = new Options()
    options.pullUpLoad = {
      threshold: THRESHOLD
    }
    bscroll = new BScroll(wrapper, options)
    bscroll.options = options
    bscroll.maxScrollY = MAX_SCROLL_Y

    jest.useFakeTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set watching when calling the PullUp constructor', () => {
    const pullup = new PullUp(bscroll)

    expect(pullup.watching).toBe(true)
    expect(bscroll.options.probeType).toBe(3)
    expect((<jest.Mock>bscroll.on).mock.calls[0][0]).toBe('scroll')
  })

  it('should trigger event pullingUp when pulling up', () => {
    let pullup: PullUp
    bscroll.movingDirectionY = -1
    // 这里假装订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd({ y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
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

    jest.advanceTimersByTime(11) // 触发 scroll 事件
    expect(bscroll.trigger).toBeCalledWith('pullingUp')
    expect((<jest.Mock>bscroll.off).mock.calls[0][0]).toBe('scroll')

    jest.advanceTimersByTime(20)
    expect(pullup.watching).toBe(false)
  })

  it('should reset watching when invoking api close', () => {
    const pullup = new PullUp(bscroll)
    expect(pullup.watching).toBe(true)

    pullup.close()

    expect(pullup.watching).toBe(false)
    expect(bscroll.options.pullUpLoad).toBe(false)
    expect((<jest.Mock>bscroll.off).mock.calls[0][0]).toBe('scroll')
  })

  it('should set watching when invoking api open', () => {
    const pullup = new PullUp(bscroll)

    const pullUpConfig: pullUpLoadOptions = { threshold: 2 }
    pullup.open(pullUpConfig)

    expect(pullup.watching).toBe(true)
    expect(bscroll.options.pullUpLoad).toBe(pullUpConfig)
    expect((<jest.Mock>bscroll.on).mock.calls[1][0]).toBe('scroll')
  })

  it('should set watching when invoking api finish after scrollEnd', () => {
    let pullup: PullUp
    bscroll.movingDirectionY = -1
    // 这里假装bscroll订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd({ y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
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

    jest.advanceTimersByTime(20) // 触发 scrollEnd, 上拉结束
    expect(pullup.watching).toBe(false)

    pullup.finish()
    expect(pullup.watching).toBe(true)
    expect((<jest.Mock>bscroll.on).mock.calls[1][0]).toBe('scroll')
  })

  it('should set watching after scrollEnd when invoking api finish before scrollEnd', () => {
    let pullup: PullUp
    bscroll.movingDirectionY = -1
    // 这里假装bscroll订阅 scroll，10ms 后触发执行
    ;(<jest.Mock>bscroll.on).mockImplementationOnce(
      (eventName: string, pullUpCheckToEnd: (pos: { y: number }) => void) => {
        setTimeout(() => {
          pullUpCheckToEnd({ y: MAX_SCROLL_Y + THRESHOLD - 1 }) // 触发上拉
        }, 10)
      }
    )

    // 这里假装订阅 scrollEnd，20ms 后触发执行
    ;(<jest.Mock>bscroll.once)
      .mockImplementationOnce(
        (eventName: string, resetWatching: () => void) => {
          setTimeout(resetWatching.bind(pullup), 20)
        }
      )
      .mockImplementationOnce((eventName: string, setWatching: () => void) => {
        setTimeout(setWatching, 20)
      })

    pullup = new PullUp(bscroll)

    jest.advanceTimersByTime(11) // 触发 上拉
    expect(bscroll.trigger).toBeCalledWith('pullingUp')
    expect((<jest.Mock>bscroll.off).mock.calls[0][0]).toBe('scroll')

    expect(pullup.watching).toBe(true)
    pullup.finish()

    jest.advanceTimersByTime(20) // 触发 scrollEnd, 上拉结束
    expect(pullup.watching).toBe(true)
    expect((<jest.Mock>bscroll.on).mock.calls[1][0]).toBe('scroll')
  })
})
