/*!
 * better-normal-scroll v2.0.0
 * (c) 2016-2019 ustbhuangyi
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function warn(msg) {
    console.error("[BScroll warn]: " + msg);
}

var EventEmitter = /** @class */ (function () {
    function EventEmitter(names) {
        var _this = this;
        this._events = {};
        this.eventTypes = {};
        names.forEach(function (type) {
            _this.eventTypes[type] = type;
        });
    }
    EventEmitter.prototype.on = function (type, fn, context) {
        if (context === void 0) { context = this; }
        this._checkInTypes(type);
        if (!this._events[type]) {
            this._events[type] = [];
        }
        this._events[type].push([fn, context]);
        return this;
    };
    EventEmitter.prototype.once = function (type, fn, context) {
        var _this = this;
        if (context === void 0) { context = this; }
        this._checkInTypes(type);
        var magic = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(type, magic);
            fn.apply(context, args);
        };
        magic.fn = fn;
        this.on(type, magic);
        return this;
    };
    EventEmitter.prototype.off = function (type, fn) {
        this._checkInTypes(type);
        var _events = this._events[type];
        if (!_events) {
            return this;
        }
        var count = _events.length;
        while (count--) {
            if (_events[count][0] === fn ||
                (_events[count][0] && _events[count][0].fn === fn)) {
                _events.splice(count, 1);
            }
        }
        return this;
    };
    EventEmitter.prototype.trigger = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._checkInTypes(type);
        var events = this._events[type];
        if (!events) {
            return;
        }
        var len = events.length;
        var eventsCopy = events.slice();
        var ret;
        for (var i = 0; i < len; i++) {
            var event_1 = eventsCopy[i];
            var fn = event_1[0], context = event_1[1];
            if (fn) {
                var ret_1 = fn.apply(context, args);
                if (ret_1 === true)
                    break;
            }
        }
        return ret;
    };
    EventEmitter.prototype._checkInTypes = function (type) {
        var types = this.eventTypes;
        var inTypes = types[type] === type;
        if (!inTypes) {
            warn("EventEmitter has used unknown event type: \"" + type + "\", should be oneof " + types);
        }
    };
    return EventEmitter;
}());

var Probe;
(function (Probe) {
    Probe[Probe["Default"] = 0] = "Default";
    Probe[Probe["Throttle"] = 1] = "Throttle";
    Probe[Probe["Normal"] = 2] = "Normal";
    Probe[Probe["Realtime"] = 3] = "Realtime";
})(Probe || (Probe = {}));
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Down"] = -1] = "Down";
    Direction[Direction["Right"] = -1] = "Right";
    Direction[Direction["Default"] = 0] = "Default";
})(Direction || (Direction = {}));
var EventType;
(function (EventType) {
    EventType[EventType["Touch"] = 1] = "Touch";
    EventType[EventType["Mouse"] = 2] = "Mouse";
})(EventType || (EventType = {}));
var DirectionLock;
(function (DirectionLock) {
    DirectionLock[DirectionLock["Default"] = 0] = "Default";
    DirectionLock[DirectionLock["Horizontal"] = 1] = "Horizontal";
    DirectionLock[DirectionLock["Vertical"] = 2] = "Vertical";
    DirectionLock[DirectionLock["None"] = 3] = "None";
})(DirectionLock || (DirectionLock = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton || (MouseButton = {}));
var EventPassthrough;
(function (EventPassthrough) {
    EventPassthrough["None"] = "";
    EventPassthrough["Horizontal"] = "horizontal";
    EventPassthrough["Vertical"] = "vertical";
})(EventPassthrough || (EventPassthrough = {}));

// ssr support
var inBrowser = typeof window !== 'undefined';
var ua = inBrowser && navigator.userAgent.toLowerCase();
var isWeChatDevTools = ua && /wechatdevtools/.test(ua);
var isAndroid = ua && ua.indexOf('android') > 0;

function getNow() {
    return window.performance && window.performance.now
        ? window.performance.now() + window.performance.timing.navigationStart
        : +new Date();
}
function extend(target) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < rest.length; i++) {
        var source = rest[i];
        for (var key in source) {
            target[key] = source[key];
        }
    }
    return target;
}
function isUndef(v) {
    return v === undefined || v === null;
}

