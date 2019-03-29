import {
  style,
  requestAnimationFrame,
  cancelAnimationFrame,
  EaseFn
} from '../util'
import { Probe } from '../enums/probe'
import Base from './Base'
import { TranslaterPoint } from '../translater'

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
    this.hooks.trigger(this.hooks.eventTypes.time, time)
  }

  transitionTimingFunction(easing: string) {
    this.style[style.transitionTimingFunction] = easing
    this.hooks.trigger(this.hooks.eventTypes.timeFunction, easing)
  }

  move(
    startPoint: TranslaterPoint,
    endPoint: TranslaterPoint,
    time: number,
    easingFn: string | EaseFn,
    isSlient?: boolean
  ) {
    this.setPending(
      time > 0 && (startPoint.x !== endPoint.x || startPoint.y !== endPoint.y)
    )
    this.transitionTimingFunction(easingFn as string)
    this.transitionTime(time)
    this.translate(endPoint)

    // TODO when probeType is not Realtime, need to dispatch scroll ?
    if (time && this.options.probeType === Probe.Realtime) {
      this.startProbe()
    }

    // when time is 0
    // no need to dispatch move and end when slient
    if (!time && !isSlient) {
      this.hooks.trigger(this.hooks.eventTypes.move, endPoint)

      this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
    }
  }

  stop() {
    // still in transition
    if (this.pending) {
      this.setPending(false)
      cancelAnimationFrame(this.timer)
      const { x, y } = this.translater.getComputedPosition()
      this.transitionTime()
      this.translate({ x, y })
      this.setForceStopped(true)
      this.hooks.trigger(this.hooks.eventTypes.forceStop, { x, y })
    }
  }
}
