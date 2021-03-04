import { inBrowser } from './env'

interface DelayedHandler {
  (): void
  interval: number
}

const DEFAULT_INTERVAL = 1000 / 60
const windowCompat = inBrowser && (window as any)

/* istanbul ignore next */
function noop() {}

export const requestAnimationFrame = (() => {
  /* istanbul ignore if  */
  if (!inBrowser) {
    return noop
  }
  return (
    windowCompat.requestAnimationFrame ||
    windowCompat.webkitRequestAnimationFrame ||
    windowCompat.mozRequestAnimationFrame ||
    windowCompat.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
    function (callback: DelayedHandler) {
      return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL) // make interval as precise as possible.
    }
  )
})()

export const cancelAnimationFrame = (() => {
  /* istanbul ignore if  */
  if (!inBrowser) {
    return noop
  }
  return (
    windowCompat.cancelAnimationFrame ||
    windowCompat.webkitCancelAnimationFrame ||
    windowCompat.mozCancelAnimationFrame ||
    windowCompat.oCancelAnimationFrame ||
    function (id: number) {
      window.clearTimeout(id)
    }
  )
})()
