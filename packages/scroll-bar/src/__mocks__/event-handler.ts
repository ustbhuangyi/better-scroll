import EventEmitter from '@better-scroll/core/src/base/EventEmitter'

const EventHandler = jest.fn().mockImplementation(() => {
  return {
    hooks: new EventEmitter(['touchStart', 'touchMove', 'touchEnd'])
  }
})

export default EventHandler
