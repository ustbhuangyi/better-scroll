import ActionsHandler, {
  Options
} from '@better-scroll/core/src/base/ActionsHandler'
import {
  dispatchTouch,
  dispatchMouse
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
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
      },
      tagException: { tagName: /^TEXTAREA$/ },
      momentumLimitDistance: 15
    }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should bind click handler when options.disableMouse is true', () => {
    actionsHandler = new ActionsHandler(wrapper, options)

    const wrapperEventsName = actionsHandler.wrapperEventRegister.events.map(
      event => event.name
    )

    const targetEventsName = actionsHandler.targetEventRegister.events.map(
      event => event.name
    )

    expect(wrapperEventsName).toMatchObject(['mousedown'])
    expect(targetEventsName).toMatchObject(['mousemove', 'mouseup'])
  })

  it('should invoice start method when dispatch mousedown', () => {
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

    expect(beforeStartMockHandler).toBeCalled()
    expect(startMockHandler).toBeCalled()
  })

  it('should invoice move method when dispatch touchmove', () => {
    actionsHandler = new ActionsHandler(wrapper, options)
    const moveMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('move', moveMockHandler)

    dispatchMouse(wrapper, 'mousedown')

    dispatchMouse(window, 'mousemove')

    expect(moveMockHandler).toBeCalled()
  })

  it('should invoice end method when dispatch touchend', () => {
    actionsHandler = new ActionsHandler(wrapper, options)
    const endMockHandler = jest.fn().mockImplementation(() => {
      return 'dummy test'
    })

    actionsHandler.hooks.on('end', endMockHandler)

    dispatchMouse(wrapper, 'mousedown')

    dispatchMouse(window, 'mouseup')

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
        pageY: 10
      }
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
})
