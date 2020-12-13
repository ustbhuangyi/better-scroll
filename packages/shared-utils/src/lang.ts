export function getNow() {
  return window.performance &&
    window.performance.now &&
    window.performance.timing
    ? window.performance.now() + window.performance.timing.navigationStart
    : +new Date()
}

export const extend = <T extends object, U extends object>(
  target: T,
  source: U
): T & U => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target as T & U
}

export function isUndef(v: any): boolean {
  return v === undefined || v === null
}

export function getDistance(x: number, y: number) {
  return Math.sqrt(x * x + y * y)
}
export function between(x: number, min: number, max: number) {
  if (x < min) {
    return min
  }
  if (x > max) {
    return max
  }
  return x
}

export function findIndex<T>(
  ary: T[],
  fn: (value: T, index: number, arr?: T[]) => boolean
) {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some(function (item, i, ary) {
    const ret = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}
