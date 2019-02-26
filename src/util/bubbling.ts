import { Context } from 'vm'

interface BubblingEventMap {
  source: string
  target: string
}
export function bubbling(
  source: Context,
  context: Context,
  events: BubblingEventMap[]
) {
  events.forEach(event => {
    source.hooks.on(event.source, function(...args: any[]) {
      context.hooks.trigger(event.target, ...args)
    })
  })
}
