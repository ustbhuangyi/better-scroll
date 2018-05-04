import { ease } from '../util/ease'
import { DIRECTION_DOWN, PROBE_REALTIME } from '../util/const'

export function pullDownMixin(BScroll) {
  BScroll.prototype._initPullDown = function () {
    // must watch scroll in real time
    this.options.probeType = PROBE_REALTIME
  }

  BScroll.prototype._checkPullDown = function () {
    const {threshold = 90, stop = 40} = this.options.pullDownRefresh

    // check if a real pull down action
    if (this.directionY !== DIRECTION_DOWN || this.y < threshold) {
      return false
    }

    if (!this.pulling) {
      this.pulling = true
      this.trigger('pullingDown')
    }
    this.scrollTo(this.x, stop, this.options.bounceTime, ease.bounce)

    return this.pulling
  }

  BScroll.prototype.finishPullDown = function () {
    this.pulling = false
    this.resetPosition(this.options.bounceTime, ease.bounce)
  }

  BScroll.prototype.openPullDown = function (config = true) {
    this.options.pullDownRefresh = config
    this._initPullDown()
  }

  BScroll.prototype.closePullDown = function () {
    this.options.pullDownRefresh = false
  }
}
