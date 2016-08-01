export class EventEmitter {
	constructor() {
		this._events = {};
	}

	on(type, fn, context = this) {
		if (!this._events[type]) {
			this._events[type] = [];
		}

		this._events[type].push([fn, context]);
	}

	once(type, fn, context = this) {
		let fired = false;

		function magic() {
			this.off(type, magic);

			if (!fired) {
				fired = true;
				fn.apply(context, arguments);
			}
		}

		this.on(type, magic);
	}

	off(type, fn) {
		let _events = this._events[type];
		if (!_events) {
			return;
		}

		let count = _events.length;
		while (count--) {
			if (_events[count][0] === fn) {
				_events[count][0] = undefined;
			}
		}
	}

	trigger(type) {
		let events = this._events[type];
		if (!events) {
			return;
		}

		let len = events.length;
		let eventsCopy = [...events];
		for (let i = 0; i < len; i++) {
			let event = eventsCopy[i];
			let [fn, context] = event;
			if (fn) {
				fn.apply(context, [].slice.call(arguments, 1));
			}
		}
	}
}

