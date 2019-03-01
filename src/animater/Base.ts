import EventEmitter from '../base/EventEmitter'
import { EaseFn, safeCSSStyleDeclaration } from '../util'
import { Position, Transform, TransformPoint } from '../translater'

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
    public translater: Transform | Position,
    public options: {
      probeType: number
    }
  ) {
    this.hooks = new EventEmitter(['move', 'end', 'forceStop', 'translate'])
    this.style = element.style as safeCSSStyleDeclaration
  }

  translate(endPoint: TransformPoint) {
    this.translater.translate(endPoint)
    this.hooks.trigger(this.hooks.eventTypes.translate, endPoint)
  }

  abstract scrollTo(
    startPoint: TransformPoint,
    endPoint: TransformPoint,
    time: number,
    easing: string | EaseFn
  ): void
  abstract stop(): void
}
