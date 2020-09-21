import { ease } from '../ease'

describe('ease', () => {
  it('swipe fn', () => {
    const handler = ease.swipe.fn
    const time1 = handler(0.2)
    const time2 = handler(0.4)
    const time3 = handler(0.5)
    const time4 = handler(0.6)
    const time5 = handler(0.8)
    const time6 = handler(1)

    expect(time1).toBeCloseTo(0.6723)
    expect(time2).toBeCloseTo(0.92224)
    expect(time3).toBeCloseTo(0.96875)
    expect(time4).toBeCloseTo(0.98976)
    expect(time5).toBeCloseTo(0.99968)
    expect(time6).toBeCloseTo(1)
  })

  it('swipeBounce fn', () => {
    const handler = ease.swipeBounce.fn
    const time1 = handler(0.2)
    const time2 = handler(0.4)
    const time3 = handler(0.5)
    const time4 = handler(0.6)
    const time5 = handler(0.8)
    const time6 = handler(1)

    expect(time1).toBeCloseTo(0.36)
    expect(time2).toBeCloseTo(0.64)
    expect(time3).toBeCloseTo(0.75)
    expect(time4).toBeCloseTo(0.84)
    expect(time5).toBeCloseTo(0.96)
    expect(time6).toBeCloseTo(1)
  })
})
