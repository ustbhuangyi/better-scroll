import Behavior from '@/scroller/Behavior'
import ActionsHandler from '@/base/ActionsHandler'
import createAnimater from '@/animater/index'
import Translater from '@/translater'
import DirectionLockAction from '@/scroller/DirectionLockAction'

jest.mock('@/scroller/Behavior')
jest.mock('@/base/ActionsHandler')
jest.mock('@/animater/index')
jest.mock('@/translater')
jest.mock('@/scroller/DirectionLockAction')

import EventEmitter from '@/base/EventEmitter'
import EventRegister from '@/base/EventRegister'

const ScrollerActions = jest
  .fn()
  .mockImplementation((wrapper, bscrollOptions) => {
    const content = wrapper.children[0]
    const scrollBehaviorX = new Behavior(
      wrapper,
      Object.assign(bscrollOptions, { scrollable: bscrollOptions.scrollX })
    )
    const scrollBehaviorY = new Behavior(
      wrapper,
      Object.assign(bscrollOptions, { scrollable: bscrollOptions.scrollY })
    )
    const actionsHandler = new ActionsHandler(wrapper, bscrollOptions)
    const translater = new Translater(content)
    const animater = createAnimater(content, translater, bscrollOptions)
    const directionLockAction = new DirectionLockAction(0, false, '')

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
  })

export default ScrollerActions
