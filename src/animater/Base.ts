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
  _reflow: number
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
      'translate',
      'time',
      'timeFunction'
    ])
    this.style = element.style as safeCSSStyleDeclaration
  }

  translate(endPoint: TranslaterPoint) {
    this.translater.translate(endPoint)
    this.hooks.trigger(this.hooks.eventTypes.translate, endPoint)
  }

  abstract scrollTo(
    startPoint: TranslaterPoint,
    endPoint: TranslaterPoint,
    time: number,
    easing: string | EaseFn
  ): void
  abstract stop(): void
}
