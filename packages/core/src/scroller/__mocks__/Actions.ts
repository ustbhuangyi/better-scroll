import DirectionLock from '../DirectionLock'

jest.mock('../DirectionLock')

import { EventEmitter } from '@better-scroll/shared-utils'

const ScrollerActions = jest
  .fn()
  .mockImplementation(
    (
      scrollBehaviorX,
      scrollBehaviorY,
      actionsHandler,
      animater,
      bscrollOptions
    ) => {
      const directionLockAction = new DirectionLock(0, false, '')

      return {
        options: bscrollOptions,
        scrollBehaviorX,
        scrollBehaviorY,
        actionsHandler,
        animater,
        directionLockAction,
        moved: false,
        enabled: true,
        startTime: 0,
        endTime: 0,
        getCurrentPos: jest.fn(),
        refresh: jest.fn(),
        destroy: jest.fn(),
        hooks: new EventEmitter([
          'start',
          'beforeMove',
          'scrollStart',
          'scroll',
          'beforeEnd',
          'end',
          'scrollEnd'
        ])
      }
    }
  )

export default ScrollerActions
