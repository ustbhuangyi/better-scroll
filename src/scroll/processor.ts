import BScroll from '../index'
import Options from './options'
import {
  hasTouch,
  style,
  addEvent
} from '../util/dom'

export default class Processor {
  options: Options
  constructor (public bscroll: BScroll) {
    this.bscroll = bscroll
    this.options = bscroll.options
  }

  public init () {
    this.handleDOMEvents(addEvent)
  }

  private handleDOMEvents(eventOperation: Function) {
    const {
      wrapper,
      scroller
    } = this.bscroll
    const {
      bindToWrapper,
      click,
      disableMouse,
      disableTouch
    } = this.options
    let target = bindToWrapper ? wrapper : window
    eventOperation(window, 'orientationchange', this)
    eventOperation(window, 'resize', this)

    if (click) {
      eventOperation(wrapper, 'click', this, true)
    }

    if (!disableMouse) {
      eventOperation(wrapper, 'mousedown', this)
      eventOperation(target, 'mousemove', this)
      eventOperation(target, 'mousecancel', this)
      eventOperation(target, 'mouseup', this)
    }

    if (hasTouch && !disableTouch) {
      eventOperation(wrapper, 'touchstart', this)
      eventOperation(target, 'touchmove', this)
      eventOperation(target, 'touchcancel', this)
      eventOperation(target, 'touchend', this)
    }

    eventOperation(scroller, style.transitionEnd, this)
  }
  private handleEvent (e: Event) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e)
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoomStart(e)
        }
        break
      case 'touchmove':
      case 'mousemove':
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoom(e)
        } else {
          this._move(e)
        }
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        if (this.scaled) {
          this._zoomEnd(e)
        } else {
          this._end(e)
        }
        break
      case 'orientationchange':
      case 'resize':
        this._resize()
        break
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e)
        break
      case 'click':
        if (this.enabled && !e._constructed) {
          if (!preventDefaultException(e.target, this.options.preventDefaultException)) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
      case 'wheel':
      case 'DOMMouseScroll':
      case 'mousewheel':
        this._onMouseWheel(e)
        break
    }
  }
}