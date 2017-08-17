export function getNow() {
  return window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : +new Date()
}
