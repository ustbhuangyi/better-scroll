import { Behavior } from '../Behavior'
import createAnimater from '../../animater'
import Translater from '../../translater'
import { OptionsConstructor } from '../../Options'
import ActionsHandler from '../../base/ActionsHandler'
import DirectionLockAction from '../DirectionLock'

jest.mock('../Behavior')
jest.mock('../../animater')
jest.mock('../../translater')
jest.mock('../../Options')
jest.mock('../../base/ActionsHandler')
jest.mock('../DirectionLock')

import Actions from '../Actions'

describe('Actions Class tests', () => {
  let actions: Actions
  beforeEach(() => {
    // redefine window.performance
    // because we will use window.performance.timing.navigationStart
    // in our file('src/util/lang.ts')
    Object.defineProperty(window, 'performance', {
      get() {
        return undefined
      },
    })

    let content = document.createElement('div')
    let wrapper = document.createElement('div')
    let bscrollOptions = new OptionsConstructor() as any
    let scrollBehaviorX = new Behavior(wrapper, content, bscrollOptions)
    let scrollBehaviorY = new Behavior(wrapper, content, bscrollOptions)
    let actionsHandler = new ActionsHandler(wrapper, bscrollOptions)
    let translater = new Translater(content)
    let animater = createAnimater(content, translater, bscrollOptions)
    actions = new Actions(
      scrollBehaviorX,
      scrollBehaviorY,
      actionsHandler,
      animater,
      bscrollOptions
    )
  })

  it('should init hooks when call constructor function', () => {
    expect(actions.hooks.eventTypes).toHaveProperty('start')
    expect(actions.hooks.eventTypes).toHaveProperty('beforeMove')
    expect(actions.hooks.eventTypes).toHaveProperty('scroll')
    expect(actions.hooks.eventTypes).toHaveProperty('beforeEnd')
    expect(actions.hooks.eventTypes).toHaveProperty('end')
    expect(actions.hooks.eventTypes).toHaveProperty('scrollEnd')
  })

  it('should invoke handleStart when actionsHandler trigger start hook', () => {
    actions.actionsHandler.hooks.trigger('start')

    expect(actions.fingerMoved).toBe(false)
    expect(actions.scrollBehaviorX.start).toBeCalled()
    expect(actions.scrollBehaviorY.start).toBeCalled()
    expect(actions.scrollBehaviorX.resetStartPos).toBeCalled()
    expect(actions.scrollBehaviorY.resetStartPos).toBeCalled()
    expect(actions.animater.doStop).toBeCalled()
  })

  it('should invoke handleMove when actionsHandler trigger move hook', () => {
    let e = new Event('touchmove')
    let beforeMoveMockHandler = jest.fn()
    let scrollStartHandler = jest.fn()
    let scrollHandler = jest.fn()
    // cancelable beforeMove hook
    actions.hooks.on(
      actions.hooks.eventTypes.beforeMove,
      jest.fn().mockImplementationOnce(() => true)
    )
    actions.hooks.on(actions.hooks.eventTypes.beforeMove, beforeMoveMockHandler)
    actions.hooks.on(actions.hooks.eventTypes.scrollStart, scrollStartHandler)
    actions.hooks.on(actions.hooks.eventTypes.scroll, scrollHandler)

    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e,
    })

    expect(beforeMoveMockHandler).toHaveBeenCalledTimes(0)

    // moved less than 15 px
    actions.endTime = Date.now() - 400
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: 10,
      e,
    })

    expect(beforeMoveMockHandler).toHaveBeenCalledTimes(1)
    expect(actions.directionLockAction.checkMovingDirection).not.toBeCalled()

    // lock direction
    actions.endTime = Date.now()
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 10,
      deltaY: 0,
      e,
    })
    expect(beforeMoveMockHandler).toHaveBeenCalledTimes(2)
    expect(actions.actionsHandler.setInitiated).toBeCalled()

    actions.startTime = Date.now() - 400
    actions.options.probeType = 1
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e,
    })
    expect(beforeMoveMockHandler).toHaveBeenCalledTimes(3)
    expect(scrollStartHandler).toBeCalled()
    expect(scrollHandler).toBeCalledTimes(1)
    expect(actions.scrollBehaviorY.getAbsDist).toHaveBeenCalledWith(-20)
    expect(actions.scrollBehaviorY.move).toHaveBeenCalledWith(-20)

    actions.startTime = Date.now()
    actions.options.probeType = 3
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e,
    })
    expect(scrollHandler).toBeCalledTimes(2)

    const cbMock = jest.fn().mockImplementationOnce(() => true)
    actions.fingerMoved = true
    actions.hooks.on(actions.hooks.eventTypes.detectMovingDirection, cbMock)
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e,
    })

    expect(cbMock).toBeCalled()
    expect(actions.fingerMoved).toBe(true)

    // content not moved
    const mockFn = jest.fn()
    actions.contentMoved = false
    actions.hooks.on(actions.hooks.eventTypes.contentNotMoved, mockFn)
    actions.startTime = Date.now() - 400
    actions.scrollBehaviorX.move = jest.fn().mockImplementation(() => 0)
    actions.scrollBehaviorY.move = jest.fn().mockImplementation(() => 0)

    actions.endTime = Date.now() + 400
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: 0,
      e,
    })
    expect(mockFn).toBeCalled()
  })

  it('should invoke handleEnd when actionsHandler trigger end hook', () => {
    let beforeEndMockHandler = jest.fn()
    let endMockHandler = jest.fn()
    let scrollEndHandler = jest.fn()
    let e = new Event('touchend')
    // cancelable beforeEnd hook
    actions.hooks.on(
      actions.hooks.eventTypes.beforeEnd,
      jest.fn().mockImplementationOnce(() => true)
    )
    // cancelable end hook
    actions.hooks.on(
      actions.hooks.eventTypes.end,
      jest.fn().mockImplementationOnce(() => true)
    )
    actions.hooks.on(actions.hooks.eventTypes.beforeEnd, beforeEndMockHandler)
    actions.hooks.on(actions.hooks.eventTypes.end, endMockHandler)
    actions.hooks.on(actions.hooks.eventTypes.scrollEnd, scrollEndHandler)

    actions.actionsHandler.hooks.trigger(
      actions.actionsHandler.hooks.eventTypes.end,
      e
    )
    expect(beforeEndMockHandler).not.toBeCalled()
    expect(actions.scrollBehaviorX.updateDirection).not.toBeCalled()

    actions.actionsHandler.hooks.trigger(
      actions.actionsHandler.hooks.eventTypes.end,
      e
    )

    expect(beforeEndMockHandler).toHaveBeenCalledTimes(1)
    expect(actions.scrollBehaviorX.updateDirection).toHaveBeenCalledTimes(1)
    expect(actions.scrollBehaviorY.updateDirection).toHaveBeenCalledTimes(1)
    expect(endMockHandler).not.toBeCalled()

    actions.actionsHandler.hooks.trigger(
      actions.actionsHandler.hooks.eventTypes.end,
      e
    )
    expect(scrollEndHandler).toBeCalled()
  })

  it('should get correct position when invoking getCurrentPos method', () => {
    actions.getCurrentPos()
    expect(actions.scrollBehaviorX.getCurrentPos).toBeCalled()
    expect(actions.scrollBehaviorY.getCurrentPos).toBeCalled()
  })

  it('should reset endTime when refreshed', () => {
    actions.refresh()

    expect(actions.endTime).toBe(0)
  })

  it('destroy()', () => {
    actions.destroy()

    expect(actions.hooks.events).toEqual({})
    expect(actions.hooks.eventTypes).toEqual({})
  })

  it('should can be disabled', () => {
    actions.enabled = false
    const actionsHandler = actions.actionsHandler

    actionsHandler.hooks.trigger(actionsHandler.hooks.eventTypes.start)
    expect(actions.directionLockAction.reset).not.toBeCalled()

    actionsHandler.hooks.trigger(actionsHandler.hooks.eventTypes.move, {
      deltaX: 0,
      deltaY: 0,
    })
    expect(actions.scrollBehaviorX.getAbsDist).not.toBeCalled()

    actionsHandler.hooks.trigger(actionsHandler.hooks.eventTypes.end)
    expect(actions.scrollBehaviorX.updateDirection).not.toBeCalled()
  })

  it('should prevent native click event', () => {
    actions.actionsHandler.hooks.trigger(
      actions.actionsHandler.hooks.eventTypes.click,
      {
        _constructed: false,
        target: document.createElement('div'),
        preventDefault() {},
        stopPropagation() {},
      }
    )
  })

  it('apply quadrant transformation when force rotating by CSS', () => {
    let e = new Event('touchmove')

    // second quadrant
    actions.options.quadrant = 2

    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e,
    })

    expect(actions.scrollBehaviorX.getAbsDist).toBeCalledWith(-20)
    expect(actions.scrollBehaviorY.getAbsDist).toBeCalledWith(-0)

    // third quadrant
    actions.options.quadrant = 3

    actions.actionsHandler.hooks.trigger('move', {
      deltaX: -20,
      deltaY: 0,
      e,
    })

    expect(actions.scrollBehaviorX.getAbsDist).toBeCalledWith(20)
    expect(actions.scrollBehaviorY.getAbsDist).toBeCalledWith(-0)

    // forth quadrant
    actions.options.quadrant = 4

    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 20,
      deltaY: 0,
      e,
    })

    expect(actions.scrollBehaviorX.getAbsDist).toBeCalledWith(-0)
    expect(actions.scrollBehaviorY.getAbsDist).toBeCalledWith(20)
  })

  it('coordinateTransformation hook', () => {
    let e = new Event('touchmove')
    const mockFn = jest.fn()
    actions.hooks.on(actions.hooks.eventTypes.coordinateTransformation, mockFn)
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e,
    })

    expect(mockFn).toBeCalled()
  })
})