var elementStyle = (inBrowser && document.createElement('div').style);
var vendor = (function () {
    if (!inBrowser) {
        return false;
    }
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
    if (vendor === false) {
        return false;
    }
    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            return 'transitionend';
        }
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
function addEvent(el, type, fn, capture) {
    el.addEventListener(type, fn, {
        passive: false,
        capture: !!capture
    });
}
function removeEvent(el, type, fn, capture) {
    el.removeEventListener(type, fn, {
        capture: !!capture
    });
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
var cssVendor = vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
var transform = prefixStyle('transform');
var transition = prefixStyle('transition');
var hasPerspective = inBrowser && prefixStyle('perspective') in elementStyle;
// fix issue #361
var hasTouch = inBrowser && ('ontouchstart' in window || isWeChatDevTools);
var hasTransform = transform !== false;
var hasTransition = inBrowser && transition in elementStyle;
var style = {
    transform: transform,
    transition: transition,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd')
};
var eventTypeMap = {
    touchstart: EventType.Touch,
    touchmove: EventType.Touch,
    touchend: EventType.Touch,
    mousedown: EventType.Mouse,
    mousemove: EventType.Mouse,
    mouseup: EventType.Mouse
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
    }
    else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }
}
function preventDefaultExceptionFn(el, exceptions) {
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
function click(e, event) {
    if (event === void 0) { event = 'click'; }
    var eventSource;
    if (e.type === 'mouseup' || e.type === 'mousecancel') {
        eventSource = e;
    }
    else if (e.type === 'touchend' || e.type === 'touchcancel') {
        eventSource = e.changedTouches[0];
    }
    var posSrc = {};
    if (eventSource) {
        posSrc.screenX = eventSource.screenX || 0;
        posSrc.screenY = eventSource.screenY || 0;
        posSrc.clientX = eventSource.clientX || 0;
        posSrc.clientY = eventSource.clientY || 0;
    }
    var ev;
    var bubbles = true;
    var cancelable = true;
    if (typeof MouseEvent !== 'undefined') {
        try {
            ev = new MouseEvent(event, extend({
                bubbles: bubbles,
                cancelable: cancelable
            }, posSrc));
        }
        catch (e) {
            createEvent();
        }
    }
    else {
        createEvent();
    }
    function createEvent() {
        ev = document.createEvent('Event');
        ev.initEvent(event, bubbles, cancelable);
        extend(ev, posSrc);
    }
    // forwardedTouchEvent set to true in case of the conflict with fastclick
    ev.forwardedTouchEvent = true;
    ev._constructed = true;
    e.target.dispatchEvent(ev);
}

var ease = {
    // easeOutQuint
    swipe: {
        style: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fn: function (t) {
            return 1 + --t * t * t * t * t;
        }
    },
    // easeOutQuard
    swipeBounce: {
        style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fn: function (t) {
            return t * (2 - t);
        }
    },
    // easeOutQuart
    bounce: {
        style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        fn: function (t) {
            return 1 - --t * t * t * t;
        }
    }
};

function momentum(current, start, time, lowerMargin, upperMargin, wrapperSize, options) {
    var distance = current - start;
    var speed = Math.abs(distance) / time;
    var deceleration = options.deceleration, itemHeight = options.itemHeight, swipeBounceTime = options.swipeBounceTime, wheel = options.wheel, swipeTime = options.swipeTime;
    var duration = swipeTime;
    var rate = wheel ? 4 : 15;
    var destination = current + (speed / deceleration) * (distance < 0 ? -1 : 1);
    if (wheel && itemHeight) {
        destination = Math.round(destination / itemHeight) * itemHeight;
    }
    if (destination < lowerMargin) {
        destination = wrapperSize
            ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - (wrapperSize / rate) * speed)
            : lowerMargin;
        duration = swipeBounceTime;
    }
    else if (destination > upperMargin) {
        destination = wrapperSize
            ? Math.min(upperMargin + wrapperSize / 4, upperMargin + (wrapperSize / rate) * speed)
            : upperMargin;
        duration = swipeBounceTime;
    }
    return {
        destination: Math.round(destination),
        duration: duration
    };
}

var DEFAULT_INTERVAL = 100 / 60;
var windowCompat = window;
function noop() { }
var requestAnimationFrame = (function () {
    if (!inBrowser) {
        /* istanbul ignore if */
        return noop;
    }
    return (windowCompat.requestAnimationFrame ||
        windowCompat.webkitRequestAnimationFrame ||
        windowCompat.mozRequestAnimationFrame ||
        windowCompat.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
        });
})();
var cancelAnimationFrame = (function () {
    if (!inBrowser) {
        /* istanbul ignore if */
        return noop;
    }
    return (windowCompat.cancelAnimationFrame ||
        windowCompat.webkitCancelAnimationFrame ||
        windowCompat.mozCancelAnimationFrame ||
        windowCompat.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        });
})();

var Options = /** @class */ (function () {
    function Options() {
        this.startX = 0;
        this.startY = 0;
        this.scrollX = false;
        this.scrollY = true;
        this.freeScroll = false;
        this.directionLockThreshold = 5;
        this.eventPassthrough = EventPassthrough.None;
        this.click = false;
        this.tap = '';
        /**
         * support any side
         * bounce: {
         *   top: true,
         *   bottom: true,
         *   left: true,
         *   right: true
         * }
         */
        this.bounce = true;
        this.bounceTime = 800;
        this.momentum = true;
        this.momentumLimitTime = 300;
        this.momentumLimitDistance = 15;
        this.swipeTime = 2500;
        this.swipeBounceTime = 500;
        this.deceleration = 0.0015;
        this.flickLimitTime = 200;
        this.flickLimitDistance = 100;
        this.resizePolling = 60;
        this.probeType = Probe.Default;
        this.stopPropagation = false;
        this.preventDefault = true;
        this.preventDefaultException = {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
        };
        this.HWCompositing = true;
        this.useTransition = true;
        this.useTransform = true;
        this.bindToWrapper = false;
        this.disableMouse = hasTouch;
        this.observeDOM = true;
        this.autoBlur = true;
        // plugins config
        /**
         * for picker
         * wheel: {
         *   selectedIndex: 0,
         *   rotate: 25,
         *   adjustTime: 400
         *   wheelWrapperClass: 'wheel-scroll',
         *   wheelItemClass: 'wheel-item'
         * }
         */
        this.picker = false;
        /**
         * for slide
         * slide: {
         *   loop: false,
         *   el: domEl,
         *   threshold: 0.1,
         *   stepX: 100,
         *   stepY: 100,
         *   speed: 400,
         *   easing: {
         *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
         *     fn: function (t) {
         *       return t * (2 - t)
         *     }
         *   }
         *   listenFlick: true
         * }
         */
        this.slide = false;
        /**
         * for scrollbar
         * scrollbar: {
         *   fade: true,
         *   interactive: false
         * }
         */
        this.scrollbar = false;
        /**
         * for pull down and refresh
         * pullDownRefresh: {
         *   threshold: 50,
         *   stop: 20
         * }
         */
        this.pullDownRefresh = false;
        /**
         * for pull up and load
         * pullUpLoad: {
         *   threshold: 50
         * }
         */
        this.pullUpLoad = false;
        /**
         * for mouse wheel
         * mouseWheel: {
         *   speed: 20,
         *   invert: false,
         *   easeTime: 300
         * }
         */
        this.mouseWheel = false;
        /**
         * for zoom
         * zoom: {
         *   start: 1,
         *   min: 1,
         *   max: 4
         * }
         */
        this.zoom = false;
        /**
         * for infinity
         * infinity: {
         *   render(item, div) {
         *   },
         *   createTombstone() {
         *   },
         *   fetch(count) {
         *   }
         * }
         */
        this.infinity = false;
        /**
         * for double click
         * dblclick: {
         *   delay: 300
         * }
         */
        this.dblclick = false;
    }
    Options.prototype.merge = function (options) {
        if (!options)
            return this;
        for (var key in options) {
            this[key] = options[key];
        }
        return this;
    };
    Options.prototype.process = function () {
        this.translateZ = this.HWCompositing && hasPerspective ? ' translateZ(0)' : '';
        this.useTransition = this.useTransition && hasTransition;
        this.useTransform = this.useTransform && hasTransform;
        this.preventDefault = !this.eventPassthrough && this.preventDefault;
        // If you want eventPassthrough I have to lock one of the axes
        this.scrollX = this.eventPassthrough === 'horizontal' ? false : this.scrollX;
        this.scrollY = this.eventPassthrough === 'vertical' ? false : this.scrollY;
        // With eventPassthrough we also need lockDirection mechanism
        this.freeScroll = this.freeScroll && !this.eventPassthrough;
        this.directionLockThreshold = this.eventPassthrough
            ? 0
            : this.directionLockThreshold;
        return this;
    };
    return Options;
}());

