import { EventRegister, EventEmitter } from '@better-scroll/shared-utils'

const ActionsHandler = jest
  .fn()
  .mockImplementation((wrapper, bscrollOptions) => {
    return {
      wrapper,
      options: bscrollOptions,
      initiated: 1,
      pointX: 0,
      pointY: 0,
      startClickRegister: new EventRegister(wrapper, []),
      moveEndRegister: new EventRegister(wrapper, []),
      hooks: new EventEmitter(['beforeStart', 'start', 'move', 'end', 'click']),
      destroy: jest.fn()
    }
  })

export default ActionsHandler
