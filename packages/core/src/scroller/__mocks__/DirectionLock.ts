const DirectionLock = jest
  .fn()
  .mockImplementation((content, bscrollOptions) => {
    return {
      directionLocked: '',
      directionLockThreshold: '5',
      eventPassthrough: '',
      freeScroll: false,
      reset: jest.fn(),
      checkMovingDirection: jest.fn().mockImplementation((ret = true) => {
        return ret
      }),
      adjustDelta: jest
        .fn()
        .mockImplementation((deltaX: number = 0, deltaY: number = 0) => {
          return {
            deltaX,
            deltaY,
          }
        }),
    }
  })

export default DirectionLock
