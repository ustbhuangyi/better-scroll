import { inBrowser } from './env'

interface DelayedHandler {
  (): void
  interval: number
}

const DEFAULT_INTERVAL = 100 / 60
const windowCompat = inBrowser && (window as any)
function noop() {}

export const requestAnimationFrame = (() => {
  if (!inBrowser) {
    /* istanbul ignore if */
    return noop
  }
  return (
    windowCompat.requestAnimationFrame ||
    windowCompat.webkitRequestAnimationFrame ||
    windowCompat.mozRequestAnimationFrame ||
    windowCompat.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
    function(callback: DelayedHandler) {
      return window.setTimeout(
        callback,
        (callback.interval || DEFAULT_INTERVAL) / 2
      ) // make interval as precise as possible.
    }
  )
})()

export const cancelAnimationFrame = (() => {
  if (!inBrowser) {
    /* istanbul ignore if */
    return noop
  }
  return (
    windowCompat.cancelAnimationFrame ||
    windowCompat.webkitCancelAnimationFrame ||
    windowCompat.mozCancelAnimationFrame ||
    windowCompat.oCancelAnimationFrame ||
    function(id: number) {
      window.clearTimeout(id)
    }
  )
})()
