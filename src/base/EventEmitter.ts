import { warn } from '../util/debug'

interface EventsMap {
  [name: string]: [Function, Object][]
}

interface TypesMap {
  [type: string]: string
}

export default class EventEmitter {
  _events: EventsMap
  eventTypes: TypesMap
  constructor(names: string[]) {
    this._events = {}
    this.eventTypes = {}
    this.registerType(names)
  }

  on(type: string, fn: Function, context = this) {
    this._checkInTypes(type)
    if (!this._events[type]) {
      this._events[type] = []
    }

    this._events[type].push([fn, context])
    return this
  }

  once(type: string, fn: Function, context = this) {
    this._checkInTypes(type)
    const magic = (...args: any[]) => {
      this.off(type, magic)

      fn.apply(context, args)
    }
    magic.fn = fn

    this.on(type, magic)
    return this
  }

  off(type: string, fn: Function) {
    this._checkInTypes(type)
    let _events = this._events[type]
    if (!_events) {
      return this
    }

    let count = _events.length
    while (count--) {
      if (
        _events[count][0] === fn ||
        (_events[count][0] && (_events[count][0] as any).fn === fn)
      ) {
        _events.splice(count, 1)
      }
    }

    return this
  }

  trigger(type: string, ...args: any[]) {
    this._checkInTypes(type)
    let events = this._events[type]
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