var ActionsHandler = /** @class */ (function () {
    function ActionsHandler(wrapper, options) {
        this.wrapper = wrapper;
        this.options = options;
        this.hooks = new EventEmitter(['start', 'move', 'end']);
        this.addDOMEvents();
    }
    ActionsHandler.prototype.addDOMEvents = function () {
        var eventOperation = addEvent;
        this.handleDOMEvents(eventOperation);
    };
    ActionsHandler.prototype.removeDOMEvents = function () {
        var eventOperation = removeEvent;
        this.handleDOMEvents(eventOperation);
    };
    ActionsHandler.prototype.handleDOMEvents = function (eventOperation) {
        var _a = this.options, bindToWrapper = _a.bindToWrapper, click$$1 = _a.click, disableMouse = _a.disableMouse;
        var wrapper = this.wrapper;
        var target = bindToWrapper ? wrapper : window;
        eventOperation(window, 'orientationchange', this);
        eventOperation(window, 'resize', this);
        if (click$$1) {
            eventOperation(wrapper, 'click', this, true);
        }
        if (!disableMouse) {
            eventOperation(wrapper, 'mousedown', this);
            eventOperation(target, 'mousemove', this);
            eventOperation(target, 'mousecancel', this);
            eventOperation(target, 'mouseup', this);
        }
        if (disableMouse) {
            eventOperation(wrapper, 'touchstart', this);
            eventOperation(target, 'touchmove', this);
            eventOperation(target, 'touchcancel', this);
            eventOperation(target, 'touchend', this);
        }
    };
    ActionsHandler.prototype.handleEvent = function (e) {
        switch (e.type) {
            case 'touchstart':
            case 'mousedown':
                this.start(e);
                break;
            case 'touchmove':
            case 'mousemove':
                this.move(e);
                break;
            case 'touchend':
            case 'mouseup':
            case 'touchcancel':
            case 'mousecancel':
                this.end(e);
                break;
        }
    };
    ActionsHandler.prototype.start = function (e) {
        var _eventType = eventTypeMap[e.type];
        if (this.initiated && this.initiated !== _eventType) {
            return;
        }
        this.initiated = _eventType;
        // no mouse left button
        if (_eventType === EventType.Mouse && e.button !== MouseButton.Left)
            return;
        var _a = this.options, preventDefault = _a.preventDefault, stopPropagation = _a.stopPropagation, preventDefaultException = _a.preventDefaultException;
        if (preventDefault &&
            !preventDefaultExceptionFn(e.target, preventDefaultException)) {
            e.preventDefault();
        }
        if (stopPropagation) {
            e.stopPropagation();
        }
        var point = (e.touches ? e.touches[0] : e);
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        this.hooks.trigger(this.hooks.eventTypes.start, {
            timeStamp: e.timeStamp
        });
    };
    ActionsHandler.prototype.move = function (e) {
        if (eventTypeMap[e.type] !== this.initiated) {
            return;
        }
        var _a = this.options, preventDefault = _a.preventDefault, stopPropagation = _a.stopPropagation, preventDefaultException = _a.preventDefaultException;
        if (preventDefault &&
            !preventDefaultExceptionFn(e.target, preventDefaultException)) {
            e.preventDefault();
        }
        if (stopPropagation) {
            e.stopPropagation();
        }
        var point = (e.touches ? e.touches[0] : e);
        var deltaX = point.pageX - this.pointX;
        var deltaY = point.pageY - this.pointY;
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        if (this.hooks.trigger(this.hooks.eventTypes.move, {
            timeStamp: e.timeStamp,
            deltaX: deltaX,
            deltaY: deltaY,
            e: e,
            actionsHandler: this
        }))
            return;
        // auto end when out of wrapper
        var scrollLeft = document.documentElement.scrollLeft ||
            window.pageXOffset ||
            document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop ||
            window.pageYOffset ||
            document.body.scrollTop;
        var pX = this.pointX - scrollLeft;
        var pY = this.pointY - scrollTop;
        if (pX >
            document.documentElement.clientWidth -
                this.options.momentumLimitDistance ||
            pX < this.options.momentumLimitDistance ||
            pY < this.options.momentumLimitDistance ||
            pY >
                document.documentElement.clientHeight -
                    this.options.momentumLimitDistance) {
            this.end(e);
        }
    };
    ActionsHandler.prototype.end = function (e) {
        if (eventTypeMap[e.type] !== this.initiated) {
            return;
        }
        this.initiated = false;
        var _a = this.options, preventDefault = _a.preventDefault, stopPropagation = _a.stopPropagation, preventDefaultException = _a.preventDefaultException;
        if (preventDefault &&
            !preventDefaultExceptionFn(e.target, preventDefaultException)) {
            e.preventDefault();
        }
        if (stopPropagation) {
            e.stopPropagation();
        }
        this.hooks.trigger(this.hooks.eventTypes.end, e);
    };
    ActionsHandler.prototype.setPointPosition = function (e) {
        var point = (e.touches ? e.touches[0] : e);
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        return point;
    };
    return ActionsHandler;
}());

