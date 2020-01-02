export function getNow() {
  return window.performance && window.performance.now && window.performance.timing
    ? window.performance.now() + window.performance.timing.navigationStart
    : +new Date()
}

export function extend(
  target: { [key: string]: any },
  ...rest: { [key: string]: any }[]
): object {
  for (let i = 0; i < rest.length; i++) {
    let source = rest[i]
    for (let key in source) {
      target[key] = source[key] as any
    }
  }
  return target
}

export function isUndef(v: any): boolean {
  return v === undefined || v === null
}

export function isPlainObject(v: any): boolean {
  return typeof v === 'object' && v !== null
}

export function getDistance(x: number, y: number) {
  return Math.sqrt(x * x + y * y)
}
export function fixInboundValue(x: number, min: number, max: number) {
  if (x < min) {
    return min
  }
  if (x > max) {
    return max
  }
  return x
}
