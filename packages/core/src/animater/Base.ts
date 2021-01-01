import {
  EaseFn,
  safeCSSStyleDeclaration,
  cancelAnimationFrame,
  EventEmitter,
  Probe,
} from '@better-scroll/shared-utils'
import Translater, { TranslaterPoint } from '../translater'

export interface ExposedAPI {
  stop(): void
}

export default abstract class Base implements ExposedAPI {
  content: HTMLElement
  style: safeCSSStyleDeclaration
  hooks: EventEmitter
  timer: number = 0
  pending: boolean
  callStopWhenPending: boolean
  forceStopped: boolean
  _reflow: number;
  [key: string]: any

  constructor(
    content: HTMLElement,
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
    this.setContent(content)
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

  setCallStop(called: boolean) {
    this.callStopWhenPending = called
  }

  setContent(content: HTMLElement) {
    if (this.content !== content) {
      this.content = content
      this.style = content.style as safeCSSStyleDeclaration
      this.stop()
    }
  }
  clearTimer() {
    if (this.timer) {
      cancelAnimationFrame(this.timer)
      this.timer = 0
    }
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
