(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);
	var Timeline = __webpack_require__(2);

	var TOUCH_EVENT = 1;

	(function (window, document, Math) {


		function BScroll(el, options) {
			this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
			this.scroller = this.wrapper.children[0];
			// cache style for better performance
			this.scrollerStyle = this.scroller.style;

			this.options = {
				startX: 0,
				startY: 0,
				scrollY: true,
				directionLockThreshold: 5,
				momentum: true,

				bounce: true,

				swipeTime: 3000,
				bounceTime: 600,
				swipeBounceTime: 1200,

				preventDefault: true,
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
				},

				HWCompositing: true,
				useTransition: true,
				useTransform: true

			};

			_.extend(this.options, options);

			this.translateZ = this.options.HWCompositing && _.hasPerspective ? ' translateZ(0)' : '';

			this.options.useTransition = this.options.useTransition && _.hasTransition;
			this.options.useTransform = this.options.useTransform && _.hasTransform;

			this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
			this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

			// If you want eventPassthrough I have to lock one of the axes
			this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;
			this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;

			// With eventPassthrough we also need lockDirection mechanism
			this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
			this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

			//TODO easing fn?
			//this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? _.ease[this.options.bounceEasing] || _.ease.circular : this.options.bounceEasing;

			this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

			if (this.options.tap === true) {
				this.options.tap = 'tap';
			}

			this._init();

			this.refresh();

			this.scrollTo(this.options.startX, this.options.startY);

			this.enable();

		}

		BScroll.prototype = {
			version: '0.0.11',

			_init: function () {

				this.x = 0;
				this.y = 0;
				//this.directionX = 0;
				//this.directionY = 0;

				this._events = {};

				this._addEvents();
			},
			_addEvents: function () {
				var eventOperation = _.addEvent;
				this._handleEvents(eventOperation);
			},
			_removeEvents: function () {
				var eventOperation = _.removeEvent;
				this._handleEvents(eventOperation);
			},
			_handleEvents: function (eventOperation) {

				var target = this.options.bindToWrapper ? this.wrapper : window;

				eventOperation(window, 'orientationchange', this);
				eventOperation(window, 'resize', this);

				if (this.options.click) {
					eventOperation(this.wrapper, 'click', this, true);
				}

				if (!this.options.disableMouse) {
					eventOperation(this.wrapper, 'mousedown', this);
					eventOperation(target, 'mousemove', this);
					eventOperation(target, 'mousecancel', this);
					eventOperation(target, 'mouseup', this);
				}

				if (_.hasPointer && !this.options.disablePointer) {
					eventOperation(this.wrapper, _.prefixPointerEvent('pointerdown'), this);
					eventOperation(target, _.prefixPointerEvent('pointermove'), this);
					eventOperation(target, _.prefixPointerEvent('pointercancel'), this);
					eventOperation(target, _.prefixPointerEvent('pointerup'), this);
				}

				if (_.hasTouch && !this.options.disableTouch) {

					eventOperation(this.wrapper, 'touchstart', this);
					eventOperation(target, 'touchmove', this);
					eventOperation(target, 'touchcancel', this);
					eventOperation(target, 'touchend', this);
				}

				eventOperation(this.scroller, _.style.transitionEnd, this);
			},
			_start: function (e) {
				var eventType = _.eventType[e.type];
				if (eventType !== TOUCH_EVENT) {
					if (e.button !== 0)
						return;
				}

				if (!this.enabled || (this.initiated && this.initiated !== eventType))
					return;

				this.initiated = eventType;

				if (this.options.preventDefault && !_.isBadAndroid
					&& !_.preventDefaultException(e.target, this.options.preventDefaultException)) {
					e.preventDefault();
				}

				this.moved = false;
				this.distX = 0;
				this.distY = 0;
				//this.directionX = 0;
				//this.directionY = 0;
				this.directionLocked = 0;

				this._transitionTime();

				this.startTime = +new Date;

				if (this.options.useTransition && this.isInTransition) {
					this.isInTransition = false;
					var pos = this.getComputedPosition();
					this._translate(Math.round(pos.x), Math.round(pos.y));
					this._trigger('scrollEnd');
				} else if (!this.options.useTransition && this.isAnimating) {
					this.isAnimating = false;
					this._trigger('scrollEnd');
				}

				var point = e.touches ? e.touches[0] : e;

				this.startX = this.x;
				this.startY = this.y;
				//this.absStartX = this.x;
				//this.absStartY = this.y;
				this.pointX = point.pageX;
				this.pointY = point.pageY;

				this._trigger('beforeScrollStart');
			},
			_move: function (e) {
				if (!this.enabled || _.eventType[e.type] !== this.initiated)
					return;

				if (this.options.preventDefault) {
					//TODO increase Android performance
					e.preventDefault();
				}

				var point = e.touches ? e.touches[0] : e;
				var deltaX = point.pageX - this.pointX;
				var deltaY = point.pageY - this.pointY;

				this.pointX = point.pageX;
				this.pointY = point.pageY;

				this.distX += deltaX;
				this.distY += deltaY;

				var absDistX = Math.abs(this.distX);
				var absDistY = Math.abs(this.distY);

				var timestamp = +new Date;

				// We need to move at least 10 pixels for the scrolling to initiate
				if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10))
					return;

				// If you are scrolling in one direction lock the other
				if (!this.directionLocked && !this.options.freeScroll) {
					if (absDistX > absDistY + this.options.directionLockThreshold) {
						this.directionLocked = 'h';		// lock horizontally
					} else if (absDistY >= absDistX + this.options.directionLockThreshold) {
						this.directionLocked = 'v';		// lock vertically
					} else {
						this.directionLocked = 'n';		// no lock
					}
				}

				if (this.directionLocked === 'h') {
					if (this.options.eventPassthrough === 'vertical') {
						e.preventDefault();
					} else if (this.options.eventPassthrough === 'horizontal') {
						this.initiated = false;
						return;
					}

					deltaY = 0;
				} else if (this.directionLocked === 'v') {
					if (this.options.eventPassthrough === 'horizontal') {
						e.preventDefault();
					} else if (this.options.eventPassthrough === 'vertical') {
						this.initiated = false;
						return;
					}

					deltaX = 0;
				}

				deltaX = this.hasHorizontalScroll ? deltaX : 0;
				deltaY = this.hasVerticalScroll ? deltaY : 0;

				var newX = this.x + deltaX;
				var newY = this.y + deltaY;

				// Slow down if outside of the boundaries
				if (newX > 0 || newX < this.maxScrollX) {
					newX = this.x + deltaX / 3;
				}
				if (newY > 0 || newY < this.maxScrollY) {
					newY = this.y + deltaY / 3;
				}

				//this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
				//this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

				if (!this.moved) {
					this.moved = true;
					this._trigger('scrollStart');
				}

				this._translate(newX, newY);

				if (timestamp - this.startTime > 300) {
					this.startTime = timestamp;
					this.startX = this.x;
					this.startY = this.y;
				}

				var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
				var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

				var pX = this.pointX - scrollLeft;
				var pY = this.pointY - scrollTop;

				if (pX > document.documentElement.clientWidth - 10 || pX < 10
					|| pY < 10 || pY > document.documentElement.clientHeight - 10
				) {
					this._end(e);
				}
			},
			_end: function (e) {
				if (!this.enabled || _.eventType[e.type] !== this.initiated)
					return;
				this.initiated = false;

				if (this.options.preventDefault && !_.preventDefaultException(e.target, this.options.preventDefaultException)) {
					e.preventDefault();
				}

				// reset if we are outside of the boundaries
				if (this.resetPosition(this.options.bounceTime, _.ease.bounce)) {
					return;
				}

				// we scrolled less than 10 pixels
				if (!this.moved) {
					if (this.options.tap) {
						_.tap(e, this.options.tap);
					}

					if (this.options.click) {
						_.click(e);
					}

					this._trigger('scrollCancel');
					return;
				}

				this.isInTransition = false;
				this.endTime = +new Date;

				// ensures that the last position is rounded
				var newX = Math.round(this.x);
				var newY = Math.round(this.y);

				this.scrollTo(newX, newY);

				var duration = this.endTime - this.startTime;
				var absDistX = Math.abs(newX - this.startX);
				var absDistY = Math.abs(newY - this.startY);

				//fastclick
				if (this._events.flick && duration < 200 && absDistX < 10 && absDistY < 10) {
					this._trigger('flick');
					return;
				}

				var time = 0;
				// start momentum animation if needed
				if (this.options.momentum && duration < 300) {
					var momentumX = this.hasHorizontalScroll ? _.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options)
						: {destination: newX, duration: 0};
					var momentumY = this.hasVerticalScroll ? _.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options)
						: {destination: newY, duration: 0};
					newX = momentumX.destination;
					newY = momentumY.destination;
					time = Math.max(momentumX.duration, momentumY.duration);
					this.isInTransition = 1;
				}

				var easing = _.ease.swipe;
				if (newX !== this.x || newY !== this.y) {
					// change easing function when scroller goes out of the boundaries
					if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
						easing = _.ease.swipeBounce;
					}
					this.scrollTo(newX, newY, time, easing);
					return;
				}

				this._trigger('scrollEnd');
			},
			_resize: function () {
				var me = this;

				clearTimeout(this.resizeTimeout);

				this.resizeTimeout = setTimeout(function () {
					me.refresh();
				}, this.options.resizePolling);
			},
			_trigger: function (type) {
				var events = this._events[type];
				if (!events)
					return;

				for (var i = 0; i < events.length; i++) {
					events[i].apply(this, [].slice.call(arguments, 1));
				}
			},
			_transitionTime: function (time) {
				time = time || 0;

				this.scrollerStyle[_.style.transitionDuration] = time + 'ms';

				if (!time && _.isBadAndroid) {
					this.scrollerStyle[_.style.transitionDuration] = '0.001s';
				}
			},
			_transitionTimingFunction: function (easing) {
				this.scrollerStyle[_.style.transitionTimingFunction] = easing;
			},
			_transitionEnd: function (e) {
				if (e.target !== this.scroller || !this.isInTransition) {
					return;
				}

				this._transitionTime();
				if (!this.resetPosition(this.options.bounceTime, _.ease.bounce)) {
					this.isInTransition = false;
					this._trigger('scrollEnd');
				}
			},
			_translate: function (x, y) {
				if (this.options.useTransform) {
					this.scrollerStyle[_.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
				} else {
					x = Math.round(x);
					y = Math.round(y);
					this.scrollerStyle.left = x + 'px';
					this.scrollerStyle.top = y + 'px';
				}

				this.x = x;
				this.y = y;
			},
			_animate: function (destX, destY, duration, easingFn) {
				var startX = this.x;
				var startY = this.y;
				var me = this;
				var timeline = new Timeline();

				timeline.onenterframe = function (time) {
					if (!me.isAnimating) {
						this.stop();
						return;
					}

					if (time > duration) {
						me.isAnimating = false;
						me._translate(destX, destY);

						if (!me.resetPosition(me.options.bounceTime, _.ease.bounce)) {
							me._trigger('scrollEnd');
						}
						this.stop();
						return;
					}
					var now = time / duration;
					var easing = easingFn(now);

					var newX = ( destX - startX ) * easing + startX;
					var newY = ( destY - startY ) * easing + startY;
					me._translate(newX, newY);
				};

				this.isAnimating = true;
				timeline.start();
			},
			enable: function () {
				this.enabled = true;
			},
			disable: function () {
				this.enabled = false;
			},
			on: function (type, fn) {
				if (!this._events[type]) {
					this._events[type] = [];
				}

				this._events[type].push(fn);
			},
			off: function (type, fn) {
				var _events = this._events[type];
				if (!_events) {
					return;
				}

				var count = _events.length;

				while (count--) {
					if (_events[count] === fn) {
						_events[count] = undefined;
					}
				}
			},
			refresh: function () {
				//force reflow
				var rf = this.wrapper.offsetHeight;

				this.wrapperWidth = parseInt(this.wrapper.style.width) || this.wrapper.clientWidth;
				this.wrapperHeight = parseInt(this.wrapper.style.height) || this.wrapper.clientHeight;

				this.scrollerWidth = parseInt(this.scroller.style.width) || this.scroller.clientWidth;
				this.scrollerHeight = parseInt(this.scroller.style.height) || this.scroller.clientHeight;

				this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
				this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

				this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
				this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

				if (!this.hasHorizontalScroll) {
					this.maxScrollX = 0;
					this.scrollerWidth = this.wrapperWidth;
				}

				if (!this.hasVerticalScroll) {
					this.maxScrollY = 0;
					this.scrollerHeight = this.wrapperHeight;
				}

				this.endTime = 0;
				//this.directionX = 0;
				//this.directionY = 0;

				this.wrapperOffset = _.offset(this.wrapper);

				this._trigger('refresh');

				this.resetPosition();
			},
			resetPosition: function (time, easeing) {
				time = time || 0;

				var x = this.x;
				if (!this.hasHorizontalScroll || x > 0) {
					x = 0;
				} else if (x < this.maxScrollX) {
					x = this.maxScrollX;
				}

				var y = this.y;
				if (!this.hasVerticalScroll || y > 0) {
					y = 0;
				} else if (y < this.maxScrollY) {
					y = this.maxScrollY;
				}

				if (x === this.x && y === this.y)
					return false;

				this.scrollTo(x, y, time, easeing);

				return true;

			},
			scrollBy: function (x, y, time, easing) {
				x = this.x + x;
				y = this.y + y;
				time = time || 0;

				this.scrollTo(x, y, time, easing);
			},
			scrollTo: function (x, y, time, easing) {

				easing = easing || _.ease.bounce;

				this.isInTransition = this.options.useTransition && time > 0;

				if (!time || (this.options.useTransition && easing.style)) {
					this._transitionTimingFunction(easing.style);
					this._transitionTime(time);
					this._translate(x, y);
				} else {
					this._animate(x, y, time, easing.fn);
				}
			},
			scrollToElement: function (el, time, offsetX, offsetY, easing) {
				el = el.nodeType ? el : this.scroller.querySelector(el);

				if (!el)
					return;

				var pos = _.offset(el);

				pos.left -= this.wrapperOffset.left;
				pos.top -= this.wrapperOffset.top;

				// if offsetX/Y are true we center the element to the screen
				if (offsetX === true) {
					offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
				}
				if (offsetY === true) {
					offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
				}

				pos.left -= offsetX || 0;
				pos.top -= offsetY || 0;

				pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
				pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

				time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

				this.scrollTo(pos.left, pos.top, time, easing);
			},
			getComputedPosition: function () {
				var matrix = window.getComputedStyle(this.scroller, null);
				var x;
				var y;

				if (this.options.useTransform) {
					matrix = matrix[_.style.transform].split(')')[0].split(', ');
					x = +(matrix[12] || matrix[4]);
					y = +(matrix[13] || matrix[5]);
				} else {
					x = +matrix.left.replace(/[^-\d.]/g, '');
					y = +matrix.top.replace(/[^-\d.]/g, '');
				}

				return {
					x: x,
					y: y
				};
			},
			destroy: function () {
				this._removeEvents();

				this._trigger('destroy');
			},
			handleEvent: function (e) {
				switch (e.type) {
					case 'touchstart':
					case 'pointerdown':
					case 'MSPointerDown':
					case 'mousedown':
						this._start(e);
						break;
					case 'touchmove':
					case 'pointermove':
					case 'MSPointerMove':
					case 'mousemove':
						this._move(e);
						break;
					case 'touchend':
					case 'pointerup':
					case 'MSPointerUp':
					case 'mouseup':
					case 'touchcancel':
					case 'pointercancel':
					case 'MSPointerCancel':
					case 'mousecancel':
						this._end(e);
						break;
					case 'orientationchange':
					case 'resize':
						this._resize();
						break;
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'MSTransitionEnd':
						this._transitionEnd(e);
						break;
					case 'click':
						if (!e._constructed) {
							e.preventDefault();
							e.stopPropagation();
						}
						break;
				}
			}
		};

		BScroll.utils = _;

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = BScroll;
		}
		else if (true) {
			return BScroll;
		}
		else {
			window.BScroll = BScroll;
		}

	})(window, document, Math);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _ = module.exports;

	var TOUCH_EVENT = 1;
	var MOUSE_EVENT = 2;
	var POINTER_EVENT = 3;

	var elementStyle = document.createElement('div').style;

	var vendor = (function () {

		var transformNames = {
			webkit: 'webkitTransform',
			Moz: 'MozTransform',
			O: 'OTransform',
			ms: 'msTransform',
			standard: 'transform'
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var requestAnimationFrame,
		cancelAnimationFrame,
		startTimeline,
		DEFAULT_INTERVAL = 1000 / 60;

	function Timeline() {
		this.animationHandler = 0;
	}

	Timeline.prototype.onenterframe = function (time) {
		// body...
	};

	Timeline.prototype.start = function (interval) {
		var me = this;
		me.interval = interval || DEFAULT_INTERVAL;
		startTimeline(me, +new Date())
	};

	Timeline.prototype.restart = function () {
		// body...
		var me = this;

		if (!me.dur || !me.interval) return;

		me.stop();
		startTimeline(me, +new Date() - me.dur);
	};

	Timeline.prototype.stop = function () {
		if (this.startTime) {
			this.dur = +new Date() - this.startTime;
		}
		cancelAnimationFrame(this.animationHandler);
	};

	requestAnimationFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
				// if all else fails, use setTimeout
			function (callback) {
				return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
			};
	})();

	// handle multiple browsers for cancelAnimationFrame()
	cancelAnimationFrame = (function () {
		return window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			function (id) {
				window.clearTimeout(id);
			};
	})();

	startTimeline = function(timeline, startTime) {
		var lastTick = +new Date();

		timeline.startTime = startTime;
		nextTick.interval = timeline.interval;
		nextTick();

		function nextTick() {
			var now = +new Date();

			timeline.animationHandler = requestAnimationFrame(nextTick);

			if (now - lastTick >= timeline.interval) {
				timeline.onenterframe(now - startTime);
				lastTick = now;
			}
		}
	};

	module.exports = Timeline;

/***/ }
/******/ ])
});
;