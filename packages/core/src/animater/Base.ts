import {
  EaseFn,
  safeCSSStyleDeclaration,
  cancelAnimationFrame,
  EventEmitter,
} from '@better-scroll/shared-utils'
import Translater, { TranslaterPoint } from '../translater'

export interface ExposedAPI {
  stop(): void
}

export default abstract class Base implements ExposedAPI {
  style: safeCSSStyleDeclaration
  hooks: EventEmitter
  timer: number = 0
  pending: boolean
  forceStopped: boolean
  _reflow: number;
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
      'callStop',
      'time',
      'timeFunction',
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
    easing: string | EaseFn
  ): void

  abstract doStop(): void
  abstract stop(): void

  destroy() {
    this.hooks.destroy()

    cancelAnimationFrame(this.timer)
  }
}
