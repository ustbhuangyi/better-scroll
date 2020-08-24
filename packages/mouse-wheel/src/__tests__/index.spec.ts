import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')

import MouseWheel from '../index'
import { createEvent } from '@better-scroll/core/src/__tests__/__utils__/event'

interface CustomMouseWheel extends Event {
  deltaX: number
  deltaY: number
  pageX: number
  pageY: number
  [key: string]: any
}

const createMouseWheelElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)
  return { wrapper }
}

function dispatchMouseWheel(
  target: EventTarget,
  name = 'wheel',
  data: { [key: string]: any } = {}
): void {
  const event = <CustomMouseWheel>createEvent('', name)
  Object.assign(event, data)
  target.dispatchEvent(event)
}

describe('mouse-wheel plugin', () => {
  const DISCRETE_TIME = 400
  let scroll: BScroll
  let mouseWheel: MouseWheel
  jest.useFakeTimers()

  beforeEach(() => {
    const { wrapper } = createMouseWheelElements()
    scroll = new BScroll(wrapper, {})

    scroll.scroller.scrollBehaviorX.performDampingAlgorithm = jest
      .fn()
      .mockImplementation((arg1) => {
        return arg1
      })
    scroll.scroller.scrollBehaviorY.performDampingAlgorithm = jest
      .fn()
      .mockImplementation((arg1) => {
        return arg1
      })

    mouseWheel = new MouseWheel(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should proxy hooks to BScroll instance', () => {
    expect(scroll.registerType).toHaveBeenCalledWith([
      'alterOptions',
      'mousewheelStart',
      'mousewheelMove',
      'mousewheelEnd',
    ])
  })

  it('should handle default options and user options', () => {
    // case 1
    scroll.options.mouseWheel = true
    mouseWheel = new MouseWheel(scroll)

    expect(mouseWheel.mouseWheelOpt).toMatchObject({
      speed: 20,
      invert: false,
      easeTime: 300,
      discreteTime: 400,
      throttleTime: 0,
      dampingFactor: 0.1,
    })

    // case 2
    scroll.options.mouseWheel = {
      dampingFactor: 1,
      throttleTime: 50,
    }
    mouseWheel = new MouseWheel(scroll)

    expect(mouseWheel.mouseWheelOpt).toMatchObject({
      speed: 20,
      invert: false,
      easeTime: 300,
      discreteTime: 400,
      throttleTime: 50,
      dampingFactor: 1,
    })
  })

  it('should trigger event when mouse(start|move|end) hooks', () => {
    const onStart = jest.fn()
    const onMove = jest.fn()
    const onEnd = jest.fn()
    const onAlterOptions = jest.fn()

    scroll.on('mousewheelStart', onStart)
    scroll.on('mousewheelMove', onMove)
    scroll.on('mousewheelEnd', onEnd)
    scroll.on('alterOptions', onAlterOptions)

    dispatchMouseWheel(scroll.wrapper, 'wheel')
    expect(onStart).toBeCalledTimes(1)
    expect(onMove).toBeCalledTimes(1)
    expect(onAlterOptions).toBeCalledTimes(1)

    dispatchMouseWheel(scroll.wrapper, 'wheel')
    jest.advanceTimersByTime(DISCRETE_TIME)
    expect(onMove).toBeCalledTimes(2)

    expect(onEnd).toBeCalledTimes(1)
  })

  it('should preventDefault & stopProgation if they are set', () => {
    const mockStopPropagation = jest.fn()
    const mockPreventDefault = jest.fn()

    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation,
    })
    expect(mockPreventDefault).toBeCalled()
    expect(mockStopPropagation).not.toBe(0)
    jest.advanceTimersByTime(400)

    mockPreventDefault.mockClear()
    mockStopPropagation.mockClear()

    // preventDefaultException work
    scroll.options.preventDefaultException = {
      tagName: /^(DIV)$/,
    }

    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation,
    })
    expect(mockPreventDefault).not.toBeCalled()
  })

  it('should forbid scrollTo when mousewheelMove hook return true', () => {
    const onStart = jest.fn()
    const onMove = jest.fn().mockImplementation(() => {
      return true
    })
    const onEnd = jest.fn()

    scroll.on('mousewheelStart', onStart)
    scroll.on('mousewheelMove', onMove)
    scroll.on('mousewheelEnd', onEnd)

    dispatchMouseWheel(scroll.wrapper, 'wheel')
    expect(onStart).toBeCalledTimes(1)
    expect(onMove).toBeCalledTimes(1)

    expect(scroll.scrollTo).not.toBeCalled()
  })

  it('should get right postion when move with deltaMode = 0', () => {
    const onEnd = jest.fn()
    scroll.on('mousewheelEnd', onEnd)

    // x direction
    scroll.hasVerticalScroll = false
    scroll.hasHorizontalScroll = true
    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0,
    })

    expect(scroll.scrollTo).toBeCalledWith(-10, 0, 300)
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: -10,
      y: 0,
      directionX: 1,
      directionY: 0,
    })

    // y direction
    scroll.hasVerticalScroll = true
    scroll.hasHorizontalScroll = false
    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0,
    })
    expect(scroll.scrollTo).toBeCalledWith(0, -10, 300)
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: 0,
      y: -10,
      directionX: 0,
      directionY: 1,
    })
  })

  it('should get right postion when move with deltaMode = 1', () => {
    // x direction
    scroll.hasVerticalScroll = false
    scroll.hasHorizontalScroll = true

    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 2,
      deltaMode: 1,
    })
    expect(scroll.scrollTo).toBeCalledWith(-40, 0, 300)

    // y direction
    scroll.hasVerticalScroll = true
    scroll.hasHorizontalScroll = false
    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 2,
      deltaMode: 1,
    })
    expect(scroll.scrollTo).toBeCalledWith(0, -40, 300)
  })

  it('should get right postion when move with wheelDeltaX and wheelDeltaY', () => {
    scroll.hasVerticalScroll = true
    scroll.hasHorizontalScroll = true
    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      wheelDeltaX: -120,
      wheelDeltaY: -240,
      deltaMode: 0,
    })
    expect(scroll.scrollTo).toBeCalledWith(-20, -40, 300)
  })

  it('should get right postion when move with wheelDelta', () => {
    scroll.hasVerticalScroll = true
    scroll.hasHorizontalScroll = true
    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      wheelDelta: -120,
      deltaMode: 0,
    })
    expect(scroll.scrollTo).toBeCalledWith(-20, -20, 300)
  })

  it('should get right postion when move with detail', () => {
    scroll.hasVerticalScroll = true
    scroll.hasHorizontalScroll = true

    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      detail: 60,
      deltaMode: 0,
    })
    expect(scroll.scrollTo).toBeCalledWith(-400, -400, 300)
  })

  it('should get right postion when move with invert = true', () => {
    // x direction
    scroll.hasVerticalScroll = false
    scroll.hasHorizontalScroll = true

    mouseWheel.mouseWheelOpt.invert = true

    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 2,
      deltaMode: 1,
    })
    expect(scroll.scrollTo).toBeCalledWith(40, 0, 300)
  })

  it('should work with dampingFactor', () => {
    mouseWheel.mouseWheelOpt.dampingFactor = 0.1

    scroll.scroller.scrollBehaviorX.performDampingAlgorithm = jest
      .fn()
      .mockImplementation((distance, factor) => {
        return distance * factor
      })
    scroll.scroller.scrollBehaviorY.performDampingAlgorithm = jest
      .fn()
      .mockImplementation((distance, factor) => {
        return distance * factor
      })

    dispatchMouseWheel(scroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 2,
      deltaMode: 1,
    })

    expect(scroll.scrollTo).toBeCalledWith(0, -4, 300)
  })
})
