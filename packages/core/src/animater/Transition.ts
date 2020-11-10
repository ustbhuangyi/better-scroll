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

      // call bs.stop() should not dispatch end hook again.
      // forceStop hook will do this.
      if (!this.pending) {
        if (this.callStopWhenPending) {
          this.callStopWhenPending = false
        } else {
          // transition ends should dispatch end hook.
          this.hooks.trigger(this.hooks.eventTypes.end, pos)
        }
      }

      if (this.pending) {
        this.timer = requestAnimationFrame(probe)
      }
    }
    // when manually call bs.stop(), then bs.scrollTo()
    // we should reset callStopWhenPending to dispatch end hook
    if (this.callStopWhenPending) {
      this.setCallStop(false)
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
    this.setCallStop(false)
    // still in transition
    if (pending) {
      this.setPending(false)
      cancelAnimationFrame(this.timer)
      const { x, y } = this.translater.getComputedPosition()
      this.transitionTime()
      this.translate({ x, y })
      this.setForceStopped(true)
      this.setCallStop(true)

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
