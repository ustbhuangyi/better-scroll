import { momentum } from 'scroll/util/momentum'

describe('momentum.js', () => {
  it('#momentum()', () => {
    let ret = momentum(-2609, -2994, 43.4299, -3298, 0, 414, {
      deceleration: 0.001,
      swipeBounceTime: 500,
      wheel: false,
      swipeTime: 2500
    })
    expect(ret.destination)
      .to.equal(104)
    expect(ret.duration)
      .to.equal(500)

    ret = momentum(-311, -255, 240.975, -834, 0, 414, {
      deceleration: 0.001,
      swipeBounceTime: 500,
      wheel: false,
      swipeTime: 2500
    })
    expect(ret.destination)
      .to.equal(-543)
    expect(ret.duration)
      .to.equal(2500)

    ret = momentum(-1111, -834, 92.465, -1138, 0, 414, {
      deceleration: 0.001,
      swipeBounceTime: 500,
      wheel: false,
      swipeTime: 2500
    })
    expect(ret.destination)
      .to.equal(-1221)
    expect(ret.duration)
      .to.equal(500)
  })
})
