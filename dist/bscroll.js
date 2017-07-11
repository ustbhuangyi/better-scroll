/*!
 * better-scroll v0.4.0
 * (c) 2016-2017 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.BScroll = factory());
}(this, (function () { 'use strict';

var elementStyle = document.createElement('div').style;

var vendor = function () {
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
}();

function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

function addEvent(el, type, fn, capture) {
  el.addEventListener(type, fn, { passive: false, capture: !!capture });
}

function removeEvent(el, type, fn, capture) {
  el.removeEventListener(type, fn, !!capture);
}

function offset(el) {
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
}

var transform = prefixStyle('transform');

var hasPerspective = prefixStyle('perspective') in elementStyle;
var hasTouch = 'ontouchstart' in window;
var hasTransform = transform !== false;
var hasTransition = prefixStyle('transition') in elementStyle;

var style = {
  transform: transform,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd')
};

var TOUCH_EVENT$1 = 1;
var MOUSE_EVENT = 2;
var eventType = {
  touchstart: TOUCH_EVENT$1,
  touchmove: TOUCH_EVENT$1,
  touchend: TOUCH_EVENT$1,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
};

function getRect(el) {
  if (el instanceof window.SVGElement) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }
}

function preventDefaultException(el, exceptions) {
  for (var i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true;
    }
  }
  return false;
}

function tap(e, eventName) {
  var ev = document.createEvent('Event');
  ev.initEvent(eventName, true, true);
  ev.pageX = e.pageX;
  ev.pageY = e.pageY;
  e.target.dispatchEvent(ev);
}

function click(e) {
  var target = e.target;

  if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
    var ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
    ev.initEvent('click', true, true);
    ev._constructed = true;
    target.dispatchEvent(ev);
  }
}

function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
}

function before(el, target) {
  target.parentNode.insertBefore(el, target);
}

function extend(target, source) {
	for (var key in source) {
		target[key] = source[key];
	}
}

var DEFAULT_INTERVAL = 100 / 60;

var requestAnimationFrame = function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
	// if all else fails, use setTimeout
	function (callback) {
		return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
	};
}();

var cancelAnimationFrame = function () {
	return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
		window.clearTimeout(id);
	};
}();

var isBadAndroid = /Android /.test(window.navigator.appVersion) && !/Chrome\/\d/.test(window.navigator.appVersion);

var ease = {
	// easeOutQuint
	swipe: {
		style: 'cubic-bezier(0.23, 1, 0.32, 1)',
		fn: function fn(t) {
			return 1 + --t * t * t * t * t;
		}
	},
	// easeOutQuard
	swipeBounce: {
		style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		fn: function fn(t) {
			return t * (2 - t);
		}
	},
	// easeOutQuart
	bounce: {
		style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
		fn: function fn(t) {
			return 1 - --t * t * t * t;
		}
	}
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var EventEmitter = function () {
	function EventEmitter() {
		classCallCheck(this, EventEmitter);

		this._events = {};
	}

	createClass(EventEmitter, [{
		key: "on",
		value: function on(type, fn) {
			var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

			if (!this._events[type]) {
				this._events[type] = [];
			}

			this._events[type].push([fn, context]);
		}
	}, {
		key: "once",
		value: function once(type, fn) {
			var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

			var fired = false;

			function magic() {
				this.off(type, magic);

				if (!fired) {
					fired = true;
					fn.apply(context, arguments);
				}
			}

			this.on(type, magic);
		}
	}, {
		key: "off",
		value: function off(type, fn) {
			var _events = this._events[type];
			if (!_events) {
				return;
			}

			var count = _events.length;
			while (count--) {
				if (_events[count][0] === fn) {
					_events[count][0] = undefined;
				}
			}
		}
	}, {
		key: "trigger",
		value: function trigger(type) {
			var events = this._events[type];
			if (!events) {
				return;
			}

			var len = events.length;
			var eventsCopy = [].concat(toConsumableArray(events));
			for (var i = 0; i < len; i++) {
				var event = eventsCopy[i];

				var _event = slicedToArray(event, 2),
				    fn = _event[0],
				    context = _event[1];

				if (fn) {
					fn.apply(context, [].slice.call(arguments, 1));
				}
			}
		}
	}]);
	return EventEmitter;
}();

function momentum(current, start, time, lowerMargin, wrapperSize, options) {
	var distance = current - start;
	var speed = Math.abs(distance) / time;

	var deceleration = options.deceleration,
	    itemHeight = options.itemHeight,
	    swipeBounceTime = options.swipeBounceTime,
	    bounceTime = options.bounceTime;

	var duration = options.swipeTime;
	var rate = options.wheel ? 4 : 15;

	var destination = current + speed / deceleration * (distance < 0 ? -1 : 1);

	if (options.wheel && itemHeight) {
		destination = Math.round(destination / itemHeight) * itemHeight;
	}

	if (destination < lowerMargin) {
		destination = wrapperSize ? lowerMargin - wrapperSize / rate * speed : lowerMargin;
		duration = swipeBounceTime - bounceTime;
	} else if (destination > 0) {
		destination = wrapperSize ? wrapperSize / rate * speed : 0;
		duration = swipeBounceTime - bounceTime;
	}

	return {
		destination: Math.round(destination),
		duration: duration
	};
}

var TOUCH_EVENT = 1;

var BScroll$1 = function (_EventEmitter) {
  inherits(BScroll, _EventEmitter);

  function BScroll(el, options) {
    classCallCheck(this, BScroll);

    var _this = possibleConstructorReturn(this, (BScroll.__proto__ || Object.getPrototypeOf(BScroll)).call(this));

    _this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
    _this.scroller = _this.wrapper.children[0];
    // cache style for better performance
    _this.scrollerStyle = _this.scroller.style;

    _this.options = {
      startX: 0,
      startY: 0,
      scrollY: true,
      directionLockThreshold: 5,
      momentum: true,
      bounce: true,
      selectedIndex: 0,
      rotate: 25,
      wheel: false,
      snap: false,
      snapLoop: false,
      snapThreshold: 0.1,
      swipeTime: 2500,
      bounceTime: 700,
      adjustTime: 400,
      swipeBounceTime: 1200,
      deceleration: 0.001,
      momentumLimitTime: 300,
      momentumLimitDistance: 15,
      resizePolling: 60,
      preventDefault: true,
      preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
      },
      HWCompositing: true,
      useTransition: true,
      useTransform: true
    };

    extend(_this.options, options);

    _this.translateZ = _this.options.HWCompositing && hasPerspective ? ' translateZ(0)' : '';

    _this.options.useTransition = _this.options.useTransition && hasTransition;
    _this.options.useTransform = _this.options.useTransform && hasTransform;

    _this.options.eventPassthrough = _this.options.eventPassthrough === true ? 'vertical' : _this.options.eventPassthrough;
    _this.options.preventDefault = !_this.options.eventPassthrough && _this.options.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    _this.options.scrollX = _this.options.eventPassthrough === 'horizontal' ? false : _this.options.scrollX;
    _this.options.scrollY = _this.options.eventPassthrough === 'vertical' ? false : _this.options.scrollY;

    // With eventPassthrough we also need lockDirection mechanism
    _this.options.freeScroll = _this.options.freeScroll && !_this.options.eventPassthrough;
    _this.options.directionLockThreshold = _this.options.eventPassthrough ? 0 : _this.options.directionLockThreshold;

    if (_this.options.tap === true) {
      _this.options.tap = 'tap';
    }

    _this._init();

    if (_this.options.snap) {
      _this._initSnap();
    }

    _this.refresh();

    if (!_this.options.snap) {
      _this.scrollTo(_this.options.startX, _this.options.startY);
    }

    _this.enable();
    return _this;
  }

  createClass(BScroll, [{
    key: '_init',
    value: function _init() {
      this.x = 0;
      this.y = 0;
      this.directionX = 0;
      this.directionY = 0;

      this._addEvents();
    }
  }, {
    key: '_initSnap',
    value: function _initSnap() {
      var _this2 = this;

      this.currentPage = {};

      if (this.options.snapLoop) {
        var children = this.scroller.children;
        if (children.length > 0) {
          prepend(children[children.length - 1].cloneNode(true), this.scroller);
          this.scroller.appendChild(children[1].cloneNode(true));
        }
      }

      if (typeof this.options.snap === 'string') {
        this.options.snap = this.scroller.querySelectorAll(this.options.snap);
      }

      this.on('refresh', function () {
        _this2.pages = [];

        if (!_this2.wrapperWidth || !_this2.wrapperHeight || !_this2.scrollerWidth || !_this2.scrollerHeight) {
          return;
        }

        var stepX = _this2.options.snapStepX || _this2.wrapperWidth;
        var stepY = _this2.options.snapStepY || _this2.wrapperHeight;

        var x = 0;
        var y = void 0;
        var cx = void 0;
        var cy = void 0;
        var i = 0;
        var l = void 0;
        var m = 0;
        var n = void 0;
        var el = void 0;
        var rect = void 0;
        if (_this2.options.snap === true) {
          cx = Math.round(stepX / 2);
          cy = Math.round(stepY / 2);

          while (x > -_this2.scrollerWidth) {
            _this2.pages[i] = [];
            l = 0;
            y = 0;

            while (y > -_this2.scrollerHeight) {
              _this2.pages[i][l] = {
                x: Math.max(x, _this2.maxScrollX),
                y: Math.max(y, _this2.maxScrollY),
                width: stepX,
                height: stepY,
                cx: x - cx,
                cy: y - cy
              };

              y -= stepY;
              l++;
            }

            x -= stepX;
            i++;
          }
        } else {
          el = _this2.options.snap;
          l = el.length;
          n = -1;

          for (; i < l; i++) {
            rect = getRect(el[i]);
            if (i === 0 || rect.left <= getRect(el[i - 1]).left) {
              m = 0;
              n++;
            }

            if (!_this2.pages[m]) {
              _this2.pages[m] = [];
            }

            x = Math.max(-rect.left, _this2.maxScrollX);
            y = Math.max(-rect.top, _this2.maxScrollY);
            cx = x - Math.round(rect.width / 2);
            cy = y - Math.round(rect.height / 2);

            _this2.pages[m][n] = {
              x: x,
              y: y,
              width: rect.width,
              height: rect.height,
              cx: cx,
              cy: cy
            };

            if (x > _this2.maxScrollX) {
              m++;
            }
          }
        }

        var initPage = _this2.options.snapLoop ? 1 : 0;
        _this2.goToPage(_this2.currentPage.pageX || initPage, _this2.currentPage.pageY || 0, 0);

        // Update snap threshold if needed
        if (_this2.options.snapThreshold % 1 === 0) {
          _this2.snapThresholdX = _this2.options.snapThreshold;
          _this2.snapThresholdY = _this2.options.snapThreshold;
        } else {
          _this2.snapThresholdX = Math.round(_this2.pages[_this2.currentPage.pageX][_this2.currentPage.pageY].width * _this2.options.snapThreshold);
          _this2.snapThresholdY = Math.round(_this2.pages[_this2.currentPage.pageX][_this2.currentPage.pageY].height * _this2.options.snapThreshold);
        }
      });

      this.on('scrollEnd', function () {
        if (_this2.options.snapLoop) {
          if (_this2.currentPage.pageX === 0) {
            _this2.goToPage(_this2.pages.length - 2, _this2.currentPage.pageY, 0);
          }
          if (_this2.currentPage.pageX === _this2.pages.length - 1) {
            _this2.goToPage(1, _this2.currentPage.pageY, 0);
          }
        }
      });

      this.on('flick', function () {
        var time = _this2.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(_this2.x - _this2.startX), 1000), Math.min(Math.abs(_this2.y - _this2.startY), 1000)), 300);

        _this2.goToPage(_this2.currentPage.pageX + _this2.directionX, _this2.currentPage.pageY + _this2.directionY, time);
      });
    }
  }, {
    key: '_nearestSnap',
    value: function _nearestSnap(x, y) {
      if (!this.pages.length) {
        return { x: 0, y: 0, pageX: 0, pageY: 0 };
      }

      var i = 0;
      // Check if we exceeded the snap threshold
      if (Math.abs(x - this.absStartX) <= this.snapThresholdX && Math.abs(y - this.absStartY) <= this.snapThresholdY) {
        return this.currentPage;
      }

      if (x > 0) {
        x = 0;
      } else if (x < this.maxScrollX) {
        x = this.maxScrollX;
      }

      if (y > 0) {
        y = 0;
      } else if (y < this.maxScrollY) {
        y = this.maxScrollY;
      }

      var l = this.pages.length;
      for (; i < l; i++) {
        if (x >= this.pages[i][0].cx) {
          x = this.pages[i][0].x;
          break;
        }
      }

      l = this.pages[i].length;

      var m = 0;
      for (; m < l; m++) {
        if (y >= this.pages[0][m].cy) {
          y = this.pages[0][m].y;
          break;
        }
      }

      if (i === this.currentPage.pageX) {
        i += this.directionX;

        if (i < 0) {
          i = 0;
        } else if (i >= this.pages.length) {
          i = this.pages.length - 1;
        }

        x = this.pages[i][0].x;
      }

      if (m === this.currentPage.pageY) {
        m += this.directionY;

        if (m < 0) {
          m = 0;
        } else if (m >= this.pages[0].length) {
          m = this.pages[0].length - 1;
        }

        y = this.pages[0][m].y;
      }

      return {
        x: x,
        y: y,
        pageX: i,
        pageY: m
      };
    }
  }, {
    key: '_addEvents',
    value: function _addEvents() {
      var eventOperation = addEvent;
      this._handleEvents(eventOperation);
    }
  }, {
    key: '_removeEvents',
    value: function _removeEvents() {
      var eventOperation = removeEvent;
      this._handleEvents(eventOperation);
    }
  }, {
    key: '_handleEvents',
    value: function _handleEvents(eventOperation) {
      var target = this.options.bindToWrapper ? this.wrapper : window;
      eventOperation(window, 'orientationchange', this);
      eventOperation(window, 'resize', this);

      if (this.options.click) {
        eventOperation(this.wrapper, 'click', this);
      }

      if (!this.options.disableMouse) {
        eventOperation(this.wrapper, 'mousedown', this);
        eventOperation(target, 'mousemove', this);
        eventOperation(target, 'mousecancel', this);
        eventOperation(target, 'mouseup', this);
      }

      if (hasTouch && !this.options.disableTouch) {
        eventOperation(this.wrapper, 'touchstart', this);
        eventOperation(target, 'touchmove', this);
        eventOperation(target, 'touchcancel', this);
        eventOperation(target, 'touchend', this);
      }

      eventOperation(this.scroller, style.transitionEnd, this);
    }
  }, {
    key: '_start',
    value: function _start(e) {
      var _eventType = eventType[e.type];
      if (_eventType !== TOUCH_EVENT) {
        if (e.button !== 0) {
          return;
        }
      }
      if (!this.enabled || this.destroyed || this.initiated && this.initiated !== _eventType) {
        return;
      }
      this.initiated = _eventType;

      if (this.options.preventDefault && !isBadAndroid && !preventDefaultException(e.target, this.options.preventDefaultException)) {
        e.preventDefault();
      }

      this.moved = false;
      this.distX = 0;
      this.distY = 0;
      this.directionX = 0;
      this.directionY = 0;
      this.directionLocked = 0;

      this._transitionTime();
      this.startTime = +new Date();

      if (this.options.wheel) {
        this.target = e.target;
      }

      if (this.options.useTransition && this.isInTransition) {
        this.isInTransition = false;
        var pos = this.getComputedPosition();
        this._translate(pos.x, pos.y);
        if (this.options.wheel) {
          this.target = this.items[Math.round(-pos.y / this.itemHeight)];
        } else {
          this.trigger('scrollEnd', {
            x: this.x,
            y: this.y
          });
        }
      }

      var point = e.touches ? e.touches[0] : e;

      this.startX = this.x;
      this.startY = this.y;
      this.absStartX = this.x;
      this.absStartY = this.y;
      this.pointX = point.pageX;
      this.pointY = point.pageY;

      this.trigger('beforeScrollStart');
    }
  }, {
    key: '_move',
    value: function _move(e) {
      if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
        return;
      }

      if (this.options.preventDefault) {
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

      var timestamp = +new Date();

      // We need to move at least 15 pixels for the scrolling to initiate
      if (timestamp - this.endTime > this.options.momentumLimitTime && absDistY < this.options.momentumLimitDistance && absDistX < this.options.momentumLimitDistance) {
        return;
      }

      // If you are scrolling in one direction lock the other
      if (!this.directionLocked && !this.options.freeScroll) {
        if (absDistX > absDistY + this.options.directionLockThreshold) {
          this.directionLocked = 'h'; // lock horizontally
        } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
          this.directionLocked = 'v'; // lock vertically
        } else {
          this.directionLocked = 'n'; // no lock
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

      // Slow down or stop if outside of the boundaries
      if (newX > 0 || newX < this.maxScrollX) {
        if (this.options.bounce) {
          newX = this.x + deltaX / 3;
        } else {
          newX = newX > 0 ? 0 : this.maxScrollX;
        }
      }
      if (newY > 0 || newY < this.maxScrollY) {
        if (this.options.bounce) {
          newY = this.y + deltaY / 3;
        } else {
          newY = newY > 0 ? 0 : this.maxScrollY;
        }
      }

      // this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
      // this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

      if (!this.moved) {
        this.moved = true;
        this.trigger('scrollStart');
      }

      this._translate(newX, newY);

      if (timestamp - this.startTime > this.options.momentumLimitTime) {
        this.startTime = timestamp;
        this.startX = this.x;
        this.startY = this.y;

        if (this.options.probeType === 1) {
          this.trigger('scroll', {
            x: this.x,
            y: this.y
          });
        }
      }

      if (this.options.probeType > 1) {
        this.trigger('scroll', {
          x: this.x,
          y: this.y
        });
      }

      var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

      var pX = this.pointX - scrollLeft;
      var pY = this.pointY - scrollTop;

      if (pX > document.documentElement.clientWidth - this.options.momentumLimitDistance || pX < this.options.momentumLimitDistance || pY < this.options.momentumLimitDistance || pY > document.documentElement.clientHeight - this.options.momentumLimitDistance) {
        this._end(e);
      }
    }
  }, {
    key: '_end',
    value: function _end(e) {
      if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
        return;
      }
      this.initiated = false;

      if (this.options.preventDefault && !preventDefaultException(e.target, this.options.preventDefaultException)) {
        e.preventDefault();
      }

      this.trigger('touchend', {
        x: this.x,
        y: this.y
      });

      // reset if we are outside of the boundaries
      if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
        return;
      }
      this.isInTransition = false;
      // ensures that the last position is rounded
      var newX = Math.round(this.x);
      var newY = Math.round(this.y);

      // we scrolled less than 15 pixels
      if (!this.moved) {
        if (this.options.wheel) {
          if (this.target && this.target.className === 'wheel-scroll') {
            var index = Math.abs(Math.round(newY / this.itemHeight));
            var _offset = Math.round((this.pointY + offset(this.target).top - this.itemHeight / 2) / this.itemHeight);
            this.target = this.items[index + _offset];
          }
          this.scrollToElement(this.target, this.options.adjustTime, true, true, ease.swipe);
        } else {
          if (this.options.tap) {
            tap(e, this.options.tap);
          }

          if (this.options.click) {
            click(e);
          }
        }
        this.trigger('scrollCancel');
        return;
      }

      this.scrollTo(newX, newY);

      var deltaX = newX - this.absStartX;
      var deltaY = newY - this.absStartY;
      this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
      this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

      this.endTime = +new Date();

      var duration = this.endTime - this.startTime;
      var absDistX = Math.abs(newX - this.startX);
      var absDistY = Math.abs(newY - this.startY);

      // fastclick
      if (this._events.flick && duration < this.options.momentumLimitTime && absDistX < this.options.momentumLimitDistance && absDistY < this.options.momentumLimitDistance) {
        this.trigger('flick');
        return;
      }

      var time = 0;
      // start momentum animation if needed
      if (this.options.momentum && duration < this.options.momentumLimitTime && (absDistY > this.options.momentumLimitDistance || absDistX > this.options.momentumLimitDistance)) {
        var momentumX = this.hasHorizontalScroll ? momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options) : { destination: newX, duration: 0 };
        var momentumY = this.hasVerticalScroll ? momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options) : { destination: newY, duration: 0 };
        newX = momentumX.destination;
        newY = momentumY.destination;
        time = Math.max(momentumX.duration, momentumY.duration);
        this.isInTransition = 1;
      } else {
        if (this.options.wheel) {
          newY = Math.round(newY / this.itemHeight) * this.itemHeight;
          time = this.options.adjustTime;
        }
      }

      var easing = ease.swipe;
      if (this.options.snap) {
        var snap = this._nearestSnap(newX, newY);
        this.currentPage = snap;
        time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
        newX = snap.x;
        newY = snap.y;

        this.directionX = 0;
        this.directionY = 0;
        easing = ease.bounce;
      }

      if (newX !== this.x || newY !== this.y) {
        // change easing function when scroller goes out of the boundaries
        if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
          easing = ease.swipeBounce;
        }
        this.scrollTo(newX, newY, time, easing);
        return;
      }

      if (this.options.wheel) {
        this.selectedIndex = Math.abs(this.y / this.itemHeight) | 0;
      }
      this.trigger('scrollEnd', {
        x: this.x,
        y: this.y
      });
    }
  }, {
    key: '_resize',
    value: function _resize() {
      var _this3 = this;

      if (!this.enabled) {
        return;
      }

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(function () {
        _this3.refresh();
      }, this.options.resizePolling);
    }
  }, {
    key: '_startProbe',
    value: function _startProbe() {
      cancelAnimationFrame(this.probeTimer);
      this.probeTimer = requestAnimationFrame(probe);

      var me = this;

      function probe() {
        var pos = me.getComputedPosition();
        me.trigger('scroll', pos);
        if (me.isInTransition) {
          me.probeTimer = requestAnimationFrame(probe);
        }
      }
    }
  }, {
    key: '_transitionTime',
    value: function _transitionTime() {
      var _this4 = this;

      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.scrollerStyle[style.transitionDuration] = time + 'ms';

      if (this.options.wheel && !isBadAndroid) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].style[style.transitionDuration] = time + 'ms';
        }
      }

      if (!time && isBadAndroid) {
        this.scrollerStyle[style.transitionDuration] = '0.001s';

        requestAnimationFrame(function () {
          if (_this4.scrollerStyle[style.transitionDuration] === '0.0001ms') {
            _this4.scrollerStyle[style.transitionDuration] = '0s';
          }
        });
      }
    }
  }, {
    key: '_transitionTimingFunction',
    value: function _transitionTimingFunction(easing) {
      this.scrollerStyle[style.transitionTimingFunction] = easing;

      if (this.options.wheel && !isBadAndroid) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].style[style.transitionTimingFunction] = easing;
        }
      }
    }
  }, {
    key: '_transitionEnd',
    value: function _transitionEnd(e) {
      if (e.target !== this.scroller || !this.isInTransition) {
        return;
      }

      this._transitionTime();
      if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
        this.isInTransition = false;
        this.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        });
      }
    }
  }, {
    key: '_translate',
    value: function _translate(x, y) {
      if (this.options.useTransform) {
        this.scrollerStyle[style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
      } else {
        x = Math.round(x);
        y = Math.round(y);
        this.scrollerStyle.left = x + 'px';
        this.scrollerStyle.top = y + 'px';
      }

      if (this.options.wheel && !isBadAndroid) {
        for (var i = 0; i < this.items.length; i++) {
          var deg = this.options.rotate * (y / this.itemHeight + i);
          this.items[i].style[style.transform] = 'rotateX(' + deg + 'deg)';
        }
      }

      this.x = x;
      this.y = y;
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.enabled = true;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.enabled = false;
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      /* eslint-disable no-unused-vars */
      var rf = this.wrapper.offsetHeight;

      this.wrapperWidth = parseInt(this.wrapper.style.width) || this.wrapper.clientWidth;
      this.wrapperHeight = parseInt(this.wrapper.style.height) || this.wrapper.clientHeight;

      this.scrollerWidth = parseInt(this.scroller.style.width) || this.scroller.clientWidth;
      this.scrollerHeight = parseInt(this.scroller.style.height) || this.scroller.clientHeight;
      if (this.options.wheel) {
        this.items = this.scroller.children;
        this.options.itemHeight = this.itemHeight = this.items.length ? this.items[0].clientHeight : 0;
        if (this.selectedIndex === undefined) {
          this.selectedIndex = this.options.selectedIndex;
        }
        this.options.startY = -this.selectedIndex * this.itemHeight;
        this.maxScrollX = 0;
        this.maxScrollY = -this.itemHeight * (this.items.length - 1);
      } else {
        this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
        this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
      }

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
      this.directionX = 0;
      this.directionY = 0;
      this.wrapperOffset = offset(this.wrapper);

      this.trigger('refresh');

      this.resetPosition();
    }
  }, {
    key: 'resetPosition',
    value: function resetPosition() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var easeing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ease.bounce;

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

      if (x === this.x && y === this.y) {
        return false;
      }

      this.scrollTo(x, y, time, easeing);

      return true;
    }
  }, {
    key: 'wheelTo',
    value: function wheelTo(selectIndex) {
      if (this.options.wheel) {
        this.y = -selectIndex * this.itemHeight;
        this.scrollTo(0, this.y);
      }
    }
  }, {
    key: 'scrollBy',
    value: function scrollBy(x, y) {
      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ease.bounce;

      x = this.x + x;
      y = this.y + y;

      this.scrollTo(x, y, time, easing);
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(x, y, time) {
      var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ease.bounce;

      this.isInTransition = this.options.useTransition && time > 0 && (x !== this.x || y !== this.y);

      if (!time || this.options.useTransition) {
        this._transitionTimingFunction(easing.style);
        this._transitionTime(time);
        this._translate(x, y);

        if (time && this.options.probeType === 3) {
          this._startProbe();
        }

        if (this.options.wheel) {
          if (y > 0) {
            this.selectedIndex = 0;
          } else if (y < this.maxScrollY) {
            this.selectedIndex = this.items.length - 1;
          } else {
            this.selectedIndex = Math.abs(y / this.itemHeight) | 0;
          }
        }
      }
    }
  }, {
    key: 'getSelectedIndex',
    value: function getSelectedIndex() {
      return this.options.wheel && this.selectedIndex;
    }
  }, {
    key: 'getCurrentPage',
    value: function getCurrentPage() {
      return this.options.snap && this.currentPage;
    }
  }, {
    key: 'scrollToElement',
    value: function scrollToElement(el, time, offsetX, offsetY, easing) {
      if (!el) {
        return;
      }
      el = el.nodeType ? el : this.scroller.querySelector(el);

      if (this.options.wheel && el.className !== 'wheel-item') {
        return;
      }

      var pos = offset(el);
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

      if (this.options.wheel) {
        pos.top = Math.round(pos.top / this.itemHeight) * this.itemHeight;
      }

      time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

      this.scrollTo(pos.left, pos.top, time, easing);
    }
  }, {
    key: 'getComputedPosition',
    value: function getComputedPosition() {
      var matrix = window.getComputedStyle(this.scroller, null);
      var x = void 0;
      var y = void 0;

      if (this.options.useTransform) {
        matrix = matrix[style.transform].split(')')[0].split(', ');
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
    }
  }, {
    key: 'goToPage',
    value: function goToPage(x, y, time) {
      var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ease.bounce;

      if (x >= this.pages.length) {
        x = this.pages.length - 1;
      } else if (x < 0) {
        x = 0;
      }

      if (y >= this.pages[x].length) {
        y = this.pages[x].length - 1;
      } else if (y < 0) {
        y = 0;
      }

      var posX = this.pages[x][y].x;
      var posY = this.pages[x][y].y;

      time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;

      this.currentPage = {
        x: posX,
        y: posY,
        pageX: x,
        pageY: y
      };
      this.scrollTo(posX, posY, time, easing);
    }
  }, {
    key: 'next',
    value: function next(time, easing) {
      var x = this.currentPage.pageX;
      var y = this.currentPage.pageY;

      x++;
      if (x >= this.pages.length && this.hasVerticalScroll) {
        x = 0;
        y++;
      }

      this.goToPage(x, y, time, easing);
    }
  }, {
    key: 'prev',
    value: function prev(time, easing) {
      var x = this.currentPage.pageX;
      var y = this.currentPage.pageY;

      x--;
      if (x < 0 && this.hasVerticalScroll) {
        x = 0;
        y--;
      }

      this.goToPage(x, y, time, easing);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._removeEvents();

      this.destroyed = true;
      this.trigger('destroy');
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'touchstart':
        case 'mousedown':
          this._start(e);
          break;
        case 'touchmove':
        case 'mousemove':
          this._move(e);
          break;
        case 'touchend':
        case 'mouseup':
        case 'touchcancel':
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
          if (this.enabled && !e._constructed && !/(SELECT|INPUT|TEXTAREA)/i.test(e.target.tagName)) {
            e.preventDefault();
            e.stopPropagation();
          }
          break;
      }
    }
  }]);
  return BScroll;
}(EventEmitter);

BScroll$1.Version = '0.4.0';

return BScroll$1;

})));
