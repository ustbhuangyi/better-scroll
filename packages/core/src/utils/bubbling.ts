import { EventEmitter } from '@better-scroll/shared-utils'

interface BubblingEventMap {
  source: string
  target: string
}
type BubblingEventConfig = BubblingEventMap | string
export function bubbling(
  source: EventEmitter,
  target: EventEmitter,
  events: BubblingEventConfig[]
) {
  events.forEach(event => {
    let sourceEvent: string
    let targetEvent: string
    if (typeof event === 'string') {
      sourceEvent = targetEvent = event
    } else {
      sourceEvent = event.source
      targetEvent = event.target
    }
    source.on(sourceEvent, function(...args: any[]) {
      return target.trigger(targetEvent, ...args)
    })
  })
}
