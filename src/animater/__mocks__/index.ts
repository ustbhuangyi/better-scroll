import EventEmitter from '@/base/EventEmitter'

const createAnimater = jest
  .fn()
  .mockImplementation((element, translater, bscrollOptions) => {
    return {
      translater,
      hooks: new EventEmitter([
        'move',
        'end',
        'forceStop',
        'time',
        'timeFunction'
      ])
    }
  })

export default createAnimater
