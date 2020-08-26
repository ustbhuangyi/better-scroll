import {
  TouchEvent,
  // dom
  preventDefaultExceptionFn,
  tagExceptionFn,
  eventTypeMap,
  EventType,
  MouseButton,
  EventRegister,
  EventEmitter
} from '@better-scroll/shared-utils'

type Exception = {
  tagName?: RegExp
  className?: RegExp
}

export interface Options {
  [key: string]: boolean | number | Exception
  click: boolean
  bindToWrapper: boolean
  disableMouse: boolean
  disableTouch: boolean
  preventDefault: boolean
  stopPropagation: boolean
  preventDefaultException: Exception
  tagException: Exception
  autoEndDistance: number
}

export default class ActionsHandler {
  hooks: EventEmitter
  initiated: number
  pointX: number
  pointY: number
  wrapperEventRegister: EventRegister
  targetEventRegister: EventRegister
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
    const { bindToWrapper, disableMouse, disableTouch, click } = this.options
    const wrapper = this.wrapper
    const target = bindToWrapper ? wrapper : window
    const wrapperEvents = []
    const targetEvents = []
    const shouldRegisterTouch = !disableTouch
    const shouldRegisterMouse = !disableMouse

    if (click) {
      wrapperEvents.push({
        name: 'click',
        handler: this.click.bind(this),
        capture: true
      })
    }

    if (shouldRegisterTouch) {
      wrapperEvents.push({
        name: 'touchstart',
        handler: this.start.bind(this)
      })

      targetEvents.push(
        {
          name: 'touchmove',
          handler: this.move.bind(this)
        },
        {
          name: 'touchend',
          handler: this.end.bind(this)
        },
        {
          name: 'touchcancel',
          handler: this.end.bind(this)
        }
      )
    }

    if (shouldRegisterMouse) {
      wrapperEvents.push({
        name: 'mousedown',
        handler: this.start.bind(this)
      })

      targetEvents.push(
        {
          name: 'mousemove',
          handler: this.move.bind(this)
        },
        {
          name: 'mouseup',
          handler: this.end.bind(this)
        }
      )
    }
    this.wrapperEventRegister = new EventRegister(wrapper, wrapperEvents)
    this.targetEventRegister = new EventRegister(target, targetEvents)
  }

  private beforeHandler(e: TouchEvent, type: 'start' | 'move' | 'end') {
    const {
      preventDefault,
      stopPropagation,
      preventDefaultException
    } = this.options

    const preventDefaultConditions = {
      start: () => {
        return (
          preventDefault &&
          !preventDefaultExceptionFn(e.target, preventDefaultException)
        )
      },
      end: () => {
        return (
          preventDefault &&
          !preventDefaultExceptionFn(e.target, preventDefaultException)
        )
      },
      move: () => {
        return preventDefault
      }
    }
    if (preventDefaultConditions[type]()) {
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

    // if textarea or other html tags in options.tagException is manipulated
    // do not make bs scroll
    if (tagExceptionFn(e.target, this.options.tagException)) {
      this.setInitiated()
      return
    }

    // only allow mouse left button
    if (_eventType === EventType.Mouse && e.button !== MouseButton.Left) return

    if (this.hooks.trigger(this.hooks.eventTypes.beforeStart, e)) {
      return
    }

    this.beforeHandler(e, 'start')

    let point = (e.touches ? e.touches[0] : e) as Touch
    this.pointX = point.pageX
    this.pointY = point.pageY

    this.hooks.trigger(this.hooks.eventTypes.start, e)
  }

  private move(e: TouchEvent) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return
    }

    this.beforeHandler(e, 'move')

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

    // auto end when out of viewport
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

    const autoEndDistance = this.options.autoEndDistance
    if (
      pX > document.documentElement.clientWidth - autoEndDistance ||
      pY > document.documentElement.clientHeight - autoEndDistance ||
      pX < autoEndDistance ||
      pY < autoEndDistance
    ) {
      this.end(e)
    }
  }
  private end(e: TouchEvent) {
    if (eventTypeMap[e.type] !== this.initiated) {
      return
    }
    this.setInitiated()

    this.beforeHandler(e, 'end')

    this.hooks.trigger(this.hooks.eventTypes.end, e)
  }

  private click(e: TouchEvent) {
    this.hooks.trigger(this.hooks.eventTypes.click, e)
  }

  destroy() {
    this.wrapperEventRegister.destroy()
    this.targetEventRegister.destroy()
    this.hooks.destroy()
  }
}
