import { Behavior } from '../Behavior'
import createAnimater from '../../animater'
import Translater from '../../translater'
import { OptionsConstructor } from '../../Options'
import ActionsHandler from '../../base/ActionsHandler'
import Actions from '../Actions'

jest.mock('../Behavior')
jest.mock('../../animater')
jest.mock('../../translater')
jest.mock('../../Options')
jest.mock('../../base/ActionsHandler')
jest.mock('../Actions')

import Scroller from '../Scroller'
import { createDiv } from '../../__tests__/__utils__/layout'

describe('Scroller Class tests', () => {
  let scroller: Scroller
  let wrapper: HTMLElement
  let content: HTMLElement

  beforeEach(() => {
    // redefine window.performance
    // because we will use window.performance.timing.navigationStart
    // in our file('src/util/lang.ts')
    Object.defineProperty(window, 'performance', {
      get() {
        return undefined
      },
    })
    wrapper = createDiv(100, 200, 0, 0)
    content = createDiv(100, 400, 0, 0)
    document.body.appendChild(content)
    wrapper.appendChild(content)
    let bscrollOptions = new OptionsConstructor() as any

    scroller = new Scroller(wrapper, content, bscrollOptions)
  })

  it('should init hooks when call constructor function', () => {
    ;[
      'beforeStart',
      'beforeMove',
      'beforeScrollStart',
      'scrollStart',
      'scroll',
      'beforeEnd',
      'scrollEnd',
      'resize',
      'beforeRefresh',
      'touchEnd',
      'flick',
      'scrollCancel',
      'momentum',
      'scrollTo',
      'scrollToElement',
      'minDistanceScroll',
    ].forEach((key) => {
      expect(scroller.hooks.eventTypes).toHaveProperty(key)
    })
  })

  describe('bindTranslater', () => {
    it('should bind beforeTranslate hook', () => {
      let transform: string[] = []
      scroller.translater.hooks.trigger('beforeTranslate', transform)

      expect(transform).toContain(' translateZ(0)')
    })

    it('should bind translate hook', () => {
      scroller.actions.getCurrentPos = jest.fn().mockImplementation(() => {
        return {
          x: 0,
          y: 0,
        }
      })
      scroller.translater.hooks.trigger('translate', { x: 0, y: -20 })

      expect(scroller.scrollBehaviorX.updatePosition).toBeCalled()
      expect(scroller.scrollBehaviorY.updatePosition).toBeCalled()

      expect(scroller.scrollBehaviorX.updatePosition).toHaveBeenCalledWith(0)
      expect(scroller.scrollBehaviorY.updatePosition).toHaveBeenCalledWith(-20)
    })
  })

  describe('bindAnimater', () => {
    it('should bind end hook ', () => {
      let pos = {
        x: 0,
        y: 20,
      }
      let scrollEndMockHandler = jest.fn()
      scroller.hooks.on('scrollEnd', scrollEndMockHandler)
      scroller.scrollBehaviorX.checkInBoundary = jest
        .fn()
        .mockImplementation(() => {
          return {
            position: 0,
            inBoundary: true,
          }
        })
      scroller.scrollBehaviorY.checkInBoundary = jest
        .fn()
        .mockImplementation(() => {
          return {
            position: 0,
            inBoundary: true,
          }
        })
      scroller.animater.hooks.trigger('end', pos)

      expect(scroller.animater.setPending).toHaveBeenCalledWith(false)
      expect(scrollEndMockHandler).toHaveBeenCalledWith({
        x: 0,
        y: 20,
      })
    })

    it('should bubble hooks', () => {
      let scrollEndMockHandler = jest.fn()
      let scrollMockHandler = jest.fn()
      scroller.hooks.on('scrollEnd', scrollEndMockHandler)
      scroller.hooks.on('scroll', scrollMockHandler)
      scroller.animater.hooks.trigger('forceStop')
      scroller.animater.hooks.trigger('move')

      expect(scrollEndMockHandler).toBeCalled()
      expect(scrollMockHandler).toBeCalled()
    })
  })

  describe('bindActions', () => {
    it('bind end hook', () => {
      let touchEndMockHandler = jest.fn()
      let e = new Event('touch') as any
      Object.defineProperty(e, 'target', {
        get() {
          return scroller.wrapper
        },
      })
      // cancelable scroller end hook
      scroller.hooks.on(scroller.hooks.eventTypes.touchEnd, touchEndMockHandler)
      scroller.hooks.trigger(scroller.hooks.eventTypes.touchEnd, { x: 0, y: 0 })
      scroller.hooks.on(
        scroller.hooks.eventTypes.end,
        jest.fn().mockImplementationOnce(() => true)
      )
      const ret = scroller.actions.hooks.trigger(
        scroller.actions.hooks.eventTypes.end,
        e,
        { x: 0, y: 0 }
      )

      expect(ret).toBe(true)
      expect(touchEndMockHandler).toBeCalled()
      expect(touchEndMockHandler).toHaveBeenCalledWith({
        x: 0,
        y: 0,
      })

      /* click operation */
      // case 1

      scroller.hooks.on(
        scroller.hooks.eventTypes.checkClick,
        jest.fn().mockImplementationOnce(() => true)
      )
      scroller.actions.hooks.trigger(scroller.actions.hooks.eventTypes.end, e, {
        x: 0,
        y: 0,
      })

      expect(scroller.animater.setForceStopped).toBeCalledWith(false)

      // case 2 dblclick
      const mockFn2 = jest.fn()
      scroller.options.dblclick = true
      scroller.lastClickTime = Date.now()
      scroller.wrapper.addEventListener('dblclick', mockFn2)
      scroller.actions.hooks.trigger(scroller.actions.hooks.eventTypes.end, e, {
        x: 0,
        y: 0,
      })
      expect(mockFn2).toBeCalled()

      // case 3 tap
      const mockFn3 = jest.fn()
      scroller.options.tap = 'tap'
      scroller.wrapper.addEventListener('tap', mockFn3)
      scroller.actions.hooks.trigger(scroller.actions.hooks.eventTypes.end, e, {
        x: 0,
        y: 0,
      })
      expect(mockFn3).toBeCalled()

      // case 4 click
      const mockFn4 = jest.fn()
      scroller.options.click = true
      scroller.wrapper.addEventListener('click', mockFn4)
      scroller.actions.hooks.trigger(scroller.actions.hooks.eventTypes.end, e, {
        x: 0,
        y: 0,
      })
      expect(mockFn4).toBeCalled()

      // case 5 force stopped
      scroller.animater.forceStopped = true
      const ret2 = scroller.actions.hooks.trigger(
        scroller.actions.hooks.eventTypes.end,
        e,
        { x: 0, y: 0 }
      )
      expect(ret2).toBe(true)
    })

    it('bind scrollEnd hook', () => {
      let momentumMockHandler = jest.fn()
      let noop = (() => {}) as any
      scroller.hooks.on('momentum', momentumMockHandler)
      scroller.scrollBehaviorX.end = jest.fn().mockImplementation(() => {
        return {
          duration: 400,
          destination: 0,
        }
      })
      scroller.scrollBehaviorY.end = jest.fn().mockImplementation(() => {
        return {
          duration: 400,
          destination: -20,
        }
      })
      // flick
      const mockFn = jest.fn()
      scroller.hooks.events['flick'] = [noop, noop]
      scroller.hooks.on(scroller.hooks.eventTypes.flick, mockFn)
      scroller.actions.hooks.trigger(
        scroller.actions.hooks.eventTypes.scrollEnd,
        { x: 0, y: -20 },
        50
      )
      expect(mockFn).toBeCalled()

      // momentum
      scroller.hooks.events['flick'] = []
      scroller.actions.hooks.trigger(
        scroller.actions.hooks.eventTypes.scrollEnd,
        { x: 0, y: -40 },
        50
      )
      expect(scroller.animater.setForceStopped).toBeCalledWith(false)

      // force stop from transition
      scroller.actions.contentMoved = false
      scroller.animater.forceStopped = true
      scroller.actions.hooks.trigger(
        scroller.actions.hooks.eventTypes.scrollEnd,
        { x: 0, y: -20 },
        50
      )
      expect(scroller.animater.setForceStopped).toBeCalledWith(false)

      const mockFn2 = jest.fn()
      scroller.actions.contentMoved = true
      scroller.hooks.on(scroller.hooks.eventTypes.scrollEnd, mockFn2)
      scroller.actions.hooks.trigger(
        scroller.actions.hooks.eventTypes.scrollEnd,
        { x: 0, y: -20 },
        50
      )
      expect(mockFn2).toBeCalledWith({
        x: 0,
        y: -20,
      })
    })
  })

  it('should invoke resize method when window is resized', () => {
    jest.useFakeTimers()
    const mockFn = jest.fn()
    scroller.hooks.on(scroller.hooks.eventTypes.resize, mockFn)
    const resizeEvent = document.createEvent('Event')
    resizeEvent.initEvent('resize', true, true)
    window.dispatchEvent(resizeEvent)
    jest.advanceTimersByTime(60)
    jest.clearAllTimers()
    expect(mockFn).toBeCalledTimes(1)

    // disable scroller
    scroller.actions.enabled = false
    resizeEvent.initEvent('resize', true, true)
    window.dispatchEvent(resizeEvent)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should trigger scrollTo hook when invoking scrollTo method', () => {
    let scrollToMockHandler = jest.fn()
    scroller.hooks.on('scrollTo', scrollToMockHandler)
    scroller.actions.getCurrentPos = jest.fn().mockImplementation(() => {
      return {
        x: 0,
        y: 0,
      }
    })
    scroller.scrollTo(0, -20, 800)

    expect(scrollToMockHandler).toBeCalledWith({
      x: 0,
      y: -20,
    })
    expect(scroller.animater.move).toBeCalledWith(
      {
        x: 0,
        y: 0,
      },
      {
        x: 0,
        y: -20,
      },
      800,
      'cubic-bezier(0.165, 0.84, 0.44, 1)'
    )
  })

  it('scrollToElement()', () => {
    let scrollToElementMockHandler = jest.fn()
    scroller.hooks.on(
      scroller.hooks.eventTypes.scrollToElement,
      scrollToElementMockHandler
    )

    scroller.refresh(scroller.content)
    scroller.scrollBehaviorX.adjustPosition = jest.fn(() => {
      return 0
    })
    scroller.scrollBehaviorY.adjustPosition = jest.fn(() => {
      return 0
    })
    scroller.actions.getCurrentPos = jest.fn().mockImplementation(() => {
      return {
        x: 0,
        y: 0,
      }
    })

    scroller.scrollToElement(content, 0, false, false)
    expect(scrollToElementMockHandler).toBeCalled()
    // to a specified position
    scroller.scrollToElement(content, 0, 0, 0)
    expect(scrollToElementMockHandler).toHaveBeenLastCalledWith(content, {
      left: 0,
      top: 0,
    })

    const mockFn2 = jest.fn()
    scroller.hooks.on(scroller.hooks.eventTypes.scrollToElement, () => true)
    scroller.hooks.on(scroller.hooks.eventTypes.scrollToElement, mockFn2)
    scroller.scrollToElement(content, 0, 0, 0)

    expect(mockFn2).not.toBeCalled()
  })

  it('scrollBy ', () => {
    const mockFn = jest.fn()
    scroller.hooks.on(scroller.hooks.eventTypes.scrollTo, mockFn)
    scroller.scrollBy(20, 20)
    expect(mockFn).toBeCalledWith({
      x: 20,
      y: 20,
    })
  })

  it('enable() & disable()', () => {
    scroller.disable()
    expect(scroller.actions.enabled).toBe(false)

    scroller.enable()
    expect(scroller.actions.enabled).toBe(true)
  })

  it('should update postions when invoking updatePositions method', () => {
    scroller.updatePositions({
      x: 20,
      y: -20,
    })

    expect(scroller.scrollBehaviorX.updatePosition).toHaveBeenCalledWith(20)
    expect(scroller.scrollBehaviorY.updatePosition).toHaveBeenCalledWith(-20)
  })

  it('refresh()', () => {
    scroller.options.bindToTarget = true
    scroller.refresh(document.createElement('p'))

    expect(scroller.scrollBehaviorX.refresh).toBeCalled()
    expect(scroller.scrollBehaviorY.refresh).toBeCalled()
    expect(scroller.actions.refresh).toBeCalled()
    expect(scroller.actionsHandler.setContent).toBeCalled()
  })

  it('destroy()', () => {
    scroller.destroy()
    const keys = [
      'actionsHandler',
      'actions',
      'animater',
      'translater',
      'scrollBehaviorX',
      'scrollBehaviorY',
    ]
    keys.forEach((key) => {
      expect(scroller[key].destroy).toBeCalled()
    })
  })

  it('resetPosition() ', () => {
    const mockFn = jest.fn()
    scroller.hooks.on(scroller.hooks.eventTypes.scrollTo, mockFn)
    scroller.resetPosition()
    expect(mockFn).toBeCalledWith({
      x: 0,
      y: 0,
    })
  })
  it('scrollTo()', () => {
    // minDistanceScroll
    const mockFn = jest.fn()
    scroller.hooks.on(scroller.hooks.eventTypes.minDistanceScroll, mockFn)

    scroller.scrollTo(0, 0.5, 300)
  })
  it('should not toggle pointer-events when casting last position into integer in touchend handlers', () => {
    scroller.actions.ensuringInteger = true
    scroller.translater.hooks.trigger('translate', { x: 0, y: -20 })
    expect(scroller.actions.ensuringInteger).toBe(false)
  })
})
