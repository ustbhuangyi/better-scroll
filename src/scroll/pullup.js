export function pullUpMixin(BScroll) {
  BScroll.prototype._initPullUp = function () {
    // must watch scroll in real time
    this.options.probeType = 3

    this._watchPullUp()
  }

  BScroll.prototype._watchPullUp = function () {
    const {threshold = 50} = this.options.pullUpLoad

    this.on('scroll', checkToEnd)

    function checkToEnd() {
      if (this.y <= (this.maxScrollY + threshold)) {
        this.trigger('pullingUp')
        this.off('scroll', checkToEnd)
      }
    }
  }

  BScroll.prototype.finishPullUp = function () {
    this._watchPullUp()
  }
}
