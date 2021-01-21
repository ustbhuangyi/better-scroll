import ActionsHandler, {
  Options,
} from '@better-scroll/core/src/base/ActionsHandler'
import {
  dispatchTouch,
  dispatchMouse,
  dispatchTouchStart,
  dispatchTouchEnd,
  dispatchTouchCancel,
} from '@better-scroll/core/src/__tests__/__utils__/event'

describe('ActionsHandler', () => {
  let actionsHandler: ActionsHandler
  let wrapper: HTMLElement
  let options: Options

  beforeEach(() => {
    wrapper = document.createElement('wrapper')
    options = {
      click: false,
      bindToWrapper: false,
      disableMouse: false,
      disableTouch: false,
      preventDefault: true,
      stopPropagation: true,
      preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/,
      },
      tagException: { tagName: /^TEXTAREA$/ },
      autoEndDistance: 5,
    }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should bind mouse event when options.disableMouse is false', () => {
    options.disableTouch = true
    actionsHandler = new ActionsHandler(wrapper, options)

    const wrapperEventsName = actionsHandler.wrapperEventRegister.events.map(
      (event) => event.name
    )

    const targetEventsName = actionsHandler.targetEventRegister.events.map(
      (event) => event.name
    )

    expect(wrapperEventsName).toMatchObject(['mousedown'])
    expect(targetEventsName).toMatchObject(['mousemove', 'mouseup'])
  })

  it('should invoke start method when dispatch mousedown', () => {
    actionsHandler = new ActionsHandler(wrapper, options)
    const beforeStartMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })
    const startMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('beforeStart', beforeStartMockHandler)
    actionsHandler.hooks.on('start', startMockHandler)

    dispatchMouse(wrapper, 'mousedown')

    expect(beforeStartMockHandler).toBeCalledTimes(1)
    expect(startMockHandler).toBeCalledTimes(1)

    // return early
    actionsHandler.setInitiated(1)
    dispatchMouse(wrapper, 'mousedown')
    expect(beforeStartMockHandler).toBeCalledTimes(1)
    expect(startMockHandler).toBeCalledTimes(1)

    // only allow mouse left button
    actionsHandler.setInitiated(0)
    dispatchMouse(wrapper, 'mousedown', false)
    expect(beforeStartMockHandler).toBeCalledTimes(1)
    expect(startMockHandler).toBeCalledTimes(1)

    // cancelable beforeStart hook
    actionsHandler.hooks.on('beforeStart', () => true)
    dispatchMouse(wrapper, 'mousedown')
    expect(beforeStartMockHandler).toBeCalledTimes(2)
    expect(startMockHandler).toBeCalledTimes(1)
  })

  it('should invoke move method when dispatch touchmove', () => {
    actionsHandler = new ActionsHandler(wrapper, options)
    const moveMockHandler1 = jest.fn().mockImplementationOnce(() => {
      return true
    })
    const moveMockHandler2 = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('move', moveMockHandler1)
    actionsHandler.hooks.on('move', moveMockHandler2)

    dispatchMouse(wrapper, 'mousedown')

    dispatchMouse(window, 'mousemove')

    expect(moveMockHandler1).toBeCalledTimes(1)

    // cancelable move hook
    expect(moveMockHandler2).not.toBeCalled()

    // simulate finger moved out of viewport
    actionsHandler.pointX = 5
    const endMockHandler = jest.fn()
    actionsHandler.hooks.on(actionsHandler.hooks.eventTypes.end, endMockHandler)
    dispatchMouse(window, 'mousemove')

    expect(endMockHandler).toBeCalled()
  })

  it('should invoke end method when dispatch touchend', () => {
    actionsHandler = new ActionsHandler(wrapper, options)
    const endMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('end', endMockHandler)

    dispatchTouchStart(wrapper, [{ pageX: 0, pageY: 0 }])

    dispatchTouchEnd(window, [{ pageX: 0, pageY: 0 }])

    expect(endMockHandler).toBeCalled()
  })

  it('should invoke end method when dispatch touchcancel', () => {
    actionsHandler = new ActionsHandler(wrapper, options)
    const endMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('end', endMockHandler)

    dispatchTouchStart(wrapper, [{ pageX: 0, pageY: 0 }])

    dispatchTouchCancel(window, [{ pageX: 0, pageY: 0 }])

    expect(endMockHandler).toBeCalled()
  })

  it('should call click method when dispatch click', () => {
    options.click = true
    actionsHandler = new ActionsHandler(wrapper, options)
    const clickMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('click', clickMockHandler)

    dispatchTouch(wrapper, 'click', [
      {
        pageX: 10,
        pageY: 10,
      },
    ])

    expect(clickMockHandler).toBeCalled()
  })

  it('should make bs not take effect when manipulate textarea DOM tag', () => {
    const textarea = document.createElement('textarea')
    const content = document.createElement('div')
    content.appendChild(textarea)
    wrapper.appendChild(content)
    actionsHandler = new ActionsHandler(wrapper, options)

    dispatchMouse(textarea, 'mousedown')

    expect(actionsHandler.initiated).toBeFalsy()
  })

  it('destroy()', () => {
    actionsHandler = new ActionsHandler(wrapper, options)

    actionsHandler.destroy()

    expect(actionsHandler.wrapperEventRegister.events.length).toBe(0)
    expect(actionsHandler.targetEventRegister.events.length).toBe(0)
    expect(actionsHandler.hooks.eventTypes).toMatchObject({})
    expect(actionsHandler.hooks.events).toMatchObject({})
  })

  it('setContent()', () => {
    const p = document.createElement('p')
    actionsHandler.setContent(p)
    expect(actionsHandler.wrapper).toBe(p)
  })
})
