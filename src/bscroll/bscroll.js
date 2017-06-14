import {
  hasPerspective,
  hasTouch,
  hasTransform,
  hasTransition,
  getRect,
  eventType,
  style,
  offset,
  addEvent,
  removeEvent,
  prepend,
  preventDefaultException,
  tap,
  click
} from '../util/dom';

import {extend, requestAnimationFrame, cancelAnimationFrame} from '../util/lang';
import {isBadAndroid} from '../util/env';
import {ease} from '../util/ease';
import {EventEmitter} from '../util/eventEmitter';
import {momentum} from '../util/momentum';

const TOUCH_EVENT = 1;

export class BScroll extends EventEmitter {
  constructor(el, options) {
    super();
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

    extend(this.options, options);

    this.translateZ = this.options.HWCompositing && hasPerspective ? ' translateZ(0)' : '';

    this.options.useTransition = this.options.useTransition && hasTransition;
    this.options.useTransform = this.options.useTransform && hasTransform;

    this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
    this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;
    this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;

    // With eventPassthrough we also need lockDirection mechanism
    this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
    this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

    if (this.options.tap === true) {
      this.options.tap = 'tap';
    }

    this._init();

    if (this.options.snap) {
      this._initSnap();
    }

    this.refresh();

    if (!this.options.snap) {
      this.scrollTo(this.options.startX, this.options.startY);
    }

    this.enable();
  }

  _init() {
    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;

    this._addEvents();
  }

