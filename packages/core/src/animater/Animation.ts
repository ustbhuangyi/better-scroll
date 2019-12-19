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
    easingFn: EaseFn | string,
    isSlient?: boolean
  ) {
    // time is 0
    if (!time) {
      this.translate(endPoint)
      // if we change content's transformY in a tick
      // such as: 0 -> 50px -> 0
      // transitionend will not be triggered
      // so we forceupdate by reflow
      this._reflow = this.content.offsetHeight
      // no need to dispatch move and end when slient
      if (isSlient) return

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
    let destTime = startTime + duration

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
      const newPoint = {} as { [key: string]: any }
      Object.keys(endPoint).forEach(key => {
        const startValue = startPoint[key]
        const endValue = endPoint[key]
        newPoint[key] = (endValue - startValue) * easing + startValue
      })
      this.translate(<TranslaterPoint>newPoint)

      if (this.pending) {
        this.timer = requestAnimationFrame(step)
      }

      if (this.options.probeType === Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.move, newPoint)
      }
    }

    this.setPending(true)
    cancelAnimationFrame(this.timer)
    step()
  }

  stop() {
    // still in requestFrameAnimation
    if (this.pending) {
      this.setPending(false)
      cancelAnimationFrame(this.timer)
      const pos = this.translater.getComputedPosition()
      this.setForceStopped(true)

      if (this.hooks.trigger(this.hooks.eventTypes.beforeForceStop, pos)) {
        return
      }

      this.hooks.trigger(this.hooks.eventTypes.forceStop, pos)
    }
  }
}
