interface EventsMap {
  [name: string]: Array<any>[]
}

export default class EventEmitter {
  _events: EventsMap

  constructor() {
    this._events = {}
  }

  on(type: string, fn: Function, context = this) {
    if (!this._events[type]) {
      this._events[type] = []
    }

    this._events[type].push([fn, context])
    return this
  }

  once(type: string, fn: Function, context = this) {
    const magic = (...args: any[]) => {
      this.off(type, magic)

      fn.apply(context, args)
    }
    magic.fn = fn

    this.on(type, magic)
    return this
  }

  off(type: string, fn: Function) {
    let _events = this._events[type]
    if (!_events) {
      return this
    }

    let count = _events.length
    while (count--) {
      if (
        _events[count][0] === fn ||
        (_events[count][0] && _events[count][0].fn === fn)
      ) {
        _events.splice(count, 1)
      }
    }

    return this
  }

  trigger(type: string, ...args: any[]) {
    let events = this._events[type]
    if (!events) {
      return this
    }

    let len = events.length
    let eventsCopy = [...events]
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i]
      let [fn, context] = event
      if (fn) {
        fn.apply(context, args)
      }
    }

    return this
  }
}
