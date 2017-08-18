import {ease} from '../util/ease'

export function pullDownMixin(BScroll) {
  BScroll.prototype._checkPullDown = function () {
    this.pulling = false
    const {threshold = 50, stop = 20} = this.options.pullDownRefresh
    if (this.y > threshold) {
      this.pulling = true
      this.trigger('pullingDown')
      this.scrollTo(this.x, stop, this.options.bounceTime, ease.bounce)
    }

    return this.pulling
  }

  BScroll.prototype.finishPullDown = function () {
    this.pulling = false
    this.resetPosition(this.options.bounceTime, ease.bounce)
  }
}
