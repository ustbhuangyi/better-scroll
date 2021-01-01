import Translater from '../../translater/index'
jest.mock('../../translater/index')

let mockRequestAnimationFrame = jest.fn()
let mockCancelAnimationFrame = jest.fn()
jest.mock('@better-scroll/shared-utils/src/raf', () => {
  return {
    requestAnimationFrame: (cb: any) => mockRequestAnimationFrame(cb),
    cancelAnimationFrame: () => mockCancelAnimationFrame(),
  }
})

import Transition from '@better-scroll/core/src/animater/Transition'

function createTransition(probeType: number) {
  const dom = document.createElement('div')
  const translater = new Translater(dom)
  const transition = new Transition(dom, translater, { probeType })
  return {
    dom,
    translater,
    transition,
  }
}
describe('Transition Class test suit', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.clearAllMocks()
  })
  it('should off hooks and cancelAnimationFrame when destroy', () => {
    const { transition } = createTransition(0)
    const hooksDestroySpy = jest.spyOn(transition.hooks, 'destroy')
    transition.destroy()
    expect(mockCancelAnimationFrame).toBeCalledTimes(1)
    expect(hooksDestroySpy).toBeCalledTimes(1)
  })

  it('should set timeFunction and trigger event', () => {
    const { transition, dom } = createTransition(0)
    const onTimeFunction = jest.fn()
    const onTime = jest.fn()
    transition.hooks.on('time', onTime)
    transition.hooks.on('timeFunction', onTimeFunction)

    const startPoint = {
      x: 0,
      y: 0,
    }
    const endPoint = {
      x: 10,
      y: 10,
    }
    transition.move(startPoint, endPoint, 200, 'cubic-bezier(0.23, 1, 0.32, 1)')
    expect(onTime).toHaveBeenCalledTimes(1)
    expect(onTimeFunction).toHaveBeenCalledTimes(1)
    expect(dom.style.transitionTimingFunction).toBe(
      'cubic-bezier(0.23, 1, 0.32, 1)'
    )
    expect(dom.style.transitionDuration).toBe('200ms')
    transition.destroy()
  })

  it('should call translater with right arguments', () => {
    const { transition, translater } = createTransition(0)

    const startPoint = {
      x: 0,
      y: 0,
    }
    const endPoint = {
      x: 10,
      y: 10,
    }
    transition.move(startPoint, endPoint, 200, 'cubic-bezier(0.23, 1, 0.32, 1)')
    expect(translater.translate).toBeCalledWith(endPoint)
    transition.destroy()
  })

  it('should trigger end hook with time=0', () => {
    const { transition } = createTransition(0)
    const onEnd = jest.fn()
    transition.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0,
    }
    const endPoint = {
      x: 10,
      y: 10,
    }
    transition.options.probeType = 3
    transition.move(startPoint, endPoint, 0, 'cubic-bezier(0.23, 1, 0.32, 1)')
    expect(onEnd).toHaveBeenCalled()
    transition.destroy()
  })
  it('should stop', () => {
    const { transition, translater, dom } = createTransition(0)
    const onForceStop = jest.fn()
    transition.hooks.on('forceStop', onForceStop)

    const startPoint = {
      x: 0,
      y: 0,
    }
    const endPoint = {
      x: 0,
      y: 10,
    }
    transition.move(startPoint, endPoint, 200, 'cubic-bezier(0.23, 1, 0.32, 1)')
    ;(<jest.Mock>translater.getComputedPosition).mockImplementation(() => {
      return { x: 10, y: 10 }
    })
    transition.stop()

    expect(dom.style.transitionDuration).toBe('0ms')
    expect(translater.translate).toBeCalledWith({ x: 10, y: 10 })
    expect(onForceStop).toBeCalledWith({ x: 10, y: 10 })
    expect(mockCancelAnimationFrame).toBeCalled()
    expect(transition.callStopWhenPending).toBe(true)

    transition.destroy()
  })
  it('should startProbe with probeType=3', () => {
    const { transition, translater } = createTransition(3)
    translater.getComputedPosition = jest.fn().mockImplementation(() => {
      return { x: 0, y: 0 }
    })
    mockRequestAnimationFrame.mockImplementation((cb) => {
      setTimeout(() => {
        cb()
      }, 200)
    })
    const onMove = jest.fn()
    const onEnd = jest.fn()
    transition.hooks.on('time', onMove)
    transition.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0,
    }
    const endPoint = {
      x: 10,
      y: 10,
    }
    transition.move(startPoint, endPoint, 200, 'cubic-bezier(0.23, 1, 0.32, 1)')
    expect(transition.callStopWhenPending).toBe(false)
    jest.advanceTimersByTime(200)
    expect(onMove).toBeCalled()

    transition.pending = false
    jest.advanceTimersByTime(200)

    expect(onEnd).toBeCalled()

    transition.destroy()
  })

  it('clearTimer ', () => {
    const { transition } = createTransition(0)
    transition.timer = 1
    transition.clearTimer()
    expect(transition.timer).toBe(0)
  })

  it('should reset callStopWhenPending', () => {
    const { transition } = createTransition(0)
    transition.setPending(true)
    transition.stop()
    transition.startProbe({ x: 0, y: 0 }, { x: 0, y: -10 })
    expect(transition.callStopWhenPending).toBe(false)
  })
})
