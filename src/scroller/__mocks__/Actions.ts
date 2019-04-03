import Behavior from '@/scroller/Behavior'
import ActionsHandler from '@/base/ActionsHandler'
import createAnimater from '@/animater/index'
import Translater from '@/translater'
import DirectionLock from '@/scroller/DirectionLock'

jest.mock('@/scroller/Behavior')
jest.mock('@/base/ActionsHandler')
jest.mock('@/animater/index')
jest.mock('@/translater')
jest.mock('@/scroller/DirectionLock')

import EventEmitter from '@/base/EventEmitter'
import EventRegister from '@/base/EventRegister'

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
