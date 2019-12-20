import DirectionLock from '../DirectionLock'

describe('DirectionLock Class tests', () => {
  let directionLock: DirectionLock
  let e = new Event('touchstart') as any

  beforeEach(() => {
    directionLock = new DirectionLock(5, false, '')
  })

  it('should call reset when call constructor function', () => {
    expect(directionLock.directionLocked).toBe('')
  })

  it('should lock vertically when scrolled in direction Y', () => {
    directionLock.checkMovingDirection(0, 20, e)

    expect(directionLock.directionLocked).toBe('vertical')
  })

  it('should lock horizontally when scrolled in direction X', () => {
    directionLock.checkMovingDirection(20, 0, e)

    expect(directionLock.directionLocked).toBe('horizontal')
  })

  it('should no lock when freeScroll is true', () => {
    directionLock.freeScroll = true
    directionLock.checkMovingDirection(20, 20, e)

    expect(directionLock.directionLocked).toBe('')
  })
})
