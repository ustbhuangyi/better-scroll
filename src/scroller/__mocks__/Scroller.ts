import createAnimater from '@/animater/index'
import Translater from '@/translater'
import Behavior from '@/scroller/Behavior'

jest.mock('@/animater/index')
jest.mock('@/scroller/Behavior')

import EventEmitter from '@/base/EventEmitter'

const Scroller = jest.fn().mockImplementation((wrapper, bscrollOptions) => {
  const content = wrapper.children[0]
  const translater = new Translater(content)
  const animater = createAnimater(content, translater, bscrollOptions)
  return {
    wrapper,
    content,
    options: bscrollOptions,
    translater,
    animater,
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
      'transitionEnd'
    ]),
    scrollBehaviorX: {},
    scrollBehaviorY: {}
  }
})

export default Scroller
