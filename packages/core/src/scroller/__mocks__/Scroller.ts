import createAnimater from '@better-scroll/core/src/animater/index'
import Translater from '@better-scroll/core/src/translater'
import Behavior from '@better-scroll/core/src/scroller/Behavior'
import ActionsHandler from '@better-scroll/core/src/base/ActionsHandler'
import Actions from '@better-scroll/core/src/scroller/Actions'

jest.mock('@better-scroll/core/src/animater/index')
jest.mock('@better-scroll/core/src/translater')
jest.mock('@better-scroll/core/src/scroller/Behavior')
jest.mock('@better-scroll/core/src/base/ActionsHandler')
jest.mock('@better-scroll/core/src/scroller/Actions')

import EventEmitter from '@better-scroll/core/src/base/EventEmitter'
import EventRegister from '@better-scroll/core/src/base/EventRegister'

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
      'flick',
      'scrollCancel',
      'momentum',
      'scrollTo',
      'scrollToElement',
      'transitionEnd',
      'checkClick',
      'ignoreDisMoveForSamePos'
    ]),
    scrollBehaviorX,
    scrollBehaviorY,
    resizeRegister: new EventRegister(wrapper, []),
    transitionEndRegister: new EventRegister(wrapper, [])
  }
})

export default Scroller
