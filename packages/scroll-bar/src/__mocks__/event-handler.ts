import EventEmitter from '@/base/EventEmitter'

const EventHandler = jest.fn().mockImplementation(() => {
  return {
    hooks: new EventEmitter(['touchStart', 'touchMove', 'touchEnd'])
  }
})

export default EventHandler
