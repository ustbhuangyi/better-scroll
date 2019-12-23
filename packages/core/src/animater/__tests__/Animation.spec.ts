import Translater from '../../translater'
jest.mock('../../translater')

let mockRequestAnimationFrame = jest.fn()
let mockCancelAnimationFrame = jest.fn()
jest.mock('@better-scroll/shared-utils/src/raf', () => {
  return {
    requestAnimationFrame: (cb: any) => mockRequestAnimationFrame(cb),
    cancelAnimationFrame: () => mockCancelAnimationFrame()
  }
})

let mockGetNow = jest.fn()
jest.mock('@better-scroll/shared-utils/src/lang', () => {
  return {
    getNow: () => mockGetNow()
  }
})

import Animation from '../Animation'

function createTransition(probeType: number) {
  const dom = document.createElement('div')
  const translater = new Translater(dom)
  const animation = new Animation(dom, translater, { probeType })
  return {
    dom,
    translater,
    animation
  }
}
describe('Animation Class test suit', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.clearAllMocks()
  })

  it('should off hooks and cancelAnimationFrame when destroy', () => {
    const { animation, translater, dom } = createTransition(0)
    const hooksDestroySpy = jest.spyOn(animation.hooks, 'destroy')
    animation.destroy()
    expect(mockCancelAnimationFrame).toBeCalledTimes(1)
    expect(hooksDestroySpy).toBeCalledTimes(1)
  })

  it('should move to endPoint and trigger hooks in one step when time=0', () => {
    const { animation, translater, dom } = createTransition(0)
    const onMove = jest.fn()
    const onEnd = jest.fn()
    animation.hooks.on('move', onMove)
    animation.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }

    animation.move(startPoint, endPoint, 0, 'easing', false)
    expect(translater.translate).toBeCalledTimes(1)
    expect(translater.translate).toBeCalledWith(endPoint)
    expect(onMove).toBeCalled()
    expect(onEnd).toBeCalled()
  })

  it('should not trigger hooks with isSlient=true& time=0', () => {
    const { animation, translater, dom } = createTransition(0)
    const onMove = jest.fn()
    const onEnd = jest.fn()
    animation.hooks.on('move', onMove)
    animation.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 10,
      y: 10
    }

    animation.move(startPoint, endPoint, 0, 'easing', true)
    expect(onMove).not.toBeCalled()
    expect(onEnd).not.toBeCalled()
  })

  it('should move to endPoint for serveral steps with time', () => {
    const { animation, translater, dom } = createTransition(3)
    const onMove = jest.fn()
    const onEnd = jest.fn()
    const easeFn = jest.fn()
    animation.hooks.on('move', onMove)
    animation.hooks.on('end', onEnd)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 0,
      y: 100
    }

    mockRequestAnimationFrame.mockImplementation(cb => {
      setTimeout(() => {
        cb()
      }, 200)
    })
    mockGetNow
      .mockImplementationOnce(() => {
        return 1000
      })
      .mockImplementationOnce(() => {
        return 1100
      })
      .mockImplementationOnce(() => {
        return 1600
      })
    easeFn.mockImplementationOnce(() => {
      return 0.2
    })
    animation.move(startPoint, endPoint, 500, easeFn, false)
    expect(easeFn).toBeCalledWith(0.2)
    expect(translater.translate).toBeCalledWith({
      x: 0,
      y: 20
    })
    expect(onMove).toBeCalledTimes(1)

    jest.advanceTimersByTime(200)
    expect(translater.translate).toBeCalledWith({
      x: 0,
      y: 100
    })
    expect(onMove).toBeCalledTimes(2)
    expect(onEnd).toBeCalled()
    animation.destroy()
  })
  it('should force stop', () => {
    const { animation, translater, dom } = createTransition(3)
    const onMove = jest.fn()
    const onForceStop = jest.fn()
    const easeFn = jest.fn()
    animation.hooks.on('move', onMove)
    animation.hooks.on('forceStop', onForceStop)

    const startPoint = {
      x: 0,
      y: 0
    }
    const endPoint = {
      x: 0,
      y: 100
    }

    mockRequestAnimationFrame.mockImplementation(cb => {
      setTimeout(() => {
        cb()
      }, 200)
    })
    mockGetNow
      .mockImplementationOnce(() => {
        return 1000
      })
      .mockImplementationOnce(() => {
        return 1100
      })
      .mockImplementationOnce(() => {
        return 1600
      })
    easeFn.mockImplementationOnce(() => {
      return 0.2
    })
    animation.move(startPoint, endPoint, 500, easeFn, false)
    expect(easeFn).toBeCalledWith(0.2)
    expect(translater.translate).toBeCalledWith({
      x: 0,
      y: 20
    })
    expect(animation.pending).toBe(true)
    ;(<jest.Mock>translater.getComputedPosition).mockImplementation(() => {
      return 20
    })
    animation.stop()
    expect(animation.pending).toBe(false)
    expect(mockCancelAnimationFrame).toBeCalled()
    expect(animation.forceStopped).toBe(true)
    expect(onForceStop).toBeCalledWith(20)

    animation.destroy()
  })
})
