/*!
 * better-normal-scroll v2.0.0
 * (c) 2016-2019 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.BScroll = factory());
}(this, (function () { 'use strict';

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
        Direction[Direction["Positive"] = 1] = "Positive";
        Direction[Direction["Negative"] = -1] = "Negative";
        Direction[Direction["Default"] = 0] = "Default";
    })(Direction || (Direction = {}));
    var EventType;
    (function (EventType) {
        EventType[EventType["Touch"] = 1] = "Touch";
        EventType[EventType["Mouse"] = 2] = "Mouse";
    })(EventType || (EventType = {}));
    var DirectionLock;
    (function (DirectionLock) {
        DirectionLock["Default"] = "";
        DirectionLock["Horizontal"] = "horizontal";
        DirectionLock["Vertical"] = "vertical";
        DirectionLock["None"] = "none";
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

    var elementStyle = (inBrowser &&
        document.createElement('div').style);
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
            return style;
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
    var hasTransform = transform in elementStyle;
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
            this.bounce = {
                top: true,
                bottom: true,
                left: true,
                right: true
            };
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
            this.translateZ =
                this.HWCompositing && hasPerspective ? ' translateZ(0)' : '';
            this.useTransition = this.useTransition && hasTransition;
            this.useTransform = this.useTransform && hasTransform;
            this.preventDefault = !this.eventPassthrough && this.preventDefault;
            // If you want eventPassthrough I have to lock one of the axes
            this.scrollX = this.eventPassthrough === 'horizontal' ? false : this.scrollX;
            this.scrollY = this.eventPassthrough === 'vertical' ? false : this.scrollY;
            // With eventPassthrough we also need lockDirection mechanism
            this.freeScroll = this.freeScroll && !this.eventPassthrough;
            // force true when freeScroll is true
            this.scrollX = this.freeScroll ? true : this.scrollX;
            this.scrollY = this.freeScroll ? true : this.scrollY;
            this.directionLockThreshold = this.eventPassthrough
                ? 0
                : this.directionLockThreshold;
            return this;
        };
        return Options;
    }());

    var EventRegister = /** @class */ (function () {
        function EventRegister(wrapper, events) {
            this.wrapper = wrapper;
            this.events = events;
            this.addDOMEvents();
        }
        EventRegister.prototype.destroy = function () {
            this.removeDOMEvents();
            this.events = [];
        };
        EventRegister.prototype.addDOMEvents = function () {
            this.handleDOMEvents(addEvent);
        };
        EventRegister.prototype.removeDOMEvents = function () {
            this.handleDOMEvents(removeEvent);
        };
        EventRegister.prototype.handleDOMEvents = function (eventOperation) {
            var _this = this;
            var wrapper = this.wrapper;
            this.events.forEach(function (event) {
                eventOperation(wrapper, event.name, _this, !!event.capture);
            });
        };
        EventRegister.prototype.handleEvent = function (e) {
            var eventType = e.type;
            this.events.some(function (event) {
                if (event.name === eventType) {
                    event.handler(e);
                    return true;
                }
                return false;
            });
        };
        return EventRegister;
    }());

    var ActionsHandler = /** @class */ (function () {
        function ActionsHandler(wrapper, options) {
            this.wrapper = wrapper;
            this.options = options;
            this.hooks = new EventEmitter(['start', 'move', 'end', 'click']);
            this.handleDOMEvents();
        }
        ActionsHandler.prototype.handleDOMEvents = function () {
            var _a = this.options, bindToWrapper = _a.bindToWrapper, disableMouse = _a.disableMouse;
            var wrapper = this.wrapper;
            var target = bindToWrapper ? wrapper : window;
            this.startClickRegister = new EventRegister(wrapper, [
                {
                    name: disableMouse ? 'touchstart' : 'mousedown',
                    handler: this.start.bind(this)
                },
                {
                    name: 'click',
                    handler: this.click.bind(this)
                }
            ]);
            this.moveEndRegister = new EventRegister(target, [
                {
                    name: disableMouse ? 'touchmove' : 'mousemove',
                    handler: this.move.bind(this)
                },
                {
                    name: disableMouse ? 'touchend' : 'mouseup',
                    handler: this.end.bind(this)
                },
                {
                    name: disableMouse ? 'touchcancel' : 'mouseup',
                    handler: this.end.bind(this)
                }
            ]);
        };
        ActionsHandler.prototype.beforeHandler = function (e) {
            var _a = this.options, preventDefault = _a.preventDefault, stopPropagation = _a.stopPropagation, preventDefaultException = _a.preventDefaultException;
            if (preventDefault &&
                !preventDefaultExceptionFn(e.target, preventDefaultException)) {
                e.preventDefault();
            }
            if (stopPropagation) {
                e.stopPropagation();
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
            this.beforeHandler(e);
            var point = (e.touches ? e.touches[0] : e);
            this.pointX = point.pageX;
            this.pointY = point.pageY;
            this.hooks.trigger(this.hooks.eventTypes.start);
        };
        ActionsHandler.prototype.move = function (e) {
            if (eventTypeMap[e.type] !== this.initiated) {
                return;
            }
            this.beforeHandler(e);
            var point = (e.touches ? e.touches[0] : e);
            var deltaX = point.pageX - this.pointX;
            var deltaY = point.pageY - this.pointY;
            this.pointX = point.pageX;
            this.pointY = point.pageY;
            if (this.hooks.trigger(this.hooks.eventTypes.move, {
                deltaX: deltaX,
                deltaY: deltaY,
                e: e
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
            this.beforeHandler(e);
            this.hooks.trigger(this.hooks.eventTypes.end, e);
        };
        ActionsHandler.prototype.click = function (e) {
            this.hooks.trigger(this.hooks.eventTypes.click, e);
        };
        ActionsHandler.prototype.destroy = function () {
            this.startClickRegister.destroy();
            this.moveEndRegister.destroy();
        };
        return ActionsHandler;
    }());

    var Base = /** @class */ (function () {
        function Base(element) {
            this.element = element;
            // cache for better performance
            this.style = element.style;
        }
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
        Position.prototype.translateTo = function (x, y) {
            this.style.left = Math.round(x) + "px";
            this.style.top = Math.round(y) + "px";
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
        Transform.prototype.translateTo = function (x, y) {
            this.style[style.transform] = "translate(" + x + "px," + y + "px)" + this.options.translateZ;
        };
        return Transform;
    }(Base));

    var Base$1 = /** @class */ (function () {
        function Base(element, translater, options) {
            this.element = element;
            this.translater = translater;
            this.options = options;
            this.hooks = new EventEmitter(['move', 'end', 'forceStop']);
            this.style = element.style;
        }
        Base.prototype.translate = function (x, y) {
            this.translater.translateTo(x, y);
        };
        return Base;
    }());

    var Transition = /** @class */ (function (_super) {
        __extends(Transition, _super);
        function Transition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Transition.prototype.startProbe = function () {
            var _this = this;
            var probe = function () {
                var pos = _this.translater.getComputedPosition();
                _this.hooks.trigger(_this.hooks.eventTypes.move, pos);
                // excute when transition ends
                if (!_this.pending) {
                    _this.hooks.trigger(_this.hooks.eventTypes.end, pos);
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
        Transition.prototype.scrollTo = function (DisplacementX, DisplacementY, time, easingFn) {
            // destinations
            var x = DisplacementX[1];
            var y = DisplacementY[1];
            this.pending = time > 0;
            this.transitionTimingFunction(easingFn);
            this.transitionTime(time);
            this.translate(x, y);
            // TODO when probeType is not Realtime, need to dispatch scroll ?
            if (time && this.options.probeType === Probe.Realtime) {
                this.startProbe();
            }
            // when time is 0
            if (!time) {
                this.hooks.trigger(this.hooks.eventTypes.move, {
                    x: x,
                    y: y
                });
                // force reflow to put everything in position
                this._reflow = document.body.offsetHeight;
                // maybe need reset position
                this.hooks.trigger(this.hooks.eventTypes.end, {
                    x: x,
                    y: y
                });
            }
        };
        Transition.prototype.stop = function () {
            // still in transition
            if (this.pending) {
                this.pending = false;
                cancelAnimationFrame(this.timer);
                var _a = this.translater.getComputedPosition(), x = _a.x, y = _a.y;
                this.transitionTime();
                this.translate(x, y);
                this.hooks.trigger(this.hooks.eventTypes.forceStop, {
                    x: x,
                    y: y
                });
                this.forceStopped = true;
            }
        };
        return Transition;
    }(Base$1));

    var Animation = /** @class */ (function (_super) {
        __extends(Animation, _super);
        function Animation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Animation.prototype.scrollTo = function (displacementX, displacementY, time, easingFn) {
            // time is 0
            if (!time) {
                var x = displacementX[1];
                var y = displacementY[1];
                this.translate(x, y);
                this.hooks.trigger(this.hooks.eventTypes.move, {
                    x: x,
                    y: y
                });
                // force reflow to put everything in position
                this._reflow = document.body.offsetHeight;
                // maybe need reset position
                this.hooks.trigger(this.hooks.eventTypes.end, {
                    x: x,
                    y: y
                });
                return;
            }
            this.animate(displacementX, displacementX, time, easingFn);
        };
        Animation.prototype.animate = function (displacementX, displacementY, duration, easingFn) {
            var _this = this;
            // departure
            var startX = displacementX[0];
            var startY = displacementY[0];
            // destinations
            var destX = displacementX[1];
            var destY = displacementY[1];
            var startTime = getNow();
            var destTime = startTime + duration;
            var step = function () {
                var now = getNow();
                // js animation end
                if (now >= destTime) {
                    _this.pending = false;
                    _this.translate(destX, destY);
                    _this.hooks.trigger(_this.hooks.eventTypes.move, {
                        x: destX,
                        y: destY
                    });
                    _this.hooks.trigger(_this.hooks.eventTypes.end, {
                        x: destX,
                        y: destY
                    });
                    return;
                }
                now = (now - startTime) / duration;
                var easing = easingFn(now);
                var newX = (destX - startX) * easing + startX;
                var newY = (destY - startY) * easing + startY;
                _this.translate(newX, newY);
                if (_this.pending) {
                    _this.timer = requestAnimationFrame(step);
                }
                if (_this.options.probeType === Probe.Realtime) {
                    _this.hooks.trigger(_this.hooks.eventTypes.move, {
                        x: newX,
                        y: newY
                    });
                }
            };
            this.pending = true;
            cancelAnimationFrame(this.timer);
            step();
        };
        Animation.prototype.stop = function () {
            // still in requestFrameAnimation
            if (this.pending) {
                this.pending = false;
                cancelAnimationFrame(this.timer);
                var pos = this.translater.getComputedPosition();
                this.hooks.trigger(this.hooks.eventTypes.forceStop, pos);
                this.forceStopped = true;
            }
        };
        return Animation;
    }(Base$1));

    var Behavior = /** @class */ (function () {
        function Behavior(wrapper, options) {
            this.wrapper = wrapper;
            this.options = options;
            this.element = this.wrapper.children[0];
            this.currentPos = 0;
        }
        Behavior.prototype.start = function () {
            this.direction = Direction.Default;
            this.movingDirection = Direction.Default;
            this.startPos = this.currentPos;
            this.absStartPos = this.currentPos;
        };
        Behavior.prototype.move = function (delta, bounces) {
            delta = this.hasScroll ? delta : 0;
            this.movingDirection =
                delta > 0
                    ? Direction.Negative
                    : delta < 0
                        ? Direction.Positive
                        : Direction.Default;
            var newPos = this.currentPos + delta;
            // Slow down or stop if outside of the boundaries
            if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
                if ((newPos > this.minScrollPos && bounces[0]) ||
                    (newPos < this.maxScrollPos && bounces[1])) {
                    newPos = this.currentPos + delta / 3;
                }
                else {
                    newPos =
                        newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos;
                }
            }
            return newPos;
        };
        Behavior.prototype.end = function (_a) {
            var duration = _a.duration, bounces = _a.bounces, startPos = _a.startPos;
            var momentumInfo = {
                duration: 0
            };
            var absDist = Math.abs(this.currentPos - startPos);
            // start momentum animation if needed
            if (this.options.momentum &&
                duration < this.options.momentumLimitTime &&
                absDist > this.options.momentumLimitDistance) {
                var wrapperSize = (this.direction === Direction.Negative && bounces[0]) ||
                    (this.direction === Direction.Positive && bounces[1])
                    ? this.wrapperSize
                    : 0;
                momentumInfo = this.hasScroll
                    ? this.momentum(this.currentPos, startPos, duration, this.maxScrollPos, this.minScrollPos, wrapperSize, this.options)
                    : { destination: this.currentPos, duration: 0 };
            }
            return momentumInfo;
        };
        Behavior.prototype.momentum = function (current, start, time, lowerMargin, upperMargin, wrapperSize, options) {
            if (options === void 0) { options = this.options; }
            var distance = current - start;
            var speed = Math.abs(distance) / time;
            var deceleration = options.deceleration, swipeBounceTime = options.swipeBounceTime, swipeTime = options.swipeTime;
            var duration = swipeTime;
            var rate = 15;
            var destination = current + (speed / deceleration) * (distance < 0 ? -1 : 1);
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
        };
        Behavior.prototype.updateDirection = function () {
            var absDist = Math.round(this.currentPos) - this.absStartPos;
            this.direction =
                absDist > 0
                    ? Direction.Negative
                    : absDist < 0
                        ? Direction.Positive
                        : Direction.Default;
        };
        Behavior.prototype.refresh = function (_a) {
            var size = _a.size, position = _a.position;
            var isWrapperStatic = window.getComputedStyle(this.wrapper, null).position === 'static';
            var wrapperRect = getRect(this.wrapper);
            this.wrapperSize = wrapperRect[size];
            var elementRect = getRect(this.element);
            this.elementSize = elementRect[size];
            this.relativeOffset = elementRect[position];
            if (isWrapperStatic) {
                this.relativeOffset -= wrapperRect[position];
            }
            this.minScrollPos = 0;
            this.maxScrollPos = this.wrapperSize - this.elementSize;
            if (this.maxScrollPos < 0) {
                this.maxScrollPos -= this.relativeOffset;
                this.minScrollPos = -this.relativeOffset;
            }
            this.hasScroll =
                this.options.scrollable && this.maxScrollPos < this.minScrollPos;
            if (!this.hasScroll) {
                this.maxScrollPos = this.minScrollPos;
                this.elementSize = this.wrapperSize;
            }
            this.direction = 0;
        };
        Behavior.prototype.updatePosition = function (pos) {
            this.currentPos = pos;
        };
        // ajust position when out of boundary
        Behavior.prototype.ajustPosition = function () {
            var pos = this.currentPos;
            var roundPos = Math.round(pos);
            if (!this.hasScroll || roundPos > this.minScrollPos) {
                pos = this.minScrollPos;
            }
            else if (roundPos < this.maxScrollPos) {
                pos = this.maxScrollPos;
            }
            return pos;
        };
        return Behavior;
    }());

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
            this.enabled = true;
            this.x = 0;
            this.y = 0;
            this.scrollBehaviorX = new Behavior(wrapper, this.createBehaviorOpt('scrollX')); // direction X
            this.scrollBehaviorY = new Behavior(wrapper, this.createBehaviorOpt('scrollY')); // direction Y
            this.translater = this.options.useTransform
                ? new Transform(this.element, {
                    translateZ: this.options.translateZ
                })
                : new Position(this.element);
            this.animater = this.options.useTransition
                ? new Transition(this.element, this.translater, {
                    probeType: this.options.probeType
                })
                : new Animation(this.element, this.translater, {
                    probeType: this.options.probeType
                });
            this.actionsHandler = new ActionsHandler(wrapper, this.createActionsHandlerOpt());
            var resizeHandler = this.resize.bind(this);
            this.resizeRegister = new EventRegister(window, [
                {
                    name: 'orientationchange',
                    handler: resizeHandler
                },
                {
                    name: 'resize',
                    handler: resizeHandler
                }
            ]);
            this.transitionEndRegister = new EventRegister(this.element, [
                {
                    name: style.transitionEnd,
                    handler: this.transitionEnd.bind(this)
                }
            ]);
            // reset position
            this.animater.hooks.on(this.animater.hooks.eventTypes.end, function (pos) {
                _this.updateAllPositions(pos.x, pos.y);
                if (!_this.resetPosition(_this.options.bounceTime)) {
                    _this.hooks.trigger(_this.hooks.eventTypes.scrollEnd, pos);
                }
            });
            // scroll
            this.animater.hooks.on(this.animater.hooks.eventTypes.move, function (pos) {
                _this.hooks.trigger(_this.hooks.eventTypes.scroll, pos);
            });
            // forceStop
            this.animater.hooks.on(this.animater.hooks.eventTypes.forceStop, function (_a) {
                var x = _a.x, y = _a.y;
                _this.updateAllPositions(x, y);
            });
            // [mouse|touch]start event
            this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.start, function () {
                if (!_this.enabled)
                    return true;
                var timestamp = getNow();
                _this.moved = false;
                _this.directionLocked = DirectionLock.Default;
                _this.startTime = timestamp;
                _this.distX = 0;
                _this.distY = 0;
                _this.scrollBehaviorX.start();
                _this.scrollBehaviorY.start();
                // force stopping last transition or animation
                _this.animater.stop();
                _this.startX = _this.x;
                _this.startY = _this.y;
                _this.hooks.trigger(_this.hooks.eventTypes.beforeScrollStart);
            });
            // [mouse|touch]move event
            this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.move, function (_a) {
                var deltaX = _a.deltaX, deltaY = _a.deltaY, e = _a.e;
                if (!_this.enabled)
                    return true;
                _this.distX += deltaX;
                _this.distY += deltaY;
                var absDistX = Math.abs(_this.distX);
                var absDistY = Math.abs(_this.distY);
                var timestamp = getNow();
                // We need to move at least momentumLimitDistance pixels
                // for the scrolling to initiate
                if (timestamp - _this.endTime > _this.options.momentumLimitTime &&
                    (absDistY < _this.options.momentumLimitDistance &&
                        absDistX < _this.options.momentumLimitDistance)) {
                    return true;
                }
                _this.computeDirectionLock(absDistX, absDistY);
                _this.handleEventPassthrough(e);
                deltaX = _this.ajustDelta(deltaX, deltaY).deltaX;
                deltaY = _this.ajustDelta(deltaX, deltaY).deltaY;
                var _b = _this.options.bounce, left = _b.left, right = _b.right, top = _b.top, bottom = _b.bottom;
                var newX = _this.scrollBehaviorX.move(deltaX, [left, right]);
                var newY = _this.scrollBehaviorY.move(deltaY, [top, bottom]);
                if (!_this.moved) {
                    _this.moved = true;
                    _this.hooks.trigger(_this.hooks.eventTypes.scrollStart);
                }
                _this.animater.translate(newX, newY);
                // update all positions
                _this.updateAllPositions(newX, newY);
                // dispatch scroll in interval time
                if (timestamp - _this.startTime > _this.options.momentumLimitTime) {
                    // refresh time and starting position to initiate a momentum
                    _this.startTime = timestamp;
                    _this.startX = _this.x;
                    _this.startY = _this.y;
                    if (_this.options.probeType === Probe.Throttle) {
                        _this.hooks.trigger(_this.hooks.eventTypes.scroll, {
                            x: _this.x,
                            y: _this.y
                        });
                    }
                }
                // dispatch scroll all the time
                if (_this.options.probeType > Probe.Throttle) {
                    _this.hooks.trigger(_this.hooks.eventTypes.scroll, {
                        x: _this.x,
                        y: _this.y
                    });
                }
            });
            // [mouse|touch]end event
            this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.end, function (e) {
                if (!_this.enabled)
                    return true;
                _this.hooks.trigger(_this.hooks.eventTypes.touchEnd, {
                    x: _this.x,
                    y: _this.y
                });
                _this.animater.pending = false;
                // ensures that the last position is rounded
                var newX = Math.round(_this.x);
                var newY = Math.round(_this.y);
                var time = 0;
                var easing = ease.swiper;
                _this.scrollBehaviorX.updateDirection();
                _this.scrollBehaviorY.updateDirection();
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
                _this.animater.translate(newX, newY);
                // refresh all positions
                _this.updateAllPositions(newX, newY);
                _this.endTime = getNow();
                var duration = _this.endTime - _this.startTime;
                var deltaX = Math.abs(newX - _this.startX);
                var deltaY = Math.abs(newY - _this.startY);
                // flick
                if (duration < _this.options.flickLimitTime &&
                    deltaX < _this.options.flickLimitDistance &&
                    deltaY < _this.options.flickLimitDistance) {
                    _this.hooks.trigger('flick');
                    return;
                }
                // start momentum animation if needed
                var momentumX = _this.scrollBehaviorX.end({
                    duration: duration,
                    bounces: [_this.options.bounce.left, _this.options.bounce.right],
                    startPos: _this.startX
                });
                var momentumY = _this.scrollBehaviorY.end({
                    duration: duration,
                    bounces: [_this.options.bounce.top, _this.options.bounce.bottom],
                    startPos: _this.startY
                });
                newX = isUndef(momentumX.destination)
                    ? newX
                    : momentumX.destination;
                newY = isUndef(momentumY.destination)
                    ? newY
                    : momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                // when x or y changed, do momentum animation now!
                if (newX !== _this.x || newY !== _this.y) {
                    // change easing function when scroller goes out of the boundaries
                    if (newX > _this.scrollBehaviorX.minScrollPos ||
                        newX < _this.scrollBehaviorX.maxScrollPos ||
                        newY > _this.scrollBehaviorY.minScrollPos ||
                        newY < _this.scrollBehaviorY.maxScrollPos) {
                        easing = ease.swipeBounce;
                    }
                    _this.scrollTo(newX, newY, time, easing);
                    return;
                }
                _this.hooks.trigger(_this.hooks.eventTypes.scrollEnd, {
                    x: _this.x,
                    y: _this.y
                });
            });
            // click
            this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.click, function (e) {
                // handle native click event
                if (_this.enabled && !e._constructed) {
                    if (!preventDefaultExceptionFn(e.target, _this.options.preventDefaultException)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
        }
        Scroller.prototype.computeDirectionLock = function (absDistX, absDistY) {
            // If you are scrolling in one direction, lock it
            if (this.directionLocked === Direction.Default &&
                !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = DirectionLock.Horizontal; // lock horizontally
                }
                else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = DirectionLock.Vertical; // lock vertically
                }
                else {
                    this.directionLocked = DirectionLock.None; // no lock
                }
            }
        };
        Scroller.prototype.handleEventPassthrough = function (e) {
            if (this.directionLocked === DirectionLock.Horizontal) {
                if (this.options.eventPassthrough === EventPassthrough.Vertical) {
                    e.preventDefault();
                }
                else if (this.options.eventPassthrough === EventPassthrough.Horizontal) {
                    this.actionsHandler.initiated = false;
                    return true;
                }
            }
            else if (this.directionLocked === DirectionLock.Vertical) {
                if (this.options.eventPassthrough === EventPassthrough.Horizontal) {
                    e.preventDefault();
                }
                else if (this.options.eventPassthrough === EventPassthrough.Vertical) {
                    this.actionsHandler.initiated = false;
                    return true;
                }
            }
        };
        Scroller.prototype.ajustDelta = function (deltaX, deltaY) {
            if (this.directionLocked === DirectionLock.Horizontal) {
                deltaY = 0;
            }
            else if (this.directionLocked === DirectionLock.Vertical) {
                deltaX = 0;
            }
            return {
                deltaX: deltaX,
                deltaY: deltaY
            };
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
                        x: this.x,
                        y: this.y
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
        Scroller.prototype.createActionsHandlerOpt = function () {
            var _this = this;
            var options = [
                'click',
                'bindToWrapper',
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
        Scroller.prototype.createBehaviorOpt = function (extraProp) {
            var _this = this;
            var options = [
                'momentum',
                'momentumLimitTime',
                'momentumLimitDistance',
                'deceleration',
                'swipeBounceTime',
                'swipeTime'
            ].reduce(function (prev, cur) {
                prev[cur] = _this.options[cur];
                return prev;
            }, {});
            // add extra property
            options.scrollable = this.options[extraProp];
            return options;
        };
        Scroller.prototype.refresh = function () {
            this.scrollBehaviorX.refresh({
                size: 'width',
                position: 'left'
            });
            this.scrollBehaviorY.refresh({
                size: 'height',
                position: 'top'
            });
            this.endTime = 0;
            this.wrapperOffset = offset(this.wrapper);
        };
        Scroller.prototype.scrollBy = function (deltaX, deltaY, time, easing) {
            if (time === void 0) { time = 0; }
            if (easing === void 0) { easing = ease.bounce; }
            deltaX += this.x;
            deltaY += this.y;
            this.scrollTo(deltaX, deltaY, time, easing);
        };
        Scroller.prototype.scrollTo = function (x, y, time, easing) {
            if (time === void 0) { time = 0; }
            if (easing === void 0) { easing = ease.bounce; }
            var easingFn = this.options.useTransition ? easing.style : easing.fn;
            // when x or y has changed
            if (x !== this.x || y !== this.y) {
                this.animater.scrollTo([this.x, x], [this.y, y], time, easingFn);
                this.updateAllPositions(x, y);
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
                pos.left > this.scrollBehaviorX.minScrollPos
                    ? this.scrollBehaviorX.minScrollPos
                    : pos.left < this.scrollBehaviorX.maxScrollPos
                        ? this.scrollBehaviorX.maxScrollPos
                        : pos.left;
            pos.top =
                pos.top > this.scrollBehaviorY.minScrollPos
                    ? this.scrollBehaviorY.minScrollPos
                    : pos.top < this.scrollBehaviorY.maxScrollPos
                        ? this.scrollBehaviorY.maxScrollPos
                        : pos.top;
            this.scrollTo(pos.left, pos.top, time, easing);
        };
        Scroller.prototype.resetPosition = function (time, easing) {
            if (time === void 0) { time = 0; }
            if (easing === void 0) { easing = ease.bounce; }
            var x = this.scrollBehaviorX.ajustPosition();
            var y = this.scrollBehaviorY.ajustPosition();
            // in boundary
            if (x === this.x && y === this.y) {
                return false;
            }
            // out of boundary
            this.scrollTo(x, y, time, easing);
            // update all positions
            this.updateAllPositions(x, y);
            return true;
        };
        Scroller.prototype.updateAllPositions = function (x, y) {
            this.scrollBehaviorX.updatePosition(x);
            this.scrollBehaviorY.updatePosition(y);
            this.x = x;
            this.y = y;
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
        BScroll.use = function (ctor) {
            var name = ctor.name;
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

    return BScroll;

})));
