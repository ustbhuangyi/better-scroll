import { warn } from './debug'
import { addEvent, removeEvent } from './dom'

interface Events {
  [name: string]: [WithFnFunction, Object][]
}

interface EventTypes {
  [type: string]: string
}

interface WithFnFunction extends Function {
  fn?: Function
}

export class EventEmitter {
  events: Events
  eventTypes: EventTypes
  constructor(names: string[]) {
    this.events = {}
    this.eventTypes = {}
    this.registerType(names)
  }

  on(type: string, fn: Function, context: Object = this) {
    this.hasType(type)
    if (!this.events[type]) {
      this.events[type] = []
    }

    this.events[type].push([fn, context])
    return this
  }

  once(type: string, fn: Function, context: Object = this) {
    this.hasType(type)
    const magic = (...args: any[]) => {
      this.off(type, magic)

      fn.apply(context, args)
    }
    magic.fn = fn

    this.on(type, magic)
    return this
  }

  off(type?: string, fn?: Function) {
    if (!type && !fn) {
      this.events = {}
      return this
    }

    if (type) {
      this.hasType(type)
      if (!fn) {
        this.events[type] = []
        return this
      }

      let events = this.events[type]
      if (!events) {
        return this
      }

      let count = events.length
      while (count--) {
        if (
          events[count][0] === fn ||
          (events[count][0] && events[count][0].fn === fn)
        ) {
          events.splice(count, 1)
        }
      }

      return this
    }
  }

  trigger(type: string, ...args: any[]) {
    this.hasType(type)
    let events = this.events[type]
    if (!events) {
      return
    }

    let len = events.length
    let eventsCopy = [...events]
    let ret
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i]
      let [fn, context] = event
      if (fn) {
        ret = fn.apply(context, args)
        if (ret === true) {
          return ret
        }
      }
    }
  }
  registerType(names: string[]) {
    names.forEach((type: string) => {
      this.eventTypes[type] = type
    })
  }

  destroy() {
    this.events = {}
    this.eventTypes = {}
  }

  private hasType(type: string) {
    const types = this.eventTypes
    const isType = types[type] === type
    if (!isType) {
      warn(
        `EventEmitter has used unknown event type: "${type}", should be oneof [` +
          `${Object.keys(types).map(_ => JSON.stringify(_))}` +
          `]`
      )
    }
  }
}

interface EventData {
  name: string
  handler(e: UIEvent): void
  capture?: boolean
}

export class EventRegister {
  constructor(
    public wrapper: HTMLElement | Window,
    public events: EventData[]
  ) {
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

    this.events.forEach((event: EventData) => {
      eventOperation(wrapper, event.name, this, !!event.capture)
    })
  }

  private handleEvent(e: UIEvent) {
    const eventType = e.type
    this.events.some((event: EventData) => {
      if (event.name === eventType) {
        event.handler(e)
        return true
      }
      return false
    })
  }
}
