import { EventEmitter } from '@better-scroll/shared-utils'

const Animation = jest
  .fn()
  .mockImplementation((content, translater, bscrollOptions) => {
    return {
      content,
      translater,
      options: bscrollOptions,
      style: content.style,
      pending: false,
      forceStopped: false,
      timer: 0,
      hooks: new EventEmitter([
        'move',
        'end',
        'forceStop',
        'beforeForceStop',
        'callStop',
        'time',
        'timeFunction',
      ]),
      translate: jest.fn(),
      stop: jest.fn(),
      doStop: jest.fn(),
      move: jest.fn(),
      destroy: jest.fn(),
      setPending: jest.fn(),
      setForceStopped: jest.fn(),
      setCallStop: jest.fn(),
      setContent: jest.fn(),
      clearTimer: jest.fn(),
    }
  })

export default Animation
