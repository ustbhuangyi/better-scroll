import EventEmitter from './EventEmitter'
import EventRegister from './EventRegister'

import {
  TouchEvent,
  // dom
  preventDefaultExceptionFn,
  eventTypeMap
} from '@better-scroll/shared-utils'

import { EventType, MouseButton } from '../enums'

type Exception = {
  tagName?: RegExp
  className?: RegExp
}

export interface Options {
  [key: string]: boolean | number | Exception
  click: boolean
  bindToWrapper: boolean
  disableMouse: boolean
  preventDefault: boolean
  stopPropagation: boolean
  preventDefaultException: Exception
  momentumLimitDistance: number
}

export default class ActionsHandler {
  hooks: EventEmitter
  initiated: number
  pointX: number
  pointY: number
  startClickRegister: EventRegister
  moveEndRegister: EventRegister
  constructor(public wrapper: HTMLElement, public options: Options) {
    this.hooks = new EventEmitter([
      'beforeStart',
      'start',
      'move',
      'end',
      'click'
    ])
    this.handleDOMEvents()
  }

  private handleDOMEvents() {
    const { bindToWrapper, disableMouse } = this.options
    const wrapper = this.wrapper
    const target = bindToWrapper ? wrapper : window

    this.startClickRegister = new EventRegister(wrapper, [
      {
        name: disableMouse ? 'touchstart' : 'mousedown',
        handler: this.start.bind(this)
      },
      {
        name: 'click',
        handler: this.click.bind(this),
        capture: true
      }
    ])
    this.moveEndRegister = new EventRegister(target, [
      {
        name: disableMouse ? 'touchmove' : 'mousemove',
        handler: this.move.bind(this)
      },
      {
        name: disableMouse ? 'touchend' : 'mouseup',
        handler: this.end.bind(this)
      },
      {
        name: disableMouse ? 'touchcancel' : 'mouseup',
        handler: this.end.bind(this)
      }
    ])
  }

  private beforeHandler(e: TouchEvent) {
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
  }

  setInitiated(type: number = 0) {
    this.initiated = type
  }

  private start(e: TouchEvent) {
    const _eventType = eventTypeMap[e.type]

    if (this.initiated && this.initiated !== _eventType) {
      return
    }
    this.setInitiated(_eventType)

    // no mouse left button
    if (_eventType === EventType.Mouse && e.button !== MouseButton.Left) return

    if (this.hooks.trigger(this.hooks.eventTypes.beforeStart, e)) {
      return
    }

    this.beforeHandler(e)

    let point = (e.touches ? e.touches[0] : e) as Touch
    this.pointX = point.pageX
    this.pointY = point.pageY

    this.hooks.trigger(this.hooks.eventTypes.start, e)
  }

  private move(e: TouchEvent) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return
    }

    this.beforeHandler(e)

    let point = (e.touches ? e.touches[0] : e) as Touch
    let deltaX = point.pageX - this.pointX
    let deltaY = point.pageY - this.pointY
    this.pointX = point.pageX
    this.pointY = point.pageY

    if (
      this.hooks.trigger(this.hooks.eventTypes.move, {
        deltaX,
        deltaY,
        e
      })
    ) {
      return
    }

    // auto end when out of wrapper
    let scrollLeft =
      document.documentElement.scrollLeft ||
      window.pageXOffset ||
      document.body.scrollLeft
    let scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop

    let pX = this.pointX - scrollLeft
    let pY = this.pointY - scrollTop

    if (
      pX >
        document.documentElement.clientWidth -
          this.options.momentumLimitDistance ||
      pX < this.options.momentumLimitDistance ||
      pY < this.options.momentumLimitDistance ||
      pY >
        document.documentElement.clientHeight -
          this.options.momentumLimitDistance
    ) {
      this.end(e)
    }
  }
  private end(e: TouchEvent) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return
    }
    this.setInitiated()

    this.beforeHandler(e)

    this.hooks.trigger(this.hooks.eventTypes.end, e)
  }

  private click(e: TouchEvent) {
    this.hooks.trigger(this.hooks.eventTypes.click, e)
  }

  destroy() {
    this.startClickRegister.destroy()
    this.moveEndRegister.destroy()
    this.hooks.destroy()
  }
}
