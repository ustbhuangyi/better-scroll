import createAnimater from '../../animater'
import Translater from '../../translater'
import Behavior from '../Behavior'
import ActionsHandler from '../../base/ActionsHandler'
import Actions from '../Actions'

jest.mock('../../animater')
jest.mock('../../translater')
jest.mock('../Behavior')
jest.mock('../../base/ActionsHandler')
jest.mock('../Actions')

import { EventEmitter, EventRegister } from '@better-scroll/shared-utils'

const Scroller = jest.fn().mockImplementation((wrapper, bscrollOptions) => {
  const content = wrapper.children[0]
  const translater = new Translater(content)
  const animater = createAnimater(content, translater, bscrollOptions)
  const actionsHandler = new ActionsHandler(wrapper, bscrollOptions)
  const scrollBehaviorX = new Behavior(
    wrapper,
    Object.assign(bscrollOptions, { scrollable: bscrollOptions.scrollX })
  )
  const scrollBehaviorY = new Behavior(
    wrapper,
    Object.assign(bscrollOptions, { scrollable: bscrollOptions.scrollY })
  )
  const actions = new Actions(
    scrollBehaviorX,
    scrollBehaviorY,
    actionsHandler,
    animater,
    bscrollOptions
  )
  return {
    wrapper,
    content,
    options: bscrollOptions,
    translater,
    animater,
    actionsHandler,
    actions,
    hooks: new EventEmitter([
      'beforeStart',
      'beforeMove',
      'beforeScrollStart',
      'scrollStart',
      'scroll',
      'beforeEnd',
      'scrollEnd',
      'refresh',
      'touchEnd',
      'end',
      'flick',
      'scrollCancel',
      'momentum',
      'scrollTo',
      'scrollToElement',
      'transitionEnd',
      'checkClick',
      'ignoreDisMoveForSamePos',
      'resize'
    ]),
    scrollBehaviorX,
    scrollBehaviorY,
    resizeRegister: new EventRegister(wrapper, []),
    transitionEndRegister: new EventRegister(wrapper, [])
  }
})

export default Scroller
