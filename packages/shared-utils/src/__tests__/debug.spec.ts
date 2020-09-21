import { warn, assert } from '../debug'

describe('debug', () => {
  it('should work well when call warn()', () => {
    const spyFn = jest.spyOn(console, 'error')
    warn('Error occured')

    expect(spyFn).toBeCalledWith('[BScroll warn]: Error occured')
  })

  it('should work well when call assert()', () => {
    const a = 1 + Math.random()
    const b = 2
    expect(() => {
      assert(a > b, '')
    }).toThrow()
  })
})
