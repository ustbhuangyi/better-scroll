import {
  EaseFn,
  safeCSSStyleDeclaration,
  cancelAnimationFrame,
  EventEmitter
} from '@better-scroll/shared-utils'
import Translater, { TranslaterPoint } from '../translater'

export type Displacement = [number, number]
export default abstract class Base {
  style: safeCSSStyleDeclaration
  hooks: EventEmitter
  timer: number
  pending: boolean
  forceStopped: boolean
  _reflow: number
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
      'beforeForceStop',
      'forceStop',
      'time',
      'timeFunction'
    ])
    this.style = content.style as safeCSSStyleDeclaration
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
    easing: string | EaseFn,
    isSilent?: boolean
  ): void
  abstract stop(): void

  destroy() {
    this.hooks.destroy()

    cancelAnimationFrame(this.timer)
  }
}
