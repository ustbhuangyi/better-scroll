import EventEmitter from './EventEmitter'
import { EventType, TouchEvent, MouseButton } from '../util'

import {
  // dom
  addEvent,
  removeEvent,
  preventDefaultExceptionFn,
  eventTypeMap
} from '../util'

export interface Options {
  [key: string]: any
  bindToWrapper: boolean
  click: boolean
  disableMouse: boolean
  preventDefault: boolean
  stopPropagation: boolean
  preventDefaultException: {
    tagName?: RegExp
    className?: RegExp
  }
}

export default class ActionsHandler {
  options: Options
  hooks: EventEmitter
  initiated: number | boolean
  wrapper: HTMLElement
  pointX: number
  pointY: number
  constructor(wrapper: HTMLElement, options: Options) {
    this.hooks = new EventEmitter(['start', 'move', 'end'])
    this.wrapper = wrapper
    this.addDOMEvents(options)
  }

  private addDOMEvents(options: Options) {
    const eventOperation = addEvent
    this.handleDOMEvents(eventOperation, options)
  }

  private removeDOMEvents() {
    const eventOperation = removeEvent
    this.handleDOMEvents(eventOperation)
  }

  private handleDOMEvents(eventOperation: Function, options?: Options) {
    const {
      bindToWrapper,
      click,
      disableMouse,
      wrapper,
      scroller
    } = this.options
    const target = bindToWrapper ? wrapper : window
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

    if (disableMouse) {
      eventOperation(wrapper, 'touchstart', this)
      eventOperation(target, 'touchmove', this)
      eventOperation(target, 'touchcancel', this)
      eventOperation(target, 'touchend', this)
    }
  }
  private handleEvent(e: TouchEvent) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this.start(e)
        break
      case 'touchmove':
      case 'mousemove':
        this.move(e)
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        this.end(e)
        break
    }
  }
  private start(e: TouchEvent) {
    const _eventType = eventTypeMap[e.type]

    if (this.initiated && this.initiated !== _eventType) {
      return
    }
    this.initiated = _eventType

    // no mouse left button
    if (_eventType === EventType.Mouse && e.button !== MouseButton.Left) return

    const {
      preventDefault,
      stopPropagation,
      preventDefaultException
    } = this.options
    if (
      preventDefault &&
      !preventDefaultExceptionFn(e.target, preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (stopPropagation) {
      e.stopPropagation()
    }

    let point = (e.touches ? e.touches[0] : e) as Touch

    this.pointX = point.pageX
    this.pointY = point.pageY

    this.hooks.trigger(this.hooks.eventTypes.start, {
      timeStamp: e.timeStamp
    })
  }
  private move(e: TouchEvent) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return
    }

    const {
      preventDefault,
      stopPropagation,
      preventDefaultException
    } = this.options
    if (
      preventDefault &&
      !preventDefaultExceptionFn(e.target, preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (stopPropagation) {
      e.stopPropagation()
    }

    let point = (e.touches ? e.touches[0] : e) as Touch
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY

    this.pointX = point.pageX
    this.pointY = point.pageY

    this.hooks.trigger(this.hooks.eventTypes.move, {
      timeStamp: e.timeStamp,
      deltaX,
      deltaY
    })
  }
  end(e: TouchEvent) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return
    }
    this.initiated = false

    const {
      preventDefault,
      stopPropagation,
      preventDefaultException
    } = this.options
    if (
      preventDefault &&
      !preventDefaultExceptionFn(e.target, preventDefaultException)
    ) {
      e.preventDefault()
    }
    if (stopPropagation) {
      e.stopPropagation()
    }

    this.hooks.trigger(this.hooks.eventTypes.end)
  }
}
