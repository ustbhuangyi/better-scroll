import {
  TouchEvent,
  // dom
  addEvent,
  removeEvent
} from '../util'

interface EventMap {
  name: string
  handler(e: TouchEvent): void
  capture?: boolean
}

export default class EventRegister {
  constructor(public wrapper: HTMLElement | Window, public events: EventMap[]) {
    this.addDOMEvents()
  }

  destroy() {
    this.removeDOMEvents()
    this.events = []
  }

  private addDOMEvents() {
    this.handleDOMEvents(addEvent)
  }

  private removeDOMEvents() {
    this.handleDOMEvents(removeEvent)
  }

  private handleDOMEvents(eventOperation: Function) {
    const wrapper = this.wrapper

    this.events.forEach((event: EventMap) => {
      eventOperation(wrapper, event.name, this, !!event.capture)
    })
  }

  private handleEvent(e: TouchEvent) {
    const eventType = e.type
    this.events.some((event: EventMap) => {
      if (event.name === eventType) {
        event.handler(e)
        return true
      }
      return false
    })
  }
}
