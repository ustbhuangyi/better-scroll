import EventEmitter from '../base/EventEmitter'

export default class Animation {
  style: CSSStyleDeclaration
  hooks: EventEmitter
  timer: number
  pending: boolean
  stopFromTransition?: boolean
  constructor(
    public element: HTMLElement,
    public translater: Position | Transform
  ) {
    this.hooks = new EventEmitter(['scroll', 'scrollEnd'])
    this.style = element.style
  }

  animate() {}

  translate() {}

  stop(x: number, y: number) {
    // still in requestFrameAnimation
    if (this.pending) {
      this.pending = false
      cancelAnimationFrame(this.timer)
      this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
        x,
        y
      })
      this.stopFromTransition = true
    }
  }
}
