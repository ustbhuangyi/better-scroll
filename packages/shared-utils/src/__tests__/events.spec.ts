import { EventEmitter, EventRegister } from '../events'

describe('events', () => {
  describe('EventEmitter', () => {
    let eventEmitter: EventEmitter

    beforeEach(() => {
      eventEmitter = new EventEmitter(['test1'])
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should register handler successfully', () => {
      eventEmitter.on('test1', () => {})

      expect(eventEmitter.eventTypes.test1).toBeTruthy()
      expect(eventEmitter.events.test1).not.toBeUndefined()
    })

    it('should trigger handler', () => {
      let mockHandler = jest.fn(x => x + 1)
      eventEmitter.on('test1', mockHandler)
      eventEmitter.trigger('test1', 1)

      expect(mockHandler.mock.calls.length).toBe(1)
      expect(mockHandler.mock.calls[0][0]).toBe(1)
      expect(mockHandler.mock.results[0].value).toBe(2)
    })

    it('should trigger handler only once', () => {
      let mockHandler = jest.fn(x => x + 1)
      eventEmitter.once('test1', mockHandler)
      eventEmitter.trigger('test1', 1)
      eventEmitter.trigger('test1', 1)

      expect(mockHandler.mock.calls.length).toBe(1)
    })

    it('should tear down handler when invoking off()', () => {
      let mockHandler = jest.fn(x => x + 1)
      eventEmitter.once('test1', mockHandler)
      eventEmitter.off('test1', mockHandler)

      expect(eventEmitter.events.test1.length).toBe(0)
    })

    it('should register eventTypes when invoking registerType()', () => {
      eventEmitter.registerType(['test2'])

      expect(eventEmitter.eventTypes.test2).toBe('test2')
    })
  })

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
})
