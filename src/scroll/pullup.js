import { DIRECTION_UP, PROBE_REALTIME } from '../util/const'

export function pullUpMixin(BScroll) {
  BScroll.prototype._initPullUp = function () {
    // must watch scroll in real time
    this.options.probeType = PROBE_REALTIME

    this.pullupWatching = false
    this._watchPullUp()
  }

  BScroll.prototype._watchPullUp = function () {
    if (this.pullupWatching) {
      return
    }
    this.pullupWatching = true
    this.on('scroll', this._checkToEnd)
  }

  BScroll.prototype._checkToEnd = function (pos) {
    const {threshold = 0} = this.options.pullUpLoad
    if (this.movingDirectionY === DIRECTION_UP && pos.y <= (this.maxScrollY + threshold)) {
      // reset pullupWatching status after scroll end.
      this.once('scrollEnd', () => {
        this.pullupWatching = false
      })
      this.trigger('pullingUp')
      this.off('scroll', this._checkToEnd)
    }
  }

  BScroll.prototype.finishPullUp = function () {
    if (this.pullupWatching) {
      this.once('scrollEnd', () => {
        this._watchPullUp()
      })
    } else {
      this._watchPullUp()
    }
  }

  BScroll.prototype.openPullUp = function (config = true) {
    this.options.pullUpLoad = config
    this._initPullUp()
  }

  BScroll.prototype.closePullUp = function () {
    this.options.pullUpLoad = false
    if (!this.pullupWatching) {
      return
    }
    this.pullupWatching = false
    this.off('scroll', this._checkToEnd)
  }
}
