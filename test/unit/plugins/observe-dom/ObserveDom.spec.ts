import BScroll from '../../../../src/index'
import ObserveDom from '../../../../src/plugins/observe-dom'
import EventEmitter from '../../../../src/base/EventEmitter'
import {
  mockOffsetWidth,
  mockOffsetHeight,
  CustomHTMLDivElement
} from '../../utils/layout'

jest.mock('../../../../src/index')

function createBS(hooks: EventEmitter) {
  const dom = document.createElement('div') as CustomHTMLDivElement
  dom.style.width = '300px'
  dom.style.height = '300px'
  dom._jsdomMockOffsetHeight = 300
  dom._jsdomMockOffsetWidth = 300

  const bs = new BScroll('test') as any
  bs.hooks = hooks
  bs.scroller = {
    content: dom
  }
  return bs
}
mockOffsetHeight.get.mockImplementation(dom => {
  return dom._jsdomMockOffsetHeight || 0
})
mockOffsetWidth.get.mockImplementation(dom => {
  return dom._jsdomMockOffsetWidth || 0
})

describe('observe dom', () => {
  let hooks = new EventEmitter(['enable', 'disable', 'destroy'])
  let mockMutationObserver: jest.Mock
  let mockObserve = jest.fn()
  let mockDisconnect = jest.fn()
  let triggerMutation: Function
  function mockMutation() {
    mockMutationObserver = jest.fn().mockImplementation(cb => {
      triggerMutation = (mutations: any, timer: number) => {
        cb(mutations, timer)
      }
      return {
        observe: mockObserve,
        disconnect: mockDisconnect
      }
    })
    Object.defineProperty(window, 'MutationObserver', {
      get: function() {
        return mockMutationObserver
      }
    })
  }
  beforeAll(() => {
    jest.useFakeTimers()
  })
  it('observe without MutationObserver', () => {
    const bs = createBS(hooks)
    const obDom = new ObserveDom(bs)

    jest.advanceTimersByTime(1000)
    expect(bs.refresh).not.toBeCalled()

    bs.scroller.content._jsdomMockOffsetWidth = 400
    jest.advanceTimersByTime(1000)
    expect(bs.refresh).toBeCalledTimes(1)
    // destroy
    hooks.trigger('destroy')
    bs.scroller.content._jsdomMockOffsetWidth = 500
    jest.advanceTimersByTime(1000)
    expect(bs.refresh).toBeCalledTimes(1)
  })

  it('observe with MutationObserver', () => {
    mockMutation()
    const bs = createBS(hooks)
    const obDom = new ObserveDom(bs)
    expect(hooks.events.enable.length).toBe(1)
    expect(hooks.events.disable.length).toBe(1)
    expect(hooks.events.destroy.length).toBe(1)
    expect(mockObserve).toHaveBeenCalledWith(bs.scroller.content, {
      attributes: true,
      childList: true,
      subtree: true
    })

    // init can't be call again when it has been inited
    const init = jest.spyOn(obDom, 'init')
    hooks.trigger('enable')
    expect(init).not.toHaveBeenCalled()
    init.mockReset()

    bs.scroller.scrollBehaviorX = {
      currentPos: -12,
      minScrollPos: 0,
      maxScrollPos: -100
    }
    bs.scroller.scrollBehaviorY = {
      currentPos: -12,
      minScrollPos: 0,
      maxScrollPos: -100
    }
    bs.scroller.animater = {
      pedding: false
    }

    triggerMutation(
      [
        {
          type: 'test'
        }
      ],
      300
    )
    expect(bs.refresh).toBeCalledTimes(1)

    // attributes change & target is scroller.content
    triggerMutation(
      [
        {
          type: 'attributes',
          target: bs.scroller.content
        }
      ],
      300
    )
    expect(bs.refresh).toBeCalledTimes(1)

    // attributes change & target is not scroller.content
    triggerMutation(
      [
        {
          type: 'attributes',
          target: ''
        }
      ],
      300
    )
    expect(bs.refresh).toBeCalledTimes(1)
    jest.advanceTimersByTime(61)
    expect(bs.refresh).toBeCalledTimes(2)

    // pedding
    bs.scroller.animater = {
      pending: true
    }
    triggerMutation(
      [
        {
          type: 'test'
        }
      ],
      300
    )
    expect(bs.refresh).toBeCalledTimes(2)

    // outBoundary
    bs.scroller.scrollBehaviorY = {
      currentPos: -12,
      minScrollPos: 0,
      maxScrollPos: -10
    }
    triggerMutation(
      [
        {
          type: 'test'
        }
      ],
      300
    )
    expect(bs.refresh).toBeCalledTimes(2)

    // destroy
    hooks.trigger('destroy')
    expect(mockDisconnect).toBeCalled()
    expect(hooks.events.enable.length).toBe(0)
    expect(hooks.events.disable.length).toBe(0)
    expect(hooks.events.destroy.length).toBe(0)
  })
  it('enable/disable', () => {
    const bs = createBS(hooks)
    const obDom = new ObserveDom(bs)
    const initSpy = jest.spyOn(obDom, 'init')
    hooks.trigger('disable')
    expect(mockDisconnect).toBeCalled()

    hooks.trigger('enable')
    expect(initSpy).toBeCalled()

    hooks.trigger('destroy')
  })
})
