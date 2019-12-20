import Translater from '../../translater/index'
jest.mock('../../translater/index')

let mockRequestAnimationFrame = jest.fn()
let mockCancelAnimationFrame = jest.fn()
jest.mock('@better-scroll/shared-utils/src/raf', () => {
  return {
    requestAnimationFrame: (cb: any) => mockRequestAnimationFrame(cb),
    cancelAnimationFrame: () => mockCancelAnimationFrame()
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
    transition
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
    const { transition, translater, dom } = createTransition(0)
    const hooksDestroySpy = jest.spyOn(transition.hooks, 'destroy')
    transition.destroy()
    expect(mockCancelAnimationFrame).toBeCalledTimes(1)
    expect(hooksDestroySpy).toBeCalledTimes(1)
  })

  it('should set timeFunction and trigger event', () => {
    const { transition, translater, dom } = createTransition(0)
    const onTimeFunction = jest.fn()
    const onTime = jest.fn()
    transition.hooks.on('time', onTime)
    transition.hooks.on('timeFunction', onTimeFunction)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }
    transition.move(
      startPoint,
      endPoint,
      200,
      'cubic-bezier(0.23, 1, 0.32, 1)',
      false
    )
    expect(onTime).toHaveBeenCalledTimes(1)
    expect(onTimeFunction).toHaveBeenCalledTimes(1)
    expect(dom.style.webkitTransitionTimingFunction).toBe(
      'cubic-bezier(0.23, 1, 0.32, 1)'
    )
    expect(dom.style.webkitTransitionDuration).toBe('200ms')
    transition.destroy()
  })

  it('should call translater with right arguments', () => {
    const { transition, translater, dom } = createTransition(0)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }
    transition.move(
      startPoint,
      endPoint,
      200,
      'cubic-bezier(0.23, 1, 0.32, 1)',
      false
    )
    expect(translater.translate).toBeCalledWith(endPoint)
    transition.destroy()
  })

  it('should not trigger end hook with isSlient=true,time=0', () => {
    const { transition, translater, dom } = createTransition(0)
    const onEnd = jest.fn()
    transition.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }
    transition.move(
      startPoint,
      endPoint,
      0,
      'cubic-bezier(0.23, 1, 0.32, 1)',
      true
    )
    expect(onEnd).not.toHaveBeenCalled()
    transition.destroy()
  })
  it('should trigger end hook with isSlient=false,time=0', () => {
    const { transition, translater, dom } = createTransition(0)
    const onEnd = jest.fn()
    transition.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }
    transition.move(
      startPoint,
      endPoint,
      0,
      'cubic-bezier(0.23, 1, 0.32, 1)',
      false
    )
    expect(onEnd).toHaveBeenCalled()
    transition.destroy()
  })
  it('should stop', () => {
    const { transition, translater, dom } = createTransition(0)
    const onForceStop = jest.fn()
    transition.hooks.on('forceStop', onForceStop)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 0,
      y: 10
    }
    transition.move(
      startPoint,
      endPoint,
      200,
      'cubic-bezier(0.23, 1, 0.32, 1)',
      false
    )
    ;(<jest.Mock>translater.getComputedPosition).mockImplementation(() => {
      return { x: 10, y: 10 }
    })
    transition.stop()

    expect(dom.style.webkitTransitionDuration).toBe('0ms')
    expect(translater.translate).toBeCalledWith({ x: 10, y: 10 })
    expect(onForceStop).toBeCalledWith({ x: 10, y: 10 })
    expect(mockCancelAnimationFrame).toBeCalled()
    expect(transition.forceStopped).toBe(true)

    transition.destroy()
  })
  it('should startProbe with probeType=3', () => {
    const { transition, translater, dom } = createTransition(3)
    mockRequestAnimationFrame.mockImplementation(cb => {
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
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }
    transition.move(
      startPoint,
      endPoint,
      200,
      'cubic-bezier(0.23, 1, 0.32, 1)',
      false
    )
    jest.advanceTimersByTime(200)
    expect(onMove).toBeCalled()

    transition.pending = false
    jest.advanceTimersByTime(200)

    expect(onEnd).toBeCalled()

    transition.destroy()
  })
})
