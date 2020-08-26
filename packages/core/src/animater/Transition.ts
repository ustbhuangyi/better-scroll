import {
  style,
  requestAnimationFrame,
  cancelAnimationFrame,
  EaseFn,
  Probe,
} from '@better-scroll/shared-utils'
import Base from './Base'
import { TranslaterPoint } from '../translater'

export default class Transition extends Base {
  startProbe() {
    const probe = () => {
      let pos = this.translater.getComputedPosition()
      this.hooks.trigger(this.hooks.eventTypes.move, pos)
      // transition ends should dispatch end hook.
      // but when call stop() in animation.hooks.move or bs.scroll
      // should not dispatch end hook, because forceStop hook will do this.
      if (!this.pending && !this.forceStopped) {
        this.hooks.trigger(this.hooks.eventTypes.end, pos)
      }

      if (this.pending) {
        this.timer = requestAnimationFrame(probe)
      }
    }
    cancelAnimationFrame(this.timer)
    probe()
  }

  transitionTime(time = 0) {
    this.style[style.transitionDuration] = time + 'ms'
    this.hooks.trigger(this.hooks.eventTypes.time, time)
  }

  transitionTimingFunction(easing: string) {
    this.style[style.transitionTimingFunction] = easing
    this.hooks.trigger(this.hooks.eventTypes.timeFunction, easing)
  }

  transitionProperty() {
    this.style[style.transitionProperty] = style.transform
  }

  move(
    startPoint: TranslaterPoint,
    endPoint: TranslaterPoint,
    time: number,
    easingFn: string | EaseFn
  ) {
    this.setPending(time > 0)
    this.transitionTimingFunction(easingFn as string)
    this.transitionProperty()
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

      this.hooks.trigger(this.hooks.eventTypes.move, endPoint)
      this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
    }
  }

  doStop(): boolean {
    const pending = this.pending
    this.setForceStopped(false)
    // still in transition
    if (pending) {
      this.setPending(false)
      cancelAnimationFrame(this.timer)
      const { x, y } = this.translater.getComputedPosition()
      this.transitionTime()
      this.translate({ x, y })
      this.setForceStopped(true)

      if (this.hooks.trigger(this.hooks.eventTypes.beforeForceStop, { x, y })) {
        return true
      }

      this.hooks.trigger(this.hooks.eventTypes.forceStop, { x, y })
    }
    return pending
  }

  stop() {
    const stopFromTransition = this.doStop()
    if (stopFromTransition) {
      this.hooks.trigger(this.hooks.eventTypes.callStop)
    }
  }
}
