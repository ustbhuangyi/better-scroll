import { requestAnimationFrame, cancelAnimationFrame } from 'scroll/util/raf'

describe('raf.js', () => {
  it('#requestAnimationFrame() & #cancelAnimationFrame()', () => {
    const fn = sinon.spy()
    let id = requestAnimationFrame(fn)
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(fn)
          .to.be.calledOnce
        cancelAnimationFrame(id)
        setTimeout(() => {
          expect(fn)
            .not.to.be.calledTwice
          resolve()
        }, 20)
      }, 20)
    })
  })
})
