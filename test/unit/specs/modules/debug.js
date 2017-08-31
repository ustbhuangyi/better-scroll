import { warn } from 'scroll/util/debug'

describe('debug.js', () => {
  it('#warn()', () => {
    const originErr = console.error
    const error = sinon.spy()
    console.error = error
    const msg = 'test msg'
    warn(msg)
    expect(error)
      .to.be.calledWith(`[BScroll warn]: ${msg}`)
    console.error = originErr
  })
})
