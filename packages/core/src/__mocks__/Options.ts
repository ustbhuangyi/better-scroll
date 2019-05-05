const mockOptions = jest.fn().mockImplementation(() => {
  return {
    startX: 0,
    startY: 0,
    scrollX: false,
    scrollY: true,
    freeScroll: false,
    directionLockThreshold: 5,
    eventPassthrough: '',
    click: false,
    tap: '',
    translateZ: ' translateZ(0)',

    bounce: {
      top: true,
      bottom: true,
      left: true,
      right: true
    },
    bounceTime: 800,

    momentum: true,
    momentumLimitTime: 300,
    momentumLimitDistance: 15,

    swipeTime: 2500,
    swipeBounceTime: 500,

    deceleration: 0.0015,

    flickLimitTime: 200,
    flickLimitDistance: 100,

    resizePolling: 60,
    probeType: 0,

    stopPropagation: false,
    preventDefault: true,
    preventDefaultException: {
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
    },

    HWCompositing: true,

    useTransition: true,
    bindToWrapper: false,
    disableMouse: true,
    observeDOM: true,
    autoBlur: true,

    // plugins config

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
    // slide: false

    /**
     * for mouse wheel
     * mouseWheel: {
     *   speed: 20,
     *   invert: false,
     *   easeTime: 300
     * }
     */
    mouseWheel: false,

    /**
     * for zoom
     * zoom: {
     *   start: 1,
     *   min: 1,
     *   max: 4
     * }
     */
    // zoom: false

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
    infinity: false,

    merge: jest.fn(),
    process: jest.fn()
  }
})

export { mockOptions as Options }
