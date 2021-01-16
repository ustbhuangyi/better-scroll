import { EventEmitter } from '@better-scroll/shared-utils'

const EventHandler = jest.fn().mockImplementation(() => {
  return {
    hooks: new EventEmitter(['touchStart', 'touchMove', 'touchEnd']),
    destroy: jest.fn(),
  }
})

export default EventHandler