  _initSnap() {
    this.currentPage = {};

    if (this.options.snapLoop) {
      let children = this.scroller.children;
      if (children.length > 0) {
        prepend(children[children.length - 1].cloneNode(true), this.scroller);
        this.scroller.appendChild(children[1].cloneNode(true));
      }
    }

    if (typeof this.options.snap === 'string') {
      this.options.snap = this.scroller.querySelectorAll(this.options.snap);
    }

    this.on('refresh', () => {
      this.pages = [];

      if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
        return;
      }

      let stepX = this.options.snapStepX || this.wrapperWidth;
      let stepY = this.options.snapStepY || this.wrapperHeight;

      let x = 0;
      let y;
      let cx;
      let cy;
      let i = 0;
      let l;
      let m = 0;
      let n;
      let el;
      let rect;
      if (this.options.snap === true) {
        cx = Math.round(stepX / 2);
        cy = Math.round(stepY / 2);

        while (x > -this.scrollerWidth) {
          this.pages[i] = [];
          l = 0;
          y = 0;

          while (y > -this.scrollerHeight) {
            this.pages[i][l] = {
              x: Math.max(x, this.maxScrollX),
              y: Math.max(y, this.maxScrollY),
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
        el = this.options.snap;
        l = el.length;
        n = -1;

        for (; i < l; i++) {
          rect = getRect(el[i]);
          if (i === 0 || rect.left <= getRect(el[i - 1]).left) {
            m = 0;
            n++;
          }

          if (!this.pages[m]) {
            this.pages[m] = [];
          }

          x = Math.max(-rect.left, this.maxScrollX);
          y = Math.max(-rect.top, this.maxScrollY);
          cx = x - Math.round(rect.width / 2);
          cy = y - Math.round(rect.height / 2);

          this.pages[m][n] = {
            x: x,
            y: y,
            width: rect.width,
            height: rect.height,
            cx: cx,
            cy: cy
          };

          if (x > this.maxScrollX) {
            m++;
          }
        }
      }

      let initPage = this.options.snapLoop ? 1 : 0;
      this.goToPage(this.currentPage.pageX || initPage, this.currentPage.pageY || 0, 0);

      // Update snap threshold if needed
      if (this.options.snapThreshold % 1 === 0) {
        this.snapThresholdX = this.options.snapThreshold;
        this.snapThresholdY = this.options.snapThreshold;
      } else {
        this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
        this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
      }
    });

    this.on('scrollEnd', () => {
      if (this.options.snapLoop) {
        if (this.currentPage.pageX === 0) {
          this.goToPage(this.pages.length - 2, this.currentPage.pageY, 0);
        }
        if (this.currentPage.pageX === this.pages.length - 1) {
          this.goToPage(1, this.currentPage.pageY, 0);
        }
      }
    });

    this.on('flick', () => {
      let time = this.options.snapSpeed || Math.max(
          Math.max(
            Math.min(Math.abs(this.x - this.startX), 1000),
            Math.min(Math.abs(this.y - this.startY), 1000)
          ), 300);

      this.goToPage(
        this.currentPage.pageX + this.directionX,
        this.currentPage.pageY + this.directionY,
        time
      );
    });
  }

  _nearestSnap(x, y) {
    if (!this.pages.length) {
      return {x: 0, y: 0, pageX: 0, pageY: 0};
    }

    let i = 0;
    // Check if we exceeded the snap threshold
    if (Math.abs(x - this.absStartX) <= this.snapThresholdX &&
      Math.abs(y - this.absStartY) <= this.snapThresholdY) {
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

    let l = this.pages.length;
    for (; i < l; i++) {
      if (x >= this.pages[i][0].cx) {
        x = this.pages[i][0].x;
        break;
      }
    }

    l = this.pages[i].length;

    let m = 0;
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
      x,
      y,
      pageX: i,
      pageY: m
    };
  }

  _addEvents() {
    let eventOperation = addEvent;
    this._handleEvents(eventOperation);
  }

  _removeEvents() {
    let eventOperation = removeEvent;
    this._handleEvents(eventOperation);
  }

  _handleEvents(eventOperation) {
    let target = this.options.bindToWrapper ? this.wrapper : window;
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

  _start(e) {
    let _eventType = eventType[e.type];
    if (_eventType !== TOUCH_EVENT) {
      if (e.button !== 0) {
        return;
      }
    }
    if (!this.enabled || this.destroyed || (this.initiated && this.initiated !== _eventType)) {
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
      let pos = this.getComputedPosition();
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

    let point = e.touches ? e.touches[0] : e;

    this.startX = this.x;
    this.startY = this.y;
    this.absStartX = this.x;
    this.absStartY = this.y;
    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.trigger('beforeScrollStart');
  }

  _move(e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return;
    }

    if (this.options.preventDefault) {
      e.preventDefault();
    }

    let point = e.touches ? e.touches[0] : e;
    let deltaX = point.pageX - this.pointX;
    let deltaY = point.pageY - this.pointY;

    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.distX += deltaX;
    this.distY += deltaY;

    let absDistX = Math.abs(this.distX);
    let absDistY = Math.abs(this.distY);

    let timestamp = +new Date();

    // We need to move at least 15 pixels for the scrolling to initiate
    if (timestamp - this.endTime > this.options.momentumLimitTime && (absDistY < this.options.momentumLimitDistance && absDistX < this.options.momentumLimitDistance)) {
      return;
    }

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

    let newX = this.x + deltaX;
    let newY = this.y + deltaY;

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

    let scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

    let pX = this.pointX - scrollLeft;
    let pY = this.pointY - scrollTop;

    if (pX > document.documentElement.clientWidth - this.options.momentumLimitDistance || pX < this.options.momentumLimitDistance || pY < this.options.momentumLimitDistance || pY > document.documentElement.clientHeight - this.options.momentumLimitDistance
    ) {
      this._end(e);
    }
  }

  _end(e) {
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
    let newX = Math.round(this.x);
    let newY = Math.round(this.y);

    // we scrolled less than 15 pixels
    if (!this.moved) {
      if (this.options.wheel) {
        if (this.target && this.target.className === 'wheel-scroll') {
          let index = Math.abs(Math.round(newY / this.itemHeight));
          let _offset = Math.round((this.pointY + offset(this.target).top - this.itemHeight / 2) / this.itemHeight);
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

    let deltaX = newX - this.absStartX;
    let deltaY = newY - this.absStartY;
    this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
    this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

    this.endTime = +new Date();

    let duration = this.endTime - this.startTime;
    let absDistX = Math.abs(newX - this.startX);
    let absDistY = Math.abs(newY - this.startY);

    // fastclick
    if (this._events.flick && duration < this.options.momentumLimitTime && absDistX < this.options.momentumLimitDistance && absDistY < this.options.momentumLimitDistance) {
      this.trigger('flick');
      return;
    }

    let time = 0;
    // start momentum animation if needed
    if (this.options.momentum && duration < this.options.momentumLimitTime && (absDistY > this.options.momentumLimitDistance || absDistX > this.options.momentumLimitDistance)) {
      let momentumX = this.hasHorizontalScroll ? momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options)
        : {destination: newX, duration: 0};
      let momentumY = this.hasVerticalScroll ? momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options)
        : {destination: newY, duration: 0};
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

    let easing = ease.swipe;
    if (this.options.snap) {
      let snap = this._nearestSnap(newX, newY);
      this.currentPage = snap;
      time = this.options.snapSpeed || Math.max(
          Math.max(
            Math.min(Math.abs(newX - snap.x), 1000),
            Math.min(Math.abs(newY - snap.y), 1000)
          ), 300);
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

  _resize() {
    if (!this.enabled) {
      return;
    }

    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.refresh();
    }, this.options.resizePolling);
  }

  _startProbe() {
    cancelAnimationFrame(this.probeTimer);
    this.probeTimer = requestAnimationFrame(probe);

    let me = this;

    function probe() {
      let pos = me.getComputedPosition();
      me.trigger('scroll', pos);
      if (me.isInTransition) {
        me.probeTimer = requestAnimationFrame(probe);
      }
    }
  }

  _transitionTime(time = 0) {
    this.scrollerStyle[style.transitionDuration] = time + 'ms';

    if (this.options.wheel && !isBadAndroid) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].style[style.transitionDuration] = time + 'ms';
      }
    }

    if (!time && isBadAndroid) {
      this.scrollerStyle[style.transitionDuration] = '0.001s';

      requestAnimationFrame(() => {
        if (this.scrollerStyle[style.transitionDuration] === '0.0001ms') {
          this.scrollerStyle[style.transitionDuration] = '0s';
        }
      });
    }
  }

  _transitionTimingFunction(easing) {
    this.scrollerStyle[style.transitionTimingFunction] = easing;

    if (this.options.wheel && !isBadAndroid) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].style[style.transitionTimingFunction] = easing;
      }
    }
  }

  _transitionEnd(e) {
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

  _translate(x, y) {
    if (this.options.useTransform) {
      this.scrollerStyle[style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
    } else {
      x = Math.round(x);
      y = Math.round(y);
      this.scrollerStyle.left = x + 'px';
      this.scrollerStyle.top = y + 'px';
    }

    if (this.options.wheel && !isBadAndroid) {
      for (let i = 0; i < this.items.length; i++) {
        let deg = this.options.rotate * (y / this.itemHeight + i);
        this.items[i].style[style.transform] = 'rotateX(' + deg + 'deg)';
      }
    }

    this.x = x;
    this.y = y;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  refresh() {
    /* eslint-disable no-unused-vars */
    let rf = this.wrapper.offsetHeight;

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

  resetPosition(time = 0, easeing = ease.bounce) {
    let x = this.x;
    if (!this.hasHorizontalScroll || x > 0) {
      x = 0;
    } else if (x < this.maxScrollX) {
      x = this.maxScrollX;
    }

    let y = this.y;
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

  wheelTo(selectIndex) {
    if (this.options.wheel) {
      this.y = -selectIndex * this.itemHeight;
      this.scrollTo(0, this.y);
    }
  }

  scrollBy(x, y, time = 0, easing = ease.bounce) {
    x = this.x + x;
    y = this.y + y;

    this.scrollTo(x, y, time, easing);
  }

  scrollTo(x, y, time, easing = ease.bounce) {
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

  getSelectedIndex() {
    return this.options.wheel && this.selectedIndex;
  }

  getCurrentPage() {
    return this.options.snap && this.currentPage;
  }

  scrollToElement(el, time, offsetX, offsetY, easing) {
    if (!el) {
      return;
    }
    el = el.nodeType ? el : this.scroller.querySelector(el);

    if (this.options.wheel && el.className !== 'wheel-item') {
      return;
    }

    let pos = offset(el);
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

  getComputedPosition() {
    let matrix = window.getComputedStyle(this.scroller, null);
    let x;
    let y;

    if (this.options.useTransform) {
      matrix = matrix[style.transform].split(')')[0].split(', ');
      x = +(matrix[12] || matrix[4]);
      y = +(matrix[13] || matrix[5]);
    } else {
      x = +matrix.left.replace(/[^-\d.]/g, '');
      y = +matrix.top.replace(/[^-\d.]/g, '');
    }

    return {
      x,
      y
    };
  }

  goToPage(x, y, time, easing = ease.bounce) {
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

    let posX = this.pages[x][y].x;
    let posY = this.pages[x][y].y;

    time = time === undefined ? this.options.snapSpeed || Math.max(
        Math.max(
          Math.min(Math.abs(posX - this.x), 1000),
          Math.min(Math.abs(posY - this.y), 1000)
        ), 300) : time;

    this.currentPage = {
      x: posX,
      y: posY,
      pageX: x,
      pageY: y
    };
    this.scrollTo(posX, posY, time, easing);
  }

  next(time, easing) {
    let x = this.currentPage.pageX;
    let y = this.currentPage.pageY;

    x++;
    if (x >= this.pages.length && this.hasVerticalScroll) {
      x = 0;
      y++;
    }

    this.goToPage(x, y, time, easing);
  }

  prev(time, easing) {
    let x = this.currentPage.pageX;
    let y = this.currentPage.pageY;

    x--;
    if (x < 0 && this.hasVerticalScroll) {
      x = 0;
      y--;
    }

    this.goToPage(x, y, time, easing);
  }

  destroy() {
    this._removeEvents();

    this.destroyed = true;
    this.trigger('destroy');
  }

  handleEvent(e) {
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
        if (this.enabled && !e._constructed && !(/(SELECT|INPUT|TEXTAREA)/i).test(e.target.tagName)) {
          e.preventDefault();
          e.stopPropagation();
        }
        break;
    }
  }
}