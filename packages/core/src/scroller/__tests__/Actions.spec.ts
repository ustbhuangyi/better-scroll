import Behavior from '../Behavior'
import createAnimater from '../../animater'
import Translater from '../../translater'
import { Options } from '../../Options'
import ActionsHandler from '../../base/ActionsHandler'

jest.mock('../Behavior')
jest.mock('../../animater')
jest.mock('../../translater')
jest.mock('../../Options')
jest.mock('../../base/ActionsHandler')

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
      }
    })

    let content = document.createElement('div')
    let wrapper = document.createElement('div')
    let bscrollOptions = new Options() as any
    let scrollBehaviorX = new Behavior(content, bscrollOptions)
    let scrollBehaviorY = new Behavior(content, bscrollOptions)
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

    expect(actions.moved).toBe(false)
    expect(actions.scrollBehaviorX.start).toBeCalled()
    expect(actions.scrollBehaviorY.start).toBeCalled()
    expect(actions.scrollBehaviorX.resetStartPos).toBeCalled()
    expect(actions.scrollBehaviorY.resetStartPos).toBeCalled()
    expect(actions.animater.stop).toBeCalled()
  })

  it('should invoke handleMove when actionsHandler trigger move hook', () => {
    let e = new Event('touchmove')
    let beforeMoveMockHandler = jest.fn()
    let scrollStartHandler = jest.fn()
    let scrollHandler = jest.fn()
    actions.hooks.on('beforeMove', beforeMoveMockHandler)
    actions.hooks.on('scrollStart', scrollStartHandler)
    actions.hooks.on('scroll', scrollHandler)
    actions.actionsHandler.hooks.trigger('move', {
      deltaX: 0,
      deltaY: -20,
      e
    })

    expect(beforeMoveMockHandler).toBeCalled()
    expect(beforeMoveMockHandler).toHaveBeenCalledWith(e)
    expect(scrollStartHandler).toBeCalled()
    // because probeType is 0
    expect(scrollHandler).not.toBeCalled()

    expect(actions.scrollBehaviorX.getAbsDist).toBeCalled()
    expect(actions.scrollBehaviorY.getAbsDist).toBeCalled()
    expect(actions.scrollBehaviorX.getAbsDist).toHaveBeenCalledWith(0)
    expect(actions.scrollBehaviorY.getAbsDist).toHaveBeenCalledWith(-20)
    expect(actions.scrollBehaviorX.move).toBeCalled()
    expect(actions.scrollBehaviorY.move).toBeCalled()
    expect(actions.scrollBehaviorX.move).toHaveBeenCalledWith(0)
    expect(actions.scrollBehaviorY.move).toHaveBeenCalledWith(-20)
  })

  it('should invoke handleEnd when actionsHandler trigger end hook', () => {
    let beforeEndMockHandler = jest.fn()
    let endMockHandler = jest.fn()
    let scrollEndHandler = jest.fn()
    let e = new Event('touchend')
    actions.hooks.on('beforeEnd', beforeEndMockHandler)
    actions.hooks.on('end', endMockHandler)
    actions.hooks.on('scrollEnd', scrollEndHandler)
    actions.actionsHandler.hooks.trigger('end', e)

    expect(beforeEndMockHandler).toBeCalled()
    expect(actions.scrollBehaviorX.updateDirection).toBeCalled()
    expect(actions.scrollBehaviorY.updateDirection).toBeCalled()
    expect(endMockHandler).toBeCalled()
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

  it('should gc when invoking destroy method', () => {
    actions.destroy()

    expect(actions.hooks.events).toEqual({})
    expect(actions.hooks.eventTypes).toEqual({})
  })
})
