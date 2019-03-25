import EventEmitter from '@/base/EventEmitter'

jest.mock('@/base/EventEmitter')

const createAnimater = jest
  .fn()
  .mockImplementation((element, translater, bscrollOptions) => {
    return {
      hooks: new EventEmitter([])
    }
  })

export default createAnimater
