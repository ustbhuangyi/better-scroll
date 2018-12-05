import { warn } from '../util/debug'

export function wheelMixin(BScroll) {
  BScroll.prototype.wheelTo = function (index = 0) {
    if (this.options.wheel) {
      this.y = -index * this.itemHeight
      this.scrollTo(0, this.y)
    }
  }

  BScroll.prototype.getSelectedIndex = function () {
    return this.options.wheel && this.selectedIndex
  }

  BScroll.prototype._initWheel = function () {
    const wheel = this.options.wheel
    if (!wheel.wheelWrapperClass) {
      wheel.wheelWrapperClass = 'wheel-scroll'
    }
    if (!wheel.wheelItemClass) {
      wheel.wheelItemClass = 'wheel-item'
    }
    if (wheel.selectedIndex === undefined) {
      wheel.selectedIndex = 0
      warn('wheel option selectedIndex is required!')
    }
  }

  BScroll.prototype._checkWheelhasValidIndex = function () {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].className.indexOf('disabled') === -1) {
        this.wheelHasValidIndex = true
        return
      }
    }

    warn('checkWheelhasValidIndex: has no valid items in column')
    this.wheelHasValidIndex = false
  }

  BScroll.prototype._getWheelValidIndex = function (y) {
    let tempIndex = Math.round(-y / this.itemHeight)
    let step = 1
    let direction = tempIndex * this.itemHeight < -y ? 1 : -1
    let reverse = true

    // has no valid item
    if (!this.wheelHasValidIndex) {
      return tempIndex
    }

    // check tempIndex valid or not
    while (this.items[tempIndex].className.indexOf('disabled') !== -1) {
      // has reversed, step reduced to 1, in one direction
      if (!reverse) {
        step = 1
      }
      tempIndex += step * direction
      step++
      if (reverse) {
        direction = -direction
      }
      if ((tempIndex < 0 || tempIndex >= this.items.length) && reverse) {
        tempIndex += step * direction
        reverse = false
      }
    }
    return tempIndex
  }

  // get valid y
  BScroll.prototype._getWheelValidY = function (y) {
    // verify y
    y = y > 0 ? 0 : y < this.maxScrollY ? this.maxScrollY : y
    let temtIndex = this._getWheelValidIndex(y)
    return -temtIndex * this.itemHeight
  }
}
