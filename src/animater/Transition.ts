import {
  style,
  requestAnimationFrame,
  cancelAnimationFrame,
  Probe,
  EaseFn
} from '../util'
import Base, { Displacement } from './Base'

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
    DisplacementX: Displacement,
    DisplacementY: Displacement,
    time: number,
    easingFn: string | EaseFn
  ) {
    // destinations
    const x = DisplacementX[1]
    const y = DisplacementY[1]

    this.pending = time > 0
    this.transitionTimingFunction(easingFn as string)
    this.transitionTime(time)
    this.translate(x, y)

    // TODO when probeType is not Realtime, need to dispatch scroll ?
    if (time && this.options.probeType === Probe.Realtime) {
      this.startProbe()
    }

    // when time is 0
    if (!time) {
      this.hooks.trigger(this.hooks.eventTypes.move, {
        x,
        y
      })
      // force reflow to put everything in position
      this._reflow = document.body.offsetHeight
      // maybe need reset position
      this.hooks.trigger(this.hooks.eventTypes.end, {
        x,
        y
      })
    }
  }

  stop() {
    // still in transition
    if (this.pending) {
      this.pending = false
      cancelAnimationFrame(this.timer)
      const { x, y } = this.translater.getComputedPosition()
      this.transitionTime()
      this.translate(x, y)
      this.hooks.trigger(this.hooks.eventTypes.forceStop, {
        x,
        y
      })
      this.forceStopped = true
    }
  }
}
