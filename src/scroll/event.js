export function eventMixin(BScroll) {
  BScroll.prototype.on = function (type, fn, context = this) {
    if (!this._events[type]) {
      this._events[type] = []
    }

    this._events[type].push([fn, context])
  }

  BScroll.prototype.once = function (type, fn, context = this) {
    let fired = false

    function magic() {
      this.off(type, magic)

      if (!fired) {
        fired = true
        fn.apply(context, arguments)
      }
    }
    // 将参数中的回调函数挂载在magic对象的fn属性上,为了执行off方法的时候，暴露对应的函数方法
    magic.fn = fn

    this.on(type, magic)
  }

  BScroll.prototype.off = function (type, fn) {
    let _events = this._events[type]
    if (!_events) {
      return
    }

    let count = _events.length
    while (count--) {
      // 移除通过on或者once绑定的回调函数
      if (_events[count][0] === fn || (_events[count][0] && _events[count][0].fn === fn)) {
        _events[count][0] = undefined
      }
    }
  }

  BScroll.prototype.trigger = function (type) {
    let events = this._events[type]
    if (!events) {
      return
    }

    let len = events.length
    let eventsCopy = [...events]
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i]
      let [fn, context] = event
      if (fn) {
        fn.apply(context, [].slice.call(arguments, 1))
      }
    }
  }
}
