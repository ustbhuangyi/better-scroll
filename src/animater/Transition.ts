import {
  style,
  requestAnimationFrame,
  cancelAnimationFrame,
  Probe,
  ease,
  EaseFn
} from '../util'
import Base from './Base'
import { Position, Transform } from '../translater'

export default class Transition extends Base {
  constructor(
    element: HTMLElement,
    translater: Position | Transform,
    options: {
      probeType: number
      bounceTime: number
    }
  ) {
    super(element, translater, options)
  }

  startProbe() {
    const probe = () => {
      let pos = this.translater.getComputedPosition()
      this.callHooks(this.hooks.eventTypes.scroll, pos)
      // excuted when transition ends
      if (!this.pending) {
        this.callHooks(this.hooks.eventTypes.scrollEnd, pos)
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

  scrollTo(x: number, y: number, time: number, easingFn: string | EaseFn) {
    this.pending = time > 0
    this.transitionTimingFunction(easingFn as string)
    this.transitionTime(time)
    this.translater.updatePosition(x, y, this.translater.scale)

    // TODO when probeType is not Realtime, need to dispatch scroll ?
    if (time && this.options.probeType === Probe.Realtime) {
      this.startProbe()
    }

    // when time is 0
    if (!time) {
      this.callHooks(this.hooks.eventTypes.scroll, {
        x,
        y
      })
      // force reflow to put everything in position
      this._reflow = document.body.offsetHeight
      if (!this.resetPosition(this.options.bounceTime)) {
        this.callHooks(this.hooks.eventTypes.scrollEnd)
      }
    }
  }

  stop() {
    // still in transition
    if (this.pending) {
      this.pending = false
      cancelAnimationFrame(this.timer)
      let pos = this.translater.getComputedPosition()
      this.transitionTime()
      this.translate(pos.x, pos.y, this.translater.scale)
      this.callHooks(this.hooks.eventTypes.scrollEnd, {
        x: pos.x,
        y: pos.y
      })
      this.forceStopped = true
    }
  }

  resetPosition(time = 0, easing = ease.bounce) {
    const easingStyle = easing.style
    return this._resetPosition(time, easingStyle)
  }
}
