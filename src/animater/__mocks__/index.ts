import EventEmitter from '@/base/EventEmitter'

// 使用真实 发布订阅逻辑
// jest.mock('@/base/EventEmitter')

const createAnimater = jest
  .fn()
  .mockImplementation((element, translater, bscrollOptions) => {
    return {
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
