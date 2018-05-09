export function getNow() {
  return window.performance && window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : +new Date()
}

export function extend(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let source = rest[i]
    for (let key in source) {
      target[key] = source[key]
    }
  }
  return target
}

export function isUndef(v) {
  return v === undefined || v === null
}

export function getDistance(x, y) {
  return Math.sqrt(x * x + y * y)
}
