import Base from './Base'
import { TranslaterPoint } from '../translater'
import {
  getNow,
  requestAnimationFrame,
  cancelAnimationFrame,
  EaseFn,
  Probe,
} from '@better-scroll/shared-utils'

export default class Animation extends Base {
  move(
    startPoint: TranslaterPoint,
    endPoint: TranslaterPoint,
    time: number,
    easingFn: EaseFn | string
  ) {
    // time is 0
    if (!time) {
      this.translate(endPoint)
      if (this.options.probeType === Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.move, endPoint)
      }
      this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
      return
    }
    this.animate(startPoint, endPoint, time, easingFn as EaseFn)
  }

  private animate(
    startPoint: TranslaterPoint,
    endPoint: TranslaterPoint,
    duration: number,
    easingFn: EaseFn
  ) {
    let startTime = getNow()
    const destTime = startTime + duration
    const isRealtimeProbeType = this.options.probeType === Probe.Realtime
    const step = () => {
      let now = getNow()
      // js animation end
      if (now >= destTime) {
        this.translate(endPoint)
        if (isRealtimeProbeType) {
          this.hooks.trigger(this.hooks.eventTypes.move, endPoint)
        }
        this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
        return
      }

      now = (now - startTime) / duration
      let easing = easingFn(now)
      const newPoint = {} as TranslaterPoint
      Object.keys(endPoint).forEach((key) => {
        const startValue = startPoint[key]
        const endValue = endPoint[key]
        newPoint[key] = (endValue - startValue) * easing + startValue
      })
      this.translate(newPoint)

      if (isRealtimeProbeType) {
        this.hooks.trigger(this.hooks.eventTypes.move, newPoint)
      }

      if (this.pending) {
        this.timer = requestAnimationFrame(step)
      }

      // call bs.stop() should not dispatch end hook again.
      // forceStop hook will do this.
      /* istanbul ignore if  */
      if (!this.pending) {
        if (this.callStopWhenPending) {
          this.callStopWhenPending = false
        } else {
          // raf ends should dispatch end hook.
          this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
        }
      }
    }

    this.setPending(true)
    // when manually call bs.stop(), then bs.scrollTo()
    // we should reset callStopWhenPending to dispatch end hook
    if (this.callStopWhenPending) {
      this.setCallStop(false)
    }
    cancelAnimationFrame(this.timer)
    step()
  }

  doStop(): boolean {
    const pending = this.pending
    this.setForceStopped(false)
    this.setCallStop(false)
    // still in requestFrameAnimation
    if (pending) {
      this.setPending(false)
      cancelAnimationFrame(this.timer)
      const pos = this.translater.getComputedPosition()
      this.setForceStopped(true)
      this.setCallStop(true)

      this.hooks.trigger(this.hooks.eventTypes.forceStop, pos)
    }
    return pending
  }

  stop() {
    const stopFromAnimation = this.doStop()
    if (stopFromAnimation) {
      this.hooks.trigger(this.hooks.eventTypes.callStop)
    }
  }
}
