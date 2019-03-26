import { warn } from '../util/debug'

interface EventsMap {
  [name: string]: [Function, Object][]
}

interface TypesMap {
  [type: string]: string
}

export default class EventEmitter {
  events: EventsMap
  eventTypes: TypesMap
  constructor(names: string[]) {
    this.events = {}
    this.eventTypes = {}
    this.registerType(names)
  }

  on(type: string, fn: Function, context: any = this) {
    this._checkInTypes(type)
    if (!this.events[type]) {
      this.events[type] = []
    }

    this.events[type].push([fn, context])
    return this
  }

  once(type: string, fn: Function, context: any = this) {
    this._checkInTypes(type)
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
      for (let type of Object.keys(this.events)) {
        this.events[type] = []
      }
      return this
    }

    if (type) {
      this._checkInTypes(type)
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
          (events[count][0] && (events[count][0] as any).fn === fn)
        ) {
          events.splice(count, 1)
        }
      }

      return this
    }
  }

  trigger(type: string, ...args: any[]) {
    this._checkInTypes(type)
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
        if (ret === true) break
      }
    }
    return ret
  }
  registerType(names: string[]) {
    names.forEach((type: string) => {
      this.eventTypes[type] = type
    })
  }

  destroy() {
    this.events = {}
  }

  private _checkInTypes(type: string) {
    const types = this.eventTypes
    const inTypes = types[type] === type
    if (!inTypes) {
      warn(
        `EventEmitter has used unknown event type: "${type}", should be oneof ${types}`
      )
    }
  }
}
