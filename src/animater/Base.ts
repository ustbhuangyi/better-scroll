import EventEmitter from '../base/EventEmitter'
import { EaseFn, safeCSSStyleDeclaration } from '../util'
import Translater, { TranslaterPoint } from '../translater'

export type Displacement = [number, number]
export default abstract class Base {
  style: safeCSSStyleDeclaration
  hooks: EventEmitter
  timer: number
  pending: boolean
  forceStopped: boolean
  [key: string]: any

  constructor(
    public content: HTMLElement,
    public translater: Translater,
    public options: {
      probeType: number
    }
  ) {
    this.hooks = new EventEmitter([
      'move',
      'end',
      'forceStop',
      'time',
      'timeFunction',
      'pointerEvents'
    ])
    this.style = content.style as safeCSSStyleDeclaration
    this.watchPointerEvents()
  }

  watchPointerEvents() {
    let me = this
    let isPending = false
    Object.defineProperty(this, 'pending', {
      get() {
        return isPending
      },
      set(newVal) {
        isPending = newVal
        const enablePointerEvents = { enabled: false }
        this.hooks.trigger(
          this.hooks.eventTypes.pointerEvents,
          enablePointerEvents
        )
        // fix issue #359
        let el = me.content.children.length ? me.content.children : [me.content]
        let pointerEvents =
          isPending && !enablePointerEvents.enabled ? 'none' : 'auto'
        for (let i = 0; i < el.length; i++) {
          ;(el[i] as HTMLElement).style.pointerEvents = pointerEvents
        }
      }
    })
  }

  translate(endPoint: TranslaterPoint) {
    this.translater.translate(endPoint)
  }

  setPending(pending: boolean) {
    this.pending = pending
  }

  setForceStopped(forceStopped: boolean) {
    this.forceStopped = forceStopped
  }

  abstract move(
    startPoint: TranslaterPoint,
    endPoint: TranslaterPoint,
    time: number,
    easing: string | EaseFn
  ): void
  abstract stop(): void
}