var Base = /** @class */ (function () {
    function Base(element) {
        this.element = element;
        // cache for better performance
        this.style = element.style;
        this.setUpProps();
    }
    Base.prototype.setScale = function (scale) {
        this.lastScale = isUndef(this.scale) ? scale : this.scale;
        this.scale = scale;
    };
    Base.prototype.updateProps = function (x, y, scale) {
        this.x = x;
        this.y = y;
        this.setScale(scale);
    };
    Base.prototype.setUpProps = function () {
        this.x = 0;
        this.y = 0;
        this.setScale(1);
    };
    return Base;
}());

var Position = /** @class */ (function (_super) {
    __extends(Position, _super);
    function Position(element) {
        return _super.call(this, element) || this;
    }
    Position.prototype.getComputedPosition = function () {
        var cssStyle = window.getComputedStyle(this.element, null);
        var x = +cssStyle.left.replace(/[^-\d.]/g, '');
        var y = +cssStyle.top.replace(/[^-\d.]/g, '');
        return {
            x: x,
            y: y
        };
    };
    Position.prototype.updatePosition = function (x, y, scale) {
        this.style.left = Math.round(x) + "px";
        this.style.top = Math.round(y) + "px";
        this.updateProps(x, y, scale);
    };
    return Position;
}(Base));

var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform(element, options) {
        var _this = _super.call(this, element) || this;
        _this.options = options;
        return _this;
    }
    Transform.prototype.getComputedPosition = function () {
        var cssStyle = window.getComputedStyle(this.element, null);
        var matrix = cssStyle[style.transform].split(')')[0].split(', ');
        var x = +(matrix[12] || matrix[4]);
        var y = +(matrix[13] || matrix[5]);
        return {
            x: x,
            y: y
        };
    };
    Transform.prototype.updatePosition = function (x, y, scale) {
        this.style[style.transform] = "translate(" + x + "px," + y + "px) scale(" + scale + ")" + this.options.translateZ;
        this.updateProps(x, y, scale);
    };
    return Transform;
}(Base));

var Base$1 = /** @class */ (function () {
    function Base(element, translater, options) {
        this.element = element;
        this.translater = translater;
        this.options = options;
        this.hooks = new EventEmitter(['scroll', 'scrollEnd']);
        this.style = element.style;
    }
    Base.prototype.refresh = function (boundaryInfo) {
        var _this = this;
        Object.keys(boundaryInfo).forEach(function (key) {
            _this[key] = boundaryInfo[key];
        });
    };
    Base.prototype.translate = function (x, y, scale) {
        this.translater.updatePosition(x, y, scale);
    };
    Base.prototype._resetPosition = function (time, easing) {
        var x = this.translater.x;
        var roundX = Math.round(x);
        if (!this.hasHorizontalScroll || roundX > this.minScrollX) {
            x = this.minScrollX;
        }
        else if (roundX < this.maxScrollX) {
            x = this.maxScrollX;
        }
        var y = this.translater.y;
        var roundY = Math.round(y);
        if (!this.hasVerticalScroll || roundY > this.minScrollY) {
            y = this.minScrollY;
        }
        else if (roundY < this.maxScrollY) {
            y = this.maxScrollY;
        }
        // in boundary
        if (x === this.translater.x && y === this.translater.y) {
            return false;
        }
        // out of boundary
        this.scrollTo(x, y, time, easing);
        return true;
    };
    Base.prototype.callHooks = function (eventType, pos) {
        pos = isUndef(pos)
            ? {
                x: this.translater.x,
                y: this.translater.y
            }
            : pos;
        this.hooks.trigger(eventType, pos);
    };
    return Base;
}());

var Transition = /** @class */ (function (_super) {
    __extends(Transition, _super);
    function Transition(element, translater, options) {
        return _super.call(this, element, translater, options) || this;
    }
    Transition.prototype.startProbe = function () {
        var _this = this;
        var probe = function () {
            var pos = _this.translater.getComputedPosition();
            _this.callHooks(_this.hooks.eventTypes.scroll, pos);
            // excuted when transition ends
            if (!_this.pending) {
                _this.callHooks(_this.hooks.eventTypes.scrollEnd, pos);
                return;
            }
            _this.timer = requestAnimationFrame(probe);
        };
        cancelAnimationFrame(this.timer);
        this.timer = requestAnimationFrame(probe);
    };
    Transition.prototype.transitionTime = function (time) {
        if (time === void 0) { time = 0; }
        this.style[style.transitionDuration] = time + 'ms';
    };
    Transition.prototype.transitionTimingFunction = function (easing) {
        this.style[style.transitionTimingFunction] = easing;
    };
    Transition.prototype.scrollTo = function (x, y, time, easingFn) {
        this.pending = time > 0;
        this.transitionTimingFunction(easingFn);
        this.transitionTime(time);
        this.translater.updatePosition(x, y, this.translater.scale);
        // TODO when probeType is not Realtime, need to dispatch scroll ?
        if (time && this.options.probeType === Probe.Realtime) {
            this.startProbe();
        }
        // when time is 0
        if (!time) {
            this.callHooks(this.hooks.eventTypes.scroll, {
                x: x,
                y: y
            });
            // force reflow to put everything in position
            this._reflow = document.body.offsetHeight;
            if (!this.resetPosition(this.options.bounceTime)) {
                this.callHooks(this.hooks.eventTypes.scrollEnd);
            }
        }
    };
    Transition.prototype.stop = function () {
        // still in transition
        if (this.pending) {
            this.pending = false;
            cancelAnimationFrame(this.timer);
            var pos = this.translater.getComputedPosition();
            this.transitionTime();
            this.translate(pos.x, pos.y, this.translater.scale);
            this.callHooks(this.hooks.eventTypes.scrollEnd, {
                x: pos.x,
                y: pos.y
            });
            this.forceStopped = true;
        }
    };
    Transition.prototype.resetPosition = function (time, easing) {
        if (time === void 0) { time = 0; }
        if (easing === void 0) { easing = ease.bounce; }
        var easingStyle = easing.style;
        return this._resetPosition(time, easingStyle);
    };
    return Transition;
}(Base$1));

