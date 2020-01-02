import BScroll from '@better-scroll/core'
import * as domUtil from '@better-scroll/shared-utils/src/dom'
jest.mock('@better-scroll/core')
const mockDomUtil = jest.spyOn(domUtil, 'preventDefaultExceptionFn')

import MouseWheel from '../index'
import { createEvent } from '@better-scroll/core/src/__tests__/__utils__/event'

interface CustomMouseWheel extends Event {
  deltaX: number
  deltaY: number
  pageX: number
  pageY: number
  [key: string]: any
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

function createBScroll() {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)

  const options = {
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 0,
      debounce: 0,
      throttle: 400
    }
  }
  return new BScroll(wrapper, options)
}
function initForMouseWheel(bscroll: BScroll) {
  bscroll.x = 0
  bscroll.y = 0
  bscroll.scroller.scrollBehaviorX.hasScroll = false
  bscroll.scroller.scrollBehaviorY.hasScroll = false
  bscroll.scroller.scrollBehaviorX.minScrollPos = 0
  bscroll.scroller.scrollBehaviorX.maxScrollPos = 0
  bscroll.scroller.scrollBehaviorY.maxScrollPos = 0
  bscroll.eventTypes['mousewheelMove'] = 'mousewheelMove'
  bscroll.eventTypes['mousewheelEnd'] = 'mousewheelEnd'
  bscroll.eventTypes['mousewheelStart'] = 'mousewheelStart'
}
describe('mouse-wheel plugin', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should registe event and hooks/ should off all event', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    const mockBsOn = jest.fn()

    expect(bscroll.registerType).toHaveBeenCalledWith([
      'mousewheelMove',
      'mousewheelStart',
      'mousewheelEnd'
    ])

    initForMouseWheel(bscroll)
    bscroll.on('mousewheelStart', mockBsOn)

    dispatchMouseWheel(bscroll.wrapper, 'wheel')
    expect(mockBsOn).toBeCalledTimes(1)
    jest.advanceTimersByTime(500)
    dispatchMouseWheel(bscroll.wrapper, 'mousewheel')
    expect(mockBsOn).toBeCalledTimes(2)
    jest.advanceTimersByTime(500)
    dispatchMouseWheel(bscroll.wrapper, 'DOMMouseScroll')
    expect(mockBsOn).toBeCalledTimes(3)
    jest.advanceTimersByTime(500)
    mockBsOn.mockClear()
    jest.clearAllMocks()

    bscroll.hooks.trigger('destroy')
    expect(bscroll.hooks.events['destroy'].length).toBe(0)
    expect(clearTimeout).toBeCalledTimes(2)
    dispatchMouseWheel(bscroll.wrapper, 'wheel')
    expect(mockBsOn).not.toBeCalled()
  })
  it('should trigger event when start/end/move', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    const onStart = jest.fn()
    const onMove = jest.fn()
    const onEnd = jest.fn()
    initForMouseWheel(bscroll)
    bscroll.on('mousewheelStart', onStart)
    bscroll.on('mousewheelMove', onMove)
    bscroll.on('mousewheelEnd', onEnd)

    dispatchMouseWheel(bscroll.wrapper, 'wheel')
    expect(onStart).toBeCalledTimes(1)
    expect(onMove).toBeCalledTimes(1)

    dispatchMouseWheel(bscroll.wrapper, 'wheel')
    expect(onMove).toBeCalledTimes(2)

    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledTimes(1)

    mouseWheel.destroy()
  })
  it('should preventDefault & stopProgation if they are set', () => {
    const bscroll = createBScroll()
    bscroll.options.preventDefault = true
    bscroll.options.stopPropagation = true
    mockDomUtil.mockImplementation(() => {
      return false
    })
    const mouseWheel = new MouseWheel(bscroll)
    const mockStopPropagation = jest.fn()
    const mockPreventDefault = jest.fn()
    initForMouseWheel(bscroll)

    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation
    })
    expect(mockPreventDefault).toBeCalled()
    expect(mockStopPropagation).toBeCalled()
    jest.advanceTimersByTime(400)
    mockPreventDefault.mockClear()
    mockStopPropagation.mockClear()

    // preventDefaultException work
    bscroll.options.preventDefault = true
    bscroll.options.stopProgation = true
    bscroll.options.preventDefaultException = {
      tagName: /^(DIV)$/
    }
    mockDomUtil.mockImplementation(() => {
      return true
    })
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation
    })
    expect(mockPreventDefault).not.toBeCalled()

    mouseWheel.destroy()
  })
  it('should forbide scrollTo', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    const onStart = jest.fn()
    const onMove = jest.fn().mockImplementation(() => {
      return true
    })
    const onEnd = jest.fn()
    initForMouseWheel(bscroll)
    bscroll.on('mousewheelStart', onStart)
    bscroll.on('mousewheelMove', onMove)
    bscroll.on('mousewheelEnd', onEnd)

    dispatchMouseWheel(bscroll.wrapper, 'wheel')
    expect(onStart).toBeCalledTimes(1)
    expect(onMove).toBeCalledTimes(1)

    expect(bscroll.scrollTo).not.toBeCalled()

    jest.clearAllTimers()
    mouseWheel.destroy()
  })
  it('should get right postion when move with deltaMode = 0', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    initForMouseWheel(bscroll)
    const onEnd = jest.fn()
    bscroll.on('mousewheelEnd', onEnd)

    // in boundary for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).toBeCalledWith(-10, 0, 300)
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: -10,
      y: 0,
      directionX: 1,
      directionY: 0
    })

    // out boundar for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -20
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 30,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).toBeCalledWith(-20, 0, 300)
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: -30,
      y: 0,
      directionX: 1,
      directionY: 0
    })

    // in boundary for y
    bscroll.scroller.scrollBehaviorX.hasScroll = false
    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).toBeCalledWith(0, -10, 300)
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: 0,
      y: -10,
      directionX: 0,
      directionY: 1
    })

    // out boundar for x
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -20
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 30,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).toBeCalledWith(0, -20, 300)
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: 0,
      y: -30,
      directionX: 0,
      directionY: 1
    })

    // x&y hasScroll = false
    bscroll.scroller.scrollBehaviorX.hasScroll = false
    bscroll.scroller.scrollBehaviorY.hasScroll = false
    bscroll.scrollTo.mockClear()
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 40,
      deltaY: 30,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).not.toHaveBeenCalled()
    jest.advanceTimersByTime(410)
    expect(onEnd).toBeCalledWith({
      x: 0,
      y: 0,
      directionX: 0,
      directionY: 0
    })

    jest.clearAllTimers()
    mouseWheel.destroy()
  })

  it('should get right postion when move with deltaMode = 1', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    initForMouseWheel(bscroll)
    const onEnd = jest.fn()
    bscroll.on('mousewheelEnd', onEnd)

    // in boundary for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -200
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 1,
      deltaY: 2,
      deltaMode: 1
    })
    expect(bscroll.scrollTo).toBeCalledWith(-20, -40, 300)
    jest.advanceTimersByTime(410)

    jest.clearAllTimers()
    mouseWheel.destroy()
  })

  it('should get right postion when move with wheelDeltaX and wheelDeltaY', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    initForMouseWheel(bscroll)
    const onEnd = jest.fn()
    bscroll.on('mousewheelEnd', onEnd)

    // in boundary for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -200
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      wheelDeltaX: -120,
      wheelDeltaY: -240,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).toBeCalledWith(-20, -40, 300)
    jest.advanceTimersByTime(410)

    jest.clearAllTimers()
    mouseWheel.destroy()
  })

  it('should get right postion when move with wheelDelta', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    initForMouseWheel(bscroll)
    const onEnd = jest.fn()
    bscroll.on('mousewheelEnd', onEnd)

    // in boundary for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -200
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      wheelDelta: -120,
      deltaMode: 0
    })
    expect(bscroll.scrollTo).toBeCalledWith(-20, -20, 300)
    jest.advanceTimersByTime(410)

    jest.clearAllTimers()
    mouseWheel.destroy()
  })

  it('should get right postion when move with detail', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    initForMouseWheel(bscroll)
    const onEnd = jest.fn()
    bscroll.on('mousewheelEnd', onEnd)

    // in boundary for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -200
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      detail: 3
    })
    expect(bscroll.scrollTo).toBeCalledWith(-20, -20, 300)
    jest.advanceTimersByTime(410)

    jest.clearAllTimers()
    mouseWheel.destroy()
  })

  it('should get right postion when move with invert = true', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    initForMouseWheel(bscroll)
    mouseWheel.mouseWheelOpt.invert = true

    // in boundary for x
    bscroll.scroller.scrollBehaviorX.hasScroll = true
    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorX.maxScrollPos = -200
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: -1,
      deltaY: -2,
      deltaMode: 1
    })
    expect(bscroll.scrollTo).toBeCalledWith(-20, -40, 300)
    jest.advanceTimersByTime(410)

    jest.clearAllTimers()
    mouseWheel.destroy()
  })

  it('should debounce config work', () => {
    const bscroll = createBScroll()
    const mouseWheel = new MouseWheel(bscroll)
    mouseWheel.mouseWheelOpt.debounce = 300
    const onStart = jest.fn()
    const onMove = jest.fn().mockImplementation(() => {
      return true
    })
    const onEnd = jest.fn()
    initForMouseWheel(bscroll)
    bscroll.on('mousewheelStart', onStart)
    bscroll.on('mousewheelMove', onMove)
    bscroll.on('mousewheelEnd', onEnd)

    bscroll.scroller.scrollBehaviorY.hasScroll = true
    bscroll.scroller.scrollBehaviorY.maxScrollPos = -200

    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0
    })
    expect(onMove).toBeCalledWith({ x: 0, y: -10 })

    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0
    })
    expect(onMove).toBeCalledTimes(1)

    jest.advanceTimersByTime(300)
    dispatchMouseWheel(bscroll.wrapper, 'wheel', {
      deltaX: 0,
      deltaY: 10,
      deltaMode: 0
    })
    expect(onMove).toBeCalledTimes(2)
    expect(onMove).toBeCalledWith({
      x: 0,
      y: -20
    })

    jest.clearAllTimers()
    mouseWheel.destroy()
  })
})
