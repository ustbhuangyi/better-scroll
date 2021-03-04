// ssr support
export const inBrowser = typeof window !== 'undefined'
export const ua = inBrowser && navigator.userAgent.toLowerCase()
export const isWeChatDevTools = !!(ua && /wechatdevtools/.test(ua))
export const isAndroid = ua && ua.indexOf('android') > 0

/* istanbul ignore next */
export const isIOSBadVersion: boolean = (() => {
  if (typeof ua === 'string') {
    const regex = /os (\d\d?_\d(_\d)?)/
    const matches = regex.exec(ua)
    if (!matches) return false
    const parts = matches[1].split('_').map(function (item) {
      return parseInt(item, 10)
    })
    // ios version >= 13.4 issue 982
    return !!(parts[0] === 13 && parts[1] >= 4)
  }
  return false
})()

/* istanbul ignore next */
export let supportsPassive = false
/* istanbul ignore next */
if (inBrowser) {
  const EventName = 'test-passive' as any
  try {
    const opts = {}
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true
      },
    }) // https://github.com/facebook/flow/issues/285
    window.addEventListener(EventName, () => {}, opts)
  } catch (e) {}
}