var Animation = /** @class */ (function (_super) {
    __extends(Animation, _super);
    function Animation(element, translater, options) {
        return _super.call(this, element, translater, options) || this;
    }
    Animation.prototype.scrollTo = function (x, y, time, easingFn) {
        // time is 0
        if (!time) {
            this.translater.updatePosition(x, y, this.translater.scale);
            this.hooks.trigger(this.hooks.eventTypes.scroll, {
                x: x,
                y: y
            });
            // force reflow to put everything in position
            this._reflow = document.body.offsetHeight;
            if (!this.resetPosition(this.options.bounceTime)) {
                this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
                    x: this.translater.x,
                    y: this.translater.y
                });
            }
            return;
        }
        this.animate(x, y, time, easingFn);
    };
    Animation.prototype.animate = function (destX, destY, duration, easingFn) {
        var _this = this;
        var startX = this.translater.x;
        var startY = this.translater.y;
        var startScale = this.translater.lastScale;
        var destScale = this.translater.scale;
        var startTime = getNow();
        var destTime = startTime + duration;
        var step = function () {
            var now = getNow();
            if (now >= destTime) {
                _this.pending = false;
                _this.translate(destX, destY, destScale);
                _this.callHooks(_this.hooks.eventTypes.scroll);
                if (!_this.resetPosition(_this.options.bounceTime)) {
                    _this.callHooks(_this.hooks.eventTypes.scrollEnd);
                }
                return;
            }
            now = (now - startTime) / duration;
            var easing = easingFn(now);
            var newX = (destX - startX) * easing + startX;
            var newY = (destY - startY) * easing + startY;
            var newScale = (destScale - startScale) * easing + startScale;
            _this.translate(newX, newY, newScale);
            if (_this.pending) {
                _this.timer = requestAnimationFrame(step);
            }
            if (_this.options.probeType === Probe.Realtime) {
                _this.callHooks(_this.hooks.eventTypes.scroll);
            }
        };
        this.pending = true;
        cancelAnimationFrame(this.timer);
        step();
    };
    Animation.prototype.stop = function () {
        // still in requestFrameAnimation
        var _a = this.translater, x = _a.x, y = _a.y;
        if (this.pending) {
            this.pending = false;
            cancelAnimationFrame(this.timer);
            this.callHooks(this.hooks.eventTypes.scrollEnd, {
                x: x,
                y: y
            });
            this.forceStopped = true;
        }
    };
    Animation.prototype.resetPosition = function (time, easing) {
        if (time === void 0) { time = 0; }
        if (easing === void 0) { easing = ease.bounce; }
        var easingFn = easing.fn;
        return this._resetPosition(time, easingFn);
    };
    return Animation;
}(Base$1));

