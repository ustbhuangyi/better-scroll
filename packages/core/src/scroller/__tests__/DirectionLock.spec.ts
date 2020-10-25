import DirectionLock from '../DirectionLock'
import {
  Direction,
  DirectionLock as DirectionLockEnum,
} from '@better-scroll/shared-utils'
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

  it('adjustDelta() ', () => {
    directionLock.directionLocked = DirectionLockEnum.Horizontal
    const ret1 = directionLock.adjustDelta(20, 20)
    expect(ret1).toMatchObject({
      deltaX: 20,
      deltaY: 0,
    })

    directionLock.directionLocked = DirectionLockEnum.Vertical
    const ret2 = directionLock.adjustDelta(20, 20)
    expect(ret2).toMatchObject({
      deltaX: 0,
      deltaY: 20,
    })
  })

  it('reset()', () => {
    directionLock.directionLocked = DirectionLockEnum.Vertical
    directionLock.reset()
    expect(directionLock.directionLocked).toBe(DirectionLockEnum.Default)
  })

  it('checkMovingDirection()', () => {
    directionLock.directionLocked = DirectionLockEnum.Horizontal
    directionLock.eventPassthrough = DirectionLockEnum.Horizontal
    const ret1 = directionLock.checkMovingDirection(20, 20, {
      preventDefault() {
        return true
      },
    } as any)
    expect(ret1).toBe(true)

    directionLock.directionLocked = DirectionLockEnum.Horizontal
    directionLock.eventPassthrough = DirectionLockEnum.Vertical
    const ret2 = directionLock.checkMovingDirection(20, 20, {
      preventDefault() {
        return true
      },
    } as any)
    expect(ret2).toBe(false)

    // no locked
    directionLock.directionLocked = DirectionLockEnum.Default
    const ret3 = directionLock.checkMovingDirection(20, 20, {
      preventDefault() {
        return true
      },
    } as any)
    expect(ret3).toBe(false)
  })
})
