import { EventEmitter } from '@better-scroll/shared-utils'

const Transition = jest
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
        'time',
        'timeFunction',
        'beforeForceStop'
      ]),
      translate: jest.fn(),
      stop: jest.fn(),
      move: jest.fn(),
      startProbe: jest.fn(),
      transitionTime: jest.fn(),
      transitionTimingFunction: jest.fn(),
      destroy: jest.fn(),
      setPending: jest.fn(),
      setForceStopped: jest.fn()
    }
  })

export default Transition
