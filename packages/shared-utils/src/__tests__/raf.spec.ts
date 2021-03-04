import { requestAnimationFrame, cancelAnimationFrame } from '../raf'

jest.mock('../env', () => {
  const windowCompat = window as any
  windowCompat.requestAnimationFrame = null
  windowCompat.webkitRequestAnimationFrame = null
  windowCompat.mozRequestAnimationFrame = null
  windowCompat.oRequestAnimationFrame = null

  windowCompat.cancelAnimationFrame = null
  windowCompat.webkitCancelAnimationFrame = null
  windowCompat.mozCancelAnimationFrame = null
  windowCompat.oCancelAnimationFrame = null
  return {
    inBrowser: true,
  }
})
describe('raf', () => {
  it('should fallback setTimeout or clearTimeout', () => {
    jest.useFakeTimers()
    const spySetTimeout = jest.spyOn(window, 'setTimeout')
    const spyClearTimeout = jest.spyOn(window, 'clearTimeout')
    const mockFn = jest.fn()

    const timer = requestAnimationFrame(mockFn)
    jest.advanceTimersByTime(17)

    expect(mockFn).toBeCalled()
    expect(spySetTimeout).toBeCalled()
    cancelAnimationFrame(timer)
    expect(spyClearTimeout).toBeCalled()
  })
})
