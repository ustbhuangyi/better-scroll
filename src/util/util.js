'use strict';

var _ = module.exports;

var TOUCH_EVENT = 1;
var MOUSE_EVENT = 2;
var POINTER_EVENT = 3;

var elementStyle = document.createElement('div').style;

var vendor = (function () {

	var transformNames = {
		standard: 'transform',
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		ms: 'msTransform'
	};

	for (var key in transformNames) {
		if (elementStyle[transformNames[key]] !== undefined) {
			return key;
		}
	}

	return false;
})();

function prefixStyle(style) {
	if (vendor === false)
		return false;

	if (vendor === 'standard') {
		return style;
	}

	return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

_.extend = function (target, obj) {
	for (var key in obj) {
		target[key] = obj[key];
	}
};

_.addEvent = function (el, type, fn, capture) {
	el.addEventListener(type, fn, !!capture);
};

_.removeEvent = function (el, type, fn, capture) {
	el.removeEventListener(type, fn, !!capture);
};

_.hasClass = function (el, className) {
	var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
	return reg.test(el.className);
};

_.addClass = function (el, className) {
	if (_.hasClass(el, className))
		return;

	var newClass = el.className.split(' ');
	newClass.push(className);
	el.className = newClass.join(' ');
};

_.removeClass = function (el, className) {
	if (!_.hasClass(el, className))
		return;

	var reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
	el.className = el.className.replace(reg, ' ');
};

_.offset = function (el) {
	var left = 0;
	var top = 0;

	while (el) {
		left -= el.offsetLeft;
		top -= el.offsetTop;
		el = el.offsetParent;
	}

	return {
		left: left,
		top: top
	};
};

_.prefixPointerEvent = function (pointerEvent) {
	return window.MSPointerEvent ?
	'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) :
		pointerEvent;
};

_.preventDefaultException = function (el, exceptions) {
	for (var i in exceptions) {
		if (exceptions[i].test(el)) {
			return true;
		}
	}

	return false;
};

_.tap = function (e, eventName) {
	var ev = document.createEvent('Event');
	ev.initEvent(eventName, true, true);
	ev.pageX = e.pageX;
	ev.pageY = e.pageY;
	e.target.dispatchEvent(ev);
};

_.click = function (e) {
	var target = e.target;

	if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
		var ev = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: e.view,
			screenX: target.screenX,
			screenY: target.screenY,
			clientX: target.clientX,
			clientY: target.clientY,
			ctrlKey: e.ctrlKey,
			altKey: e.altKey,
			shiftKey: e.shiftKey,
			metaKey: e.metaKey
		});
		e._constructed = true;
		target.dispatchEvent(ev);
	}

};

_.momentum = function (current, start, time, lowerMargin, wrapperSize, options) {
	var distance = current - start;
	var speed = Math.abs(distance) / time;

	var deceleration = options.deceleration || 0.001;
	var duration = options.swipeTime || 2500;

	var destination = current + speed / deceleration * ( distance < 0 ? -1 : 1 );

	if (destination < lowerMargin) {
		destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
		duration = (options.swipeBounceTime || 1000) - (options.bounceTime || 400);
		//distance = Math.abs(destination - current);
	} else if (destination > 0) {
		destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
		duration = (options.swipeBounceTime || 1000) - (options.bounceTime || 400);
		//distance = Math.abs(current) + destination;
	}

	return {
		destination: Math.round(destination),
		duration: duration
	};
};


// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
_.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

var transform = prefixStyle('transform');


_.extend(_, {
	hasTransform: transform !== false,
	hasPerspective: prefixStyle('perspective') in elementStyle,
	hasTouch: 'ontouchstart' in window,
	// IE10 is prefixed
	hasPointer: window.PointerEvent || window.MSPointerEvent,
	hasTransition: prefixStyle('transition') in elementStyle
});

_.style = {};

_.extend(_.style, {
	transform: transform,
	transitionTimingFunction: prefixStyle('transitionTimingFunction'),
	transitionDuration: prefixStyle('transitionDuration'),
	transitionDelay: prefixStyle('transitionDelay'),
	transformOrigin: prefixStyle('transformOrigin'),
	transitionEnd: prefixStyle('transitionEnd')
});

_.eventType = {};

_.extend(_.eventType, {
	touchstart: TOUCH_EVENT,
	touchmove: TOUCH_EVENT,
	touchend: TOUCH_EVENT,

	mousedown: MOUSE_EVENT,
	mousemove: MOUSE_EVENT,
	mouseup: MOUSE_EVENT,

	pointerdown: POINTER_EVENT,
	pointermove: POINTER_EVENT,
	pointerup: POINTER_EVENT,

	MSPointerDown: POINTER_EVENT,
	MSPointerMove: POINTER_EVENT,
	MSPointerUp: POINTER_EVENT
});

_.ease = {};

_.extend(_.ease, {
	//easeOutQuint
	swipe: {
		style: 'cubic-bezier(0.23, 1, 0.32, 1)',
		fn: function (t) {
			return 1 + ( --t * t * t * t * t);
		}
	},
	//easeOutQuard
	swipeBounce: {
		style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		fn: function (t) {
			return t * (2 - t);
		}
	},
	//easeOutQuart
	bounce: {
		style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
		fn: function (t) {
			return 1 - ( --t * t * t * t);
		}
	}
});
