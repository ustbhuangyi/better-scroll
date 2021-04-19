const mockOptions = jest.fn().mockImplementation(() => {
  return {
    startX: 0,
    startY: 0,
    scrollX: false,
    scrollY: true,
    freeScroll: false,
    directionLockThreshold: 0,
    eventPassthrough: '',
    click: false,
    tap: '',
    translateZ: ' translateZ(0)',

    bounce: {
      top: true,
      bottom: true,
      left: true,
      right: true,
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
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/,
    },

    HWCompositing: true,

    useTransition: true,
    bindToWrapper: false,
    disableMouse: true,
    observeDOM: true,
    autoBlur: true,
    mouseWheel: false,
    infinity: false,
    specifiedIndexAsContent: 0,
    quadrant: 0,
    outOfBoundaryDampingFactor: 1 / 3,
    merge: jest.fn(),
    process: jest.fn(),
  }
})

export { mockOptions as OptionsConstructor }
