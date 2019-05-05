export function warn(msg: string) {
  console.error(`[BScroll warn]: ${msg}`)
}

export function assert(condition: string | boolean, msg: string) {
  if (!condition) {
    throw new Error('[BScroll] ' + msg)
  }
}
