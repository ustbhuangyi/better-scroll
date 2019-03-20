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
    public element: HTMLElement,
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
      'timeFunction'
    ])
    this.style = element.style as safeCSSStyleDeclaration
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
