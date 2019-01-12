import { style } from '../util'
import EventEmitter from '../base/EventEmitter'
import { Position, Transform } from '../translater'

export default class Transition {
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

  startProbe() {
    const probe = () => {
      let pos = this.translater.getPosition()
      this.hooks.trigger(this.hooks.eventTypes.scroll, pos)
      if (!this.pending) {
        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, pos)
        return
      }
      this.timer = requestAnimationFrame(probe)
    }
    cancelAnimationFrame(this.timer)
    this.timer = requestAnimationFrame(probe)
  }

  transitionTime(time = 0) {
    this.style[style.transitionDuration as any] = time + 'ms'
  }

  transitionTimingFunction(easing: string) {
    this.style[style.transitionTimingFunction as any] = easing
  }

  translate(x: number, y: number, scale: number) {
    this.translater.setPosition(x, y, scale)
  }
  scrollTo() {
    this.pending = true
  }
  stop(x: number, y: number) {
    // still in transition
    if (this.pending) {
      this.pending = false
      cancelAnimationFrame(this.timer)
      let pos = this.translater.getPosition()
      this.transitionTime()
      this.translate(pos.x, pos.y)
      this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
        x: pos.x,
        y: pos.y
      })
      this.stopFromTransition = true
    }
  }
}
