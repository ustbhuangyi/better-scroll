import {
  style,
  requestAnimationFrame,
  cancelAnimationFrame,
  EaseFn,
  Probe
} from '@better-scroll/shared-utils'
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

    if (time && this.options.probeType === Probe.Realtime) {
      this.startProbe()
    }

    // if we change content's transformY in a tick
    // such as: 0 -> 50px -> 0
    // transitionend will not be triggered
    // so we forceupdate by reflow
    if (!time) {
      this._reflow = this.content.offsetHeight
    }

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

      if (this.hooks.trigger(this.hooks.eventTypes.beforeForceStop, { x, y })) {
        return
      }

      this.hooks.trigger(this.hooks.eventTypes.forceStop, { x, y })
    }
  }
}
