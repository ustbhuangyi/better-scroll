import { ease } from 'scroll/util/ease'

describe('ease.js', () => {
  it('#swipe', () => {
    expect(ease.swipe.fn(0.2).toFixed(2))
      .to.equal('0.67')
  })
  it('#swipeBounce', () => {
    expect(ease.swipeBounce.fn(0.2).toFixed(2))
      .to.equal('0.36')
  })
  it('#bounce', () => {
    expect(ease.bounce.fn(0.2).toFixed(2))
      .to.equal('0.59')
  })
})
