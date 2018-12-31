import { hasTransition, hasTransform, hasTouch } from '../util/dom'

export default class Options {
  [key: string]: any
  constructor() {
    this.set('startX', 0)
    this.set('startY', 0)

    this.set('scrollX', false)
    this.set('scrollY', true)
    this.set('freeScroll', false)
    this.set('directionLockThreshold', 5)
    this.set('eventPassthrough', '')
    this.set('click', false)
    this.set('tap', '')

    /**
     * support any side
     * bounce: {
     *   top: true,
     *   bottom: true,
     *   left: true,
     *   right: true
     * }
     */
    this.set('bounce', true)
    this.set('bounceTime', 800)

    this.set('momentum', true)
    this.set('momentumLimitTime', 300)
    this.set('momentumLimitDistance', 15)

    this.set('swipeTime', 2500)
    this.set('swipeBounceTime', 500)

    this.set('deceleration', 0.0015)

    this.set('flickLimitTime', 200)
    this.set('flickLimitDistance', 100)

    this.set('resizePolling', 60)
    this.set('probeType', 0)

    this.set('stopPropagation', false)
    this.set('preventDefault', true)
    this.set('preventDefaultException', {
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
    })

    this.set('HWCompositing', true)

    this.set('useTransition', true)
    this.set('useTransform', true)
    this.set('bindToWrapper', false)
    this.set('disableMouse', hasTouch)
    this.set('disableTouch', !hasTouch)
    this.set('observeDOM', true)
    this.set('autoBlur', true)

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
    this.set('picker', false)

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
    this.set('slide', false)

    /**
     * for scrollbar
     * scrollbar: {
     *   fade: true,
     *   interactive: false
     * }
     */
    this.set('scrollbar', false)

    /**
     * for pull down and refresh
     * pullDownRefresh: {
     *   threshold: 50,
     *   stop: 20
     * }
     */
    this.set('pullDownRefresh', false)

    /**
     * for pull up and load
     * pullUpLoad: {
     *   threshold: 50
     * }
     */
    this.set('pullUpLoad', false)

    /**
     * for mouse wheel
     * mouseWheel: {
     *   speed: 20,
     *   invert: false,
     *   easeTime: 300
     * }
     */
    this.set('mouseWheel', false)

    /**
     * for zoom
     * zoom: {
     *   start: 1,
     *   min: 1,
     *   max: 4
     * }
     */
    this.set('zoom', false)

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
    this.set('infinity', false)

    /**
     * for double click
     * dblclick: {
     *   delay: 300
     * }
     */
    this.set('dblclick', false)
  }
  set(key: string, value: any) {
    this[key] = value
  }
  merge(options: { [key: string]: any }) {
    for (let key in options) {
      this[key] = options[key]
    }
    return this
  }
  process() {
    this.useTransition = this.useTransition && hasTransition
    this.useTransform = this.useTransform && hasTransform

    this.preventDefault = !this.eventPassthrough && this.preventDefault

    // If you want eventPassthrough I have to lock one of the axes
    this.scrollX = this.eventPassthrough === 'horizontal' ? false : this.scrollX
    this.scrollY = this.eventPassthrough === 'vertical' ? false : this.scrollY

    // With eventPassthrough we also need lockDirection mechanism
    this.freeScroll = this.freeScroll && !this.eventPassthrough
    this.directionLockThreshold = this.eventPassthrough
      ? 0
      : this.directionLockThreshold

    return this
  }
}
