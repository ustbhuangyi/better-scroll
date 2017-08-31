import { getNow, extend } from 'scroll/util/lang'

describe('lang.js', () => {
  it('#getNow()', () => {
    const now = Date.now()
    expect(getNow() - now < 3)
      .to.be.true
  })
  it('#extend()', () => {
    const target = {}
    const source = {
      a: 'a',
      b: {
        c: 'c'
      },
      d: ['2'],
      e: [
        {
          m: 'm'
        }
      ]
    }
    extend(target, source, {
      a: 'aa'
    })
    expect(target.a)
      .to.equal('aa')
    expect(target.b)
      .to.equal(source.b)
    expect(target.d)
      .to.equal(source.d)
    expect(target.e.length)
      .to.equal(1)
    expect(target.e[0])
      .to.equal(source.e[0])
  })
})
