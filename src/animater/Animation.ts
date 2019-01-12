import EventEmitter from '../base/EventEmitter'
import { Position, Transform } from '../translater'
import { getNow, Probe } from '../util'

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

  animate(destX: number, destY: number, duration: number, easingFn: Function) {
    let startX = this.translater.x
    let startY = this.translater.y
    let startScale = this.lastScale
    let destScale = this.scale
    let startTime = getNow()
    let destTime = startTime + duration

    const step = () => {
      let now = getNow()

      if (now >= destTime) {
        this.pending = false
        this.translate(destX, destY, destScale)

        this.hooks.trigger(this.hooks.eventTypes.scroll, {
          x: this.x,
          y: this.y
        })

        if (!this.resetPosition(this.options.bounceTime)) {
          this.hooks.trigger(this.hooks.eventTypes.scrollEnd, {
            x: this.x,
            y: this.y
          })
        }
        return
      }
      now = (now - startTime) / duration
      let easing = easingFn(now)
      let newX = (destX - startX) * easing + startX
      let newY = (destY - startY) * easing + startY
      let newScale = (destScale - startScale) * easing + startScale

      this.translate(newX, newY, newScale)

      if (this.pending) {
        this.timer = requestAnimationFrame(step)
      }

      if (this.options.probeType === Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.scroll, {
          x: this.x,
          y: this.y
        })
      }
    }

    this.pending = true
    cancelAnimationFrame(this.timer)
    step()
  }

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
