import EventRegister from '@better-scroll/core/src/base/EventRegister'

describe('EventRegister', () => {
  let eventRegister: EventRegister
  let fakeNode: HTMLElement
  let mockHandler: any

  beforeEach(() => {
    fakeNode = document.createElement('div')
    mockHandler = jest.fn(() => 'it is a test handler ')
    eventRegister = new EventRegister(fakeNode, [
      {
        name: 'test',
        handler: mockHandler as any
      }
    ])
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should trigger handler when dispatch touch event', () => {
    const evt = document.createEvent('Event')
    const evtType = 'test'
    evt.initEvent(evtType, false, false)

    fakeNode.dispatchEvent(evt)
    expect(mockHandler.mock.calls.length).toBe(1)
  })

  it('should remove dom events when destroy', () => {
    eventRegister.destroy()
    const evt = document.createEvent('Event')
    const evtType = 'test'
    evt.initEvent(evtType, false, false)

    fakeNode.dispatchEvent(evt)
    expect(mockHandler.mock.calls.length).toBe(0)
  })
})
