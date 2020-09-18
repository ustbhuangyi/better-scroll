import BScroll from '@better-scroll/core'
import ObserveDOM from '../index'
import {
  mockDomOffset,
  CustomHTMLDivElement,
} from '@better-scroll/core/src/__tests__/__utils__/layout'

jest.mock('@better-scroll/core')

const addProperties = <T extends Object, K extends Object>(
  target: T,
  source: K
) => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target
}

const createObserveDOMElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)
  return { wrapper }
}

describe('observe dom', () => {
  let scroll: BScroll
  let observeDOM: ObserveDOM
  let mockMutationObserver: jest.Mock
  let mockObserve: jest.Mock
  let mockDisconnect: jest.Mock
  let triggerMutation: Function

  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    mockObserve = jest.fn()
    mockDisconnect = jest.fn()
    mockMutationObserver = jest.fn().mockImplementation((cb) => {
      triggerMutation = (mutations: any, timer: number) => {
        cb(mutations, timer)
      }
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      }
    })
    Object.defineProperty(window, 'MutationObserver', {
      get: function () {
        return mockMutationObserver
      },
    })

    const { wrapper } = createObserveDOMElements()
    scroll = new BScroll(wrapper, {})
    observeDOM = new ObserveDOM(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('observe without MutationObserver', () => {
    // set MutationObserver to undefined
    Object.defineProperty(window, 'MutationObserver', {
      get: function () {
        return undefined
      },
    })

    observeDOM = new ObserveDOM(scroll)

    expect(observeDOM.observer).toBeFalsy()

    mockDomOffset(scroll.scroller.content as CustomHTMLDivElement, {
      width: 400,
    })
    jest.advanceTimersByTime(1000)
    expect(scroll.refresh).toBeCalled()

    // destroy
    scroll.hooks.trigger('destroy')
    mockDomOffset(scroll.scroller.content as CustomHTMLDivElement, {
      width: 500,
    })
    jest.advanceTimersByTime(1000)
    expect(scroll.refresh).toHaveBeenCalledTimes(1)
  })

  it('observe with MutationObserver', () => {
    expect(scroll.hooks.events.enable.length).toBe(1)
    expect(scroll.hooks.events.disable.length).toBe(1)
    expect(scroll.hooks.events.destroy.length).toBe(1)
    expect(mockObserve).toHaveBeenCalledWith(scroll.scroller.content, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    // init can't be call again when it is observing
    const init = jest.spyOn(observeDOM, 'init')
    scroll.hooks.trigger(scroll.hooks.eventTypes.enabled)
    expect(init).not.toHaveBeenCalled()
    init.mockReset()

    addProperties(scroll.scroller.scrollBehaviorX, {
      currentPos: -12,
      minScrollPos: 0,
      maxScrollPos: -100,
    })

    addProperties(scroll.scroller.scrollBehaviorY, {
      currentPos: -12,
      minScrollPos: 0,
      maxScrollPos: -100,
    })

    addProperties(scroll.scroller.animater, {
      pending: false,
    })

    triggerMutation(
      [
        {
          type: 'test',
        },
      ],
      300
    )
    expect(scroll.refresh).toBeCalledTimes(1)

    // attributes change & target is scroller.content
    triggerMutation(
      [
        {
          type: 'attributes',
          target: scroll.scroller.content,
        },
      ],
      300
    )
    expect(scroll.refresh).toBeCalledTimes(1)

    // attributes change & target is not scroller.content
    triggerMutation(
      [
        {
          type: 'attributes',
          target: '',
        },
      ],
      300
    )
    expect(scroll.refresh).toBeCalledTimes(1)
    jest.advanceTimersByTime(61)
    expect(scroll.refresh).toBeCalledTimes(2)

    // pedding
    addProperties(scroll.scroller.animater, {
      pending: true,
    })
    triggerMutation(
      [
        {
          type: 'test',
        },
      ],
      300
    )
    expect(scroll.refresh).toBeCalledTimes(2)

    // out of boundary
    addProperties(scroll.scroller.scrollBehaviorY, {
      currentPos: -12,
      minScrollPos: 0,
      maxScrollPos: -10,
    })
    triggerMutation(
      [
        {
          type: 'test',
        },
      ],
      300
    )
    expect(scroll.refresh).toBeCalledTimes(2)

    // destroy
    scroll.hooks.trigger(scroll.hooks.eventTypes.destroy)
    expect(mockDisconnect).toBeCalled()
    expect(scroll.hooks.events.enable.length).toBe(0)
    expect(scroll.hooks.events.disable.length).toBe(0)
    expect(scroll.hooks.events.destroy.length).toBe(0)
  })

  it('enable/disable', () => {
    scroll.hooks.trigger(scroll.hooks.eventTypes.disable)
    expect(mockDisconnect).toBeCalled()

    scroll.hooks.trigger(scroll.hooks.eventTypes.enable)
    expect(mockObserve).toBeCalled()
  })
})