var Scroller = /** @class */ (function () {
    function Scroller(wrapper, options) {
        var _this = this;
        this.hooks = new EventEmitter([
            'scroll',
            'scrollEnd',
            'refresh',
            'beforeScrollStart',
            'scrollStart',
            'touchEnd',
            'flick',
            'scrollCancel'
        ]);
        this.wrapper = wrapper;
        this.element = wrapper.children[0];
        this.options = options;
        this.translater = this.options.useTransform
            ? new Transform(this.element, {
                translateZ: this.options.translateZ
            })
            : new Position(this.element);
        this.animater = this.options.useTransition
            ? new Transition(this.element, this.translater, {
                probeType: this.options.probeType,
                bounceTime: this.options.bounceTime
            })
            : new Animation(this.element, this.translater, {
                probeType: this.options.probeType,
                bounceTime: this.options.bounceTime
            });
        var actionsHandler = new ActionsHandler(wrapper, this.createActionsHandlerOpt());
        this.enabled = true;
        this.addDOMEvents();
        actionsHandler.hooks.on(actionsHandler.hooks.eventTypes.start, function (_a) {
            var timeStamp = _a.timeStamp;
            if (!_this.enabled)
                return true;
            _this.moved = false;
            _this.directionX = Direction.Default;
            _this.directionY = Direction.Default;
            _this.movingDirectionX = Direction.Default;
            _this.movingDirectionY = Direction.Default;
            _this.directionLocked = DirectionLock.Default;
            _this.startX = _this.translater.x;
            _this.startY = _this.translater.y;
            _this.absStartX = _this.translater.x;
            _this.absStartY = _this.translater.y;
            _this.startTime = timeStamp;
            // force stopping last transition or animation
            _this.animater.stop();
            _this.hooks.trigger(_this.hooks.eventTypes.beforeScrollStart);
        });
        actionsHandler.hooks.on(actionsHandler.hooks.eventTypes.move, function (_a) {
            var timeStamp = _a.timeStamp, deltaX = _a.deltaX, deltaY = _a.deltaY, actionsHandler = _a.actionsHandler, e = _a.e;
            if (!_this.enabled)
                return true;
            var absDistX = Math.abs(deltaX);
            var absDistY = Math.abs(deltaY);
            // We need to move at least momentumLimitDistance pixels for the scrolling to initiate
            if (timeStamp - _this.endTime > _this.options.momentumLimitTime &&
                (absDistY < _this.options.momentumLimitDistance &&
                    absDistX < _this.options.momentumLimitDistance)) {
                return true;
            }
            // If you are scrolling in one direction lock the other
            if (!_this.directionLocked && !_this.options.freeScroll) {
                if (absDistX > absDistY + _this.options.directionLockThreshold) {
                    _this.directionLocked = DirectionLock.Horizontal; // lock horizontally
                }
                else if (absDistY >=
                    absDistX + _this.options.directionLockThreshold) {
                    _this.directionLocked = DirectionLock.Vertical; // lock vertically
                }
                else {
                    _this.directionLocked = DirectionLock.None; // no lock
                }
            }
            if (_this.directionLocked === DirectionLock.Horizontal) {
                if (_this.options.eventPassthrough === EventPassthrough.Vertical) {
                    e.preventDefault();
                }
                else if (_this.options.eventPassthrough === EventPassthrough.Horizontal) {
                    actionsHandler.initiated = false;
                    return true;
                }
                deltaY = 0;
            }
            else if (_this.directionLocked === DirectionLock.Vertical) {
                if (_this.options.eventPassthrough === EventPassthrough.Horizontal) {
                    e.preventDefault();
                }
                else if (_this.options.eventPassthrough === EventPassthrough.Vertical) {
                    actionsHandler.initiated = false;
                    return true;
                }
                deltaX = 0;
            }
            deltaX = _this.hasHorizontalScroll ? deltaX : 0;
            deltaY = _this.hasVerticalScroll ? deltaY : 0;
            _this.movingDirectionX =
                deltaX > 0
                    ? Direction.Right
                    : deltaX < 0
                        ? Direction.Left
                        : Direction.Default;
            _this.movingDirectionY =
                deltaY > 0
                    ? Direction.Down
                    : deltaY < 0
                        ? Direction.Up
                        : Direction.Default;
            var newX = _this.translater.x + deltaX;
            var newY = _this.translater.y + deltaY;
            var top = false;
            var bottom = false;
            var left = false;
            var right = false;
            // Slow down or stop if outside of the boundaries
            var bounce = _this.options.bounce;
            if (bounce !== false) {
                top = bounce.top === undefined ? true : bounce.top;
                bottom = bounce.bottom === undefined ? true : bounce.bottom;
                left = bounce.left === undefined ? true : bounce.left;
                right = bounce.right === undefined ? true : bounce.right;
            }
            if (newX > _this.minScrollX || newX < _this.maxScrollX) {
                if ((newX > _this.minScrollX && left) ||
                    (newX < _this.maxScrollX && right)) {
                    newX = _this.translater.x + deltaX / 3;
                }
                else {
                    newX = newX > _this.minScrollX ? _this.minScrollX : _this.maxScrollX;
                }
            }
            if (newY > _this.minScrollY || newY < _this.maxScrollY) {
                if ((newY > _this.minScrollY && top) ||
                    (newY < _this.maxScrollY && bottom)) {
                    newY = _this.translater.y + deltaY / 3;
                }
                else {
                    newY = newY > _this.minScrollY ? _this.minScrollY : _this.maxScrollY;
                }
            }
            if (!_this.moved) {
                _this.moved = true;
                _this.hooks.trigger(_this.hooks.eventTypes.scrollStart);
            }
            _this.animater.translate(newX, newY, _this.translater.scale);
            // dispatch scroll in interval time
            if (timeStamp - _this.startTime > _this.options.momentumLimitTime) {
                // refresh time and start position to initiate a momentum
                _this.startTime = timeStamp;
                _this.startX = _this.translater.x;
                _this.startY = _this.translater.y;
                if (_this.options.probeType === Probe.Throttle) {
                    _this.hooks.trigger(_this.hooks.eventTypes.scroll, {
                        x: _this.translater.x,
                        y: _this.translater.y
                    });
                }
            }
            // dispatch scroll all the time
            if (_this.options.probeType > Probe.Throttle) {
                _this.hooks.trigger(_this.hooks.eventTypes.scroll, {
                    x: _this.translater.x,
                    y: _this.translater.y
                });
            }
        });
        actionsHandler.hooks.on(actionsHandler.hooks.eventTypes.end, function (e) {
            if (!_this.enabled)
                return true;
            var _a = _this.translater, x = _a.x, y = _a.y, scale = _a.scale;
            _this.hooks.trigger(_this.hooks.eventTypes.touchEnd, {
                x: x,
                y: y
            });
            _this.animater.pending = false;
            // ensures that the last position is rounded
            var newX = Math.round(x);
            var newY = Math.round(y);
            var deltaX = newX - _this.absStartX;
            var deltaY = newY - _this.absStartY;
            _this.directionX =
                deltaX > 0
                    ? Direction.Right
                    : deltaX < 0
                        ? Direction.Left
                        : Direction.Default;
            _this.directionY =
                deltaY > 0
                    ? Direction.Down
                    : deltaY < 0
                        ? Direction.Up
                        : Direction.Default;
            // TODO PullDown
            // check if it is a click operation
            if (_this.checkClick(e)) {
                _this.hooks.trigger(_this.hooks.eventTypes.scrollCancel);
                return;
            }
            // reset if we are outside of the boundaries
            if (_this.resetPosition(_this.options.bounceTime, ease.bounce)) {
                return;
            }
            _this.animater.translate(newX, newY, scale);
            _this.endTime = e.timeStamp;
            var duration = _this.endTime - _this.startTime;
            var absDistX = Math.abs(newX - _this.startX);
            var absDistY = Math.abs(newY - _this.startY);
            // flick
            if (duration < _this.options.flickLimitTime &&
                absDistX < _this.options.flickLimitDistance &&
                absDistY < _this.options.flickLimitDistance) {
                _this.hooks.trigger('flick');
                return;
            }
            var time = 0;
            // start momentum animation if needed
            if (_this.options.momentum &&
                duration < _this.options.momentumLimitTime &&
                (absDistY > _this.options.momentumLimitDistance ||
                    absDistX > _this.options.momentumLimitDistance)) {
                var top_1 = false;
                var bottom = false;
                var left = false;
                var right = false;
                var bounce = _this.options.bounce;
                if (bounce !== false) {
                    top_1 = bounce.top === undefined ? true : bounce.top;
                    bottom = bounce.bottom === undefined ? true : bounce.bottom;
                    left = bounce.left === undefined ? true : bounce.left;
                    right = bounce.right === undefined ? true : bounce.right;
                }
                var wrapperWidth = (_this.directionX === Direction.Right && left) ||
                    (_this.directionX === Direction.Left && right)
                    ? _this.wrapperWidth
                    : 0;
                var wrapperHeight = (_this.directionY === Direction.Down && top_1) ||
                    (_this.directionY === Direction.Up && bottom)
                    ? _this.wrapperHeight
                    : 0;
                var momentumX = _this.hasHorizontalScroll
                    ? momentum(_this.translater.x, _this.startX, duration, _this.maxScrollX, _this.minScrollX, wrapperWidth, _this.options)
                    : { destination: newX, duration: 0 };
                var momentumY = _this.hasVerticalScroll
                    ? momentum(_this.translater.y, _this.startY, duration, _this.maxScrollY, _this.minScrollY, wrapperHeight, _this.options)
                    : { destination: newY, duration: 0 };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                _this.animater.pending = true;
            }
            var easing;
            if (newX !== _this.translater.x || newY !== _this.translater.y) {
                // change easing function when scroller goes out of the boundaries
                if (newX > _this.minScrollX ||
                    newX < _this.maxScrollX ||
                    newY > _this.minScrollY ||
                    newY < _this.maxScrollY) {
                    easing = ease.swipeBounce;
                }
                _this.scrollTo(newX, newY, time, easing);
                return;
            }
            _this.hooks.trigger(_this.hooks.eventTypes.scrollEnd, {
                x: _this.translater.x,
                y: _this.translater.y
            });
        });
    }
    Scroller.prototype.createActionsHandlerOpt = function () {
        var _this = this;
        var options = [
            'bindToWrapper',
            'click',
            'disableMouse',
            'preventDefault',
            'stopPropagation',
            'preventDefaultException'
        ].reduce(function (prev, cur) {
            prev[cur] = _this.options[cur];
            return prev;
        }, {});
        return options;
    };
    Scroller.prototype.refresh = function () {
        var wrapper = this.wrapper;
        var isWrapperStatic = window.getComputedStyle(wrapper, null).position === 'static';
        var wrapperRect = getRect(wrapper);
        this.wrapperWidth = wrapperRect.width;
        this.wrapperHeight = wrapperRect.height;
        var elementRect = getRect(this.element);
        this.elementWidth = Math.round(elementRect.width * this.translater.scale);
        this.elementHeight = Math.round(elementRect.height * this.translater.scale);
        this.relativeX = elementRect.left;
        this.relativeY = elementRect.top;
        if (isWrapperStatic) {
            this.relativeX -= wrapperRect.left;
            this.relativeY -= wrapperRect.top;
        }
        this.minScrollX = 0;
        this.minScrollY = 0;
        this.maxScrollX = this.wrapperWidth - this.elementWidth;
        this.maxScrollY = this.wrapperHeight - this.elementHeight;
        if (this.maxScrollX < 0) {
            this.maxScrollX -= this.relativeX;
            this.minScrollX = -this.relativeX;
        }
        else if (this.translater.scale > 1) {
            this.maxScrollX = this.maxScrollX / 2 - this.relativeX;
            this.minScrollX = this.maxScrollX;
        }
        if (this.maxScrollY < 0) {
            this.maxScrollY -= this.relativeY;
            this.minScrollY = -this.relativeY;
        }
        else if (this.translater.scale > 1) {
            this.maxScrollY = this.maxScrollY / 2 - this.relativeY;
            this.minScrollY = this.maxScrollY;
        }
        this.hasHorizontalScroll =
            this.options.scrollX && this.maxScrollX < this.minScrollX;
        this.hasVerticalScroll =
            this.options.scrollY && this.maxScrollY < this.minScrollY;
        if (!this.hasHorizontalScroll) {
            this.maxScrollX = this.minScrollX;
            this.elementWidth = this.wrapperWidth;
        }
        if (!this.hasVerticalScroll) {
            this.maxScrollY = this.minScrollY;
            this.elementHeight = this.wrapperHeight;
        }
        this.endTime = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.wrapperOffset = offset(wrapper);
        this.animater.refresh({
            minScrollX: this.minScrollX,
            maxScrollX: this.maxScrollX,
            minScrollY: this.minScrollY,
            maxScrollY: this.maxScrollY,
            hasHorizontalScroll: this.hasHorizontalScroll,
            hasVerticalScroll: this.hasVerticalScroll
        });
    };
    Scroller.prototype.addDOMEvents = function () {
        var eventOperation = addEvent;
        this.handleDOMEvents(eventOperation);
    };
    Scroller.prototype.removeDOMEvents = function () {
        var eventOperation = removeEvent;
        this.handleDOMEvents(eventOperation);
    };
    Scroller.prototype.handleDOMEvents = function (eventOperation) {
        eventOperation(window, 'orientationchange', this);
        eventOperation(window, 'resize', this);
        eventOperation(this.element, style.transitionEnd, this);
    };
    Scroller.prototype.handleEvent = function (e) {
        switch (e.type) {
            case 'orientationchange':
            case 'resize':
                this.resize();
                break;
            case 'click':
                // ensure click event triggered only once in pc
                if (this.enabled && !e._constructed) {
                    if (!preventDefaultExceptionFn(e.target, this.options.preventDefaultException)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                break;
            case 'transitionend':
            case 'webkitTransitionEnd':
            case 'oTransitionEnd':
            case 'MSTransitionEnd':
                this.transitionEnd(e);
                break;
        }
    };
    Scroller.prototype.resize = function () {
        var _this = this;
        if (!this.enabled) {
            return;
        }
        // fix a scroll problem under Android condition
        if (isAndroid) {
            this.wrapper.scrollTop = 0;
        }
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(function () {
            _this.refresh();
        }, this.options.resizePolling);
    };
    Scroller.prototype.transitionEnd = function (e) {
        // ensure pending
        if (e.target !== this.element || !this.animater.pending) {
            return;
        }
        this.animater.transitionTime();
        // TODO when pullingDown, do not reset position
        // const needReset = this.movingDirectionY === Direction.Up
        if (!this.resetPosition(this.options.bounceTime, ease.bounce)) {
            this.animater.pending = false;
            if (this.options.probeType !== Probe.Realtime) {
                this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
                    x: this.translater.x,
                    y: this.translater.y
                });
            }
        }
    };
    Scroller.prototype.checkClick = function (e) {
        // when in the process of pulling down, it should not prevent click
        var preventClick = this.animater.forceStopped;
        this.animater.forceStopped = false;
        // we scrolled less than momentumLimitDistance pixels
        if (!this.moved) {
            if (!preventClick) {
                if (this.options.tap) {
                    tap(e, this.options.tap);
                }
                if (this.options.click &&
                    !preventDefaultExceptionFn(e.target, this.options.preventDefaultException)) {
                    click(e);
                }
                return true;
            }
            return false;
        }
        return false;
    };
    Scroller.prototype.scrollBy = function (deltaX, deltaY, time, easing) {
        if (time === void 0) { time = 0; }
        if (easing === void 0) { easing = ease.bounce; }
        deltaX += this.translater.x;
        deltaY += this.translater.y;
        this.scrollTo(deltaX, deltaY, time, easing);
    };
    Scroller.prototype.scrollTo = function (x, y, time, easing) {
        if (time === void 0) { time = 0; }
        if (easing === void 0) { easing = ease.bounce; }
        var easingFn = this.options.useTransition ? easing.style : easing.fn;
        // when x or y has changed
        if (x !== this.translater.x || y !== this.translater.y) {
            this.animater.scrollTo(x, y, time, easingFn);
        }
    };
    Scroller.prototype.scrollToElement = function (el, time, offsetX, offsetY, easing) {
        el = (el.nodeType
            ? el
            : this.element.querySelector(el));
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
        pos.left =
            pos.left > this.minScrollX
                ? this.minScrollX
                : pos.left < this.maxScrollX
                    ? this.maxScrollX
                    : pos.left;
        pos.top =
            pos.top > this.minScrollY
                ? this.minScrollY
                : pos.top < this.maxScrollY
                    ? this.maxScrollY
                    : pos.top;
        this.scrollTo(pos.left, pos.top, time, easing);
    };
    Scroller.prototype.resetPosition = function (time, easing) {
        if (time === void 0) { time = 0; }
        if (easing === void 0) { easing = ease.bounce; }
        return this.animater.resetPosition(time, easing);
    };
    return Scroller;
}());

