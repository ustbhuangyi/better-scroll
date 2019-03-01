import {
  style,
  requestAnimationFrame,
  cancelAnimationFrame,
  Probe,
  EaseFn
} from '../util'
import Base from './Base'
import { TransformPoint } from '../translater'

export default class Transition extends Base {
  startProbe() {
    const probe = () => {
      let pos = this.translater.getComputedPosition()
      this.hooks.trigger(this.hooks.eventTypes.move, pos)
      // excute when transition ends
      if (!this.pending) {
        this.hooks.trigger(this.hooks.eventTypes.end, pos)
        return
      }
      this.timer = requestAnimationFrame(probe)
    }
    cancelAnimationFrame(this.timer)
    this.timer = requestAnimationFrame(probe)
  }

  transitionTime(time = 0) {
    this.style[style.transitionDuration] = time + 'ms'
  }

  transitionTimingFunction(easing: string) {
    this.style[style.transitionTimingFunction] = easing
  }

  scrollTo(
    startPoint: TransformPoint,
    endPoint: TransformPoint,
    time: number,
    easingFn: string | EaseFn
  ) {
    this.pending = time > 0
    this.transitionTimingFunction(easingFn as string)
    this.transitionTime(time)
    this.translate(endPoint)

    // TODO when probeType is not Realtime, need to dispatch scroll ?
    if (time && this.options.probeType === Probe.Realtime) {
      this.startProbe()
    }

    // when time is 0
    if (!time) {
      this.hooks.trigger(this.hooks.eventTypes.move, endPoint)
      // force reflow to put everything in position
      this._reflow = document.body.offsetHeight
      // maybe need reset position
      this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
    }
  }

  stop() {
    // still in transition
    if (this.pending) {
      this.pending = false
      cancelAnimationFrame(this.timer)
      const { x, y } = this.translater.getComputedPosition()
      this.transitionTime()
      this.translate({ x, y })
      this.forceStopped = true
      this.hooks.trigger(this.hooks.eventTypes.forceStop)
    }
  }
}
