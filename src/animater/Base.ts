import EventEmitter from '../base/EventEmitter'
import { EaseFn, safeCSSStyleDeclaration } from '../util'
import { Position, Transform } from '../translater'

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
    this.hooks = new EventEmitter(['move', 'end', 'forceStop'])
    this.style = element.style as safeCSSStyleDeclaration
  }

  translate(x: number, y: number) {
    this.translater.translateTo(x, y)
  }

  abstract scrollTo(
    x: Displacement,
    y: Displacement,
    time: number,
    easing: string | EaseFn
  ): void
  abstract stop(): void
}