var BScroll = /** @class */ (function (_super) {
    __extends(BScroll, _super);
    function BScroll(el, options) {
        var _this = _super.call(this, ['refresh', 'scrollStart']) || this;
        var wrapper = (typeof el === 'string'
            ? document.querySelector(el)
            : el);
        if (!wrapper) {
            warn('Can not resolve the wrapper DOM.');
            return _this;
        }
        var scrollElement = wrapper.children[0];
        if (!scrollElement) {
            warn('The wrapper need at least one child element to be scroller.');
            return _this;
        }
        _this.options = new Options().merge(options).process();
        _this.hooks = new EventEmitter(['init']);
        _this.init(wrapper);
        return _this;
    }
    BScroll.plugin = function (name, ctor) {
        if (!this._pluginsMap) {
            this._pluginsMap = {};
        }
        if (this._pluginsMap[name]) {
            warn("This plugin has been registered, maybe you need change plugin's name");
        }
        this._pluginsMap[name] = ctor;
    };
    BScroll.prototype.init = function (wrapper) {
        this.scroller = new Scroller(wrapper, this.options);
        this.applyPlugins();
        if (this.options.autoBlur) {
            this.handleAutoBlur();
        }
        this.refresh();
        if (!this.options.slide) {
            this.scroller.scrollTo(this.options.startX, this.options.startY);
        }
        this.enable();
    };
    BScroll.prototype.applyPlugins = function () {
        var options = this.options;
        var _pluginsMap = this.constructor._pluginsMap || {};
        var ctor;
        for (var pluginName in _pluginsMap) {
            ctor = _pluginsMap[pluginName];
            if (options[pluginName]) {
                typeof ctor === 'function' && new ctor(this);
            }
        }
    };
    BScroll.prototype.handleAutoBlur = function () {
        this.on(this.eventTypes.scrollStart, function () {
            var activeElement = document.activeElement;
            if (activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA')) {
                activeElement.blur();
            }
        });
    };
    BScroll.prototype.refresh = function () {
        this.scroller.refresh();
        this.trigger(this.eventTypes.refresh);
        this.scroller.resetPosition();
    };
    BScroll.prototype.enable = function () {
        this.scroller.enabled = true;
    };
    BScroll.prototype.disable = function () {
        this.scroller.enabled = false;
    };
    BScroll.prototype.destroy = function () { };
    BScroll.version = '2.0.0';
    return BScroll;
}(EventEmitter));

export default BScroll;
