import Base from './Base'
import { TranslaterPoint } from '../translater'
import {
  getNow,
  requestAnimationFrame,
  cancelAnimationFrame,
  EaseFn,
  Probe
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

      this.hooks.trigger(this.hooks.eventTypes.move, endPoint)
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
    const step = () => {
      let now = getNow()
      // js animation end
      if (now >= destTime) {
        this.translate(endPoint)

        this.hooks.trigger(this.hooks.eventTypes.move, endPoint)
        this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
        return
      }

      now = (now - startTime) / duration
      let easing = easingFn(now)
      const newPoint = {} as TranslaterPoint
      Object.keys(endPoint).forEach(key => {
        const startValue = startPoint[key]
        const endValue = endPoint[key]
        newPoint[key] = (endValue - startValue) * easing + startValue
      })
      this.translate(newPoint)

      if (this.options.probeType === Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.move, newPoint)
      }

      if (this.pending) {
        this.timer = requestAnimationFrame(step)
      }

      // when call stop() in animation.hooks.move or bs.scroll
      // should not dispatch end hook, because forceStop hook will do this.
      if (!this.pending && !this.forceStopped) {
        console.log(this.forceStopped)
        this.hooks.trigger(this.hooks.eventTypes.end, endPoint)
      }
    }

    this.setPending(true)
    cancelAnimationFrame(this.timer)
    step()
  }

  doStop(): boolean {
    const pending = this.pending
    this.setForceStopped(false)
    // still in requestFrameAnimation
    if (pending) {
      this.setPending(false)
      cancelAnimationFrame(this.timer)
      const pos = this.translater.getComputedPosition()
      this.setForceStopped(true)

      if (this.hooks.trigger(this.hooks.eventTypes.beforeForceStop, pos)) {
        return true
      }

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
