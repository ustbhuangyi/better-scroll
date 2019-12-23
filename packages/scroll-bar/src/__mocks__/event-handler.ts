import { EventEmitter } from '@better-scroll/shared-utils'

const EventHandler = jest.fn().mockImplementation(() => {
  return {
    hooks: new EventEmitter(['touchStart', 'touchMove', 'touchEnd'])
  }
})

export default EventHandler
