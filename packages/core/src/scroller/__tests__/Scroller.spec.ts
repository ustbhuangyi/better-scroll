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

    scroller = new Scroller(wrapper, bscrollOptions)
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
      scroller.hooks.on('scrollEnd', scrollEndMockHandler)
      scroller.animater.hooks.trigger('end', pos)

      expect(scroller.animater.setPending).toBeCalled()
      expect(scroller.animater.setPending).toHaveBeenCalledWith(false)
      expect(scrollEndMockHandler).toBeCalled()
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
      scroller.hooks.on('touchEnd', touchEndMockHandler)
      scroller.hooks.trigger('touchEnd', { x: 0, y: 0 })
      scroller.actions.hooks.trigger('end', e, { x: 0, y: 0 })

      expect(touchEndMockHandler).toBeCalled()
      expect(touchEndMockHandler).toHaveBeenCalledWith({
        x: 0,
        y: 0,
      })
    })

    it('bind scrollEnd hook', () => {
      let scrollEndMockHandler = jest.fn()
      let momentumMockHandler = jest.fn()
      let noop = (() => {}) as any
      scroller.hooks.on('scrollEnd', scrollEndMockHandler)
      scroller.hooks.on('momentum', momentumMockHandler)
      scroller.hooks.events['flick'] = [noop]
      scroller.scrollBehaviorX.end = jest.fn().mockImplementation(() => {
        return {
          duration: 400,
        }
      })
      scroller.scrollBehaviorY.end = jest.fn().mockImplementation(() => {
        return {
          duration: 400,
        }
      })
      scroller.actions.hooks.trigger('scrollEnd', { x: 0, y: -20 }, 50)

      expect(scrollEndMockHandler).toBeCalled()
      expect(momentumMockHandler).toBeCalled()
      expect(momentumMockHandler).toHaveBeenCalledWith(
        {
          easing: undefined,
          newX: 0,
          newY: -20,
          time: 400,
        },
        expect.anything()
      )
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

    expect(mockFn).toBeCalled()
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

  it('should trigger scrollToElement hook when scrollToElement method', () => {
    let scrollToElementMockHandler = jest.fn()
    scroller.hooks.on('scrollToElement', scrollToElementMockHandler)

    scroller.refresh()
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
    expect(scrollToElementMockHandler).toHaveBeenCalledWith(content, {
      left: 0,
      top: 0,
    })
  })

  it('should enable or disable when call enable or disable method', () => {
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

  it('should invoking refresh method', () => {
    scroller.refresh()

    expect(scroller.scrollBehaviorX.refresh).toBeCalled()
    expect(scroller.scrollBehaviorY.refresh).toBeCalled()
    expect(scroller.actions.refresh).toBeCalled()
  })

  it('should invoking destroy method', () => {
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
})
