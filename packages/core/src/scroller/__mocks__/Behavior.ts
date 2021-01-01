import { EventEmitter } from '@better-scroll/shared-utils'

const Behavior = jest.fn().mockImplementation((content, bscrollOptions) => {
  return {
    content,
    options: bscrollOptions,
    startPos: 0,
    currentPos: 0,
    absStartPos: 0,
    dist: 0,
    minScrollPos: 0,
    maxScrollPos: 0,
    hasScroll: true,
    direction: 0,
    movingDirection: 0,
    relativeOffset: 0,
    wrapperSize: 0,
    contentSize: 0,
    hooks: new EventEmitter([
      'momentum',
      'end',
      'beforeComputeBoundary',
      'computeBoundary',
      'ignoreHasScroll',
    ]),
    start: jest.fn(),
    move: jest.fn(),
    end: jest.fn(),
    updateDirection: jest.fn(),
    refresh: jest.fn(),
    updatePosition: jest.fn(),
    getCurrentPos: jest.fn().mockImplementation(() => {
      return 0
    }),
    checkInBoundary: jest.fn().mockImplementation(() => {
      return {
        position: 0,
        inBoundary: false,
      }
    }),
    adjustPosition: jest.fn(),
    updateStartPos: jest.fn(),
    updateAbsStartPos: jest.fn(),
    resetStartPos: jest.fn(),
    getAbsDist: jest.fn().mockImplementation((delta: number) => {
      return Math.abs(delta)
    }),
    destroy: jest.fn(),
    computeBoundary: jest.fn(),
    setMovingDirection: jest.fn(),
    setDirection: jest.fn(),
    performDampingAlgorithm: jest.fn(),
  }
})

export { Behavior }
