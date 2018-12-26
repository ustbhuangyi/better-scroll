import { initGlobalAPI } from './global-api'
import { eventMixin } from './scroll/event'
import { initMixin } from './scroll/init'
import { coreMixin } from './scroll/core'

import { warn } from './util/debug'

function BScroll(el, options) {
  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
  if (!this.wrapper) {
    warn('Can not resolve the wrapper DOM.')
  }
  this.scroller = this.wrapper.children[0]
  if (!this.scroller) {
    warn('The wrapper need at least one child element to be scroller.')
  }
  // cache style for better performance
  this.scrollerStyle = this.scroller.style

  this._init(el, options)
}

initGlobalAPI(BScroll)
initMixin(BScroll)
coreMixin(BScroll)
eventMixin(BScroll)

BScroll.Version = '2.0.0'

export default BScroll
