import { eventMixin } from './scroll/event'
import { initMixin } from './scroll/init'
import { coreMixin } from './scroll/core'
import { snapMixin } from './scroll/snap'
import { wheelMixin } from './scroll/wheel'
import { scrollbarMixin } from './scroll/scrollbar'
import { pullDownMixin } from './scroll/pulldown'
import { pullUpMixin } from './scroll/pullup'
import { mouseWheelMixin } from './scroll/mouse-wheel'
import { zoomMixin } from './scroll/zoom'
import { infiniteMixin } from './scroll/inifinity'

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

initMixin(BScroll)
coreMixin(BScroll)
eventMixin(BScroll)
snapMixin(BScroll)
wheelMixin(BScroll)
scrollbarMixin(BScroll)
pullDownMixin(BScroll)
pullUpMixin(BScroll)
mouseWheelMixin(BScroll)
zoomMixin(BScroll)
infiniteMixin(BScroll)

BScroll.Version = '1.12.6'

export default BScroll
