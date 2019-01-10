import { warn } from '../util/debug'
import { DIRECTION_UP } from '../util/const'

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
    const STEP_SIZE = 1
    let setpCount = 1
    let hasReversed = false
    let validIndex = Math.abs(Math.round(-y / this.itemHeight))
    let direction = this.movingDirectionY === DIRECTION_UP ? STEP_SIZE : -STEP_SIZE

    // has no valid item
    if (!this.wheelHasValidIndex) {
      return validIndex
    }

    // check index valid or not
    while (this.items[validIndex].className.indexOf('disabled') !== -1) {
      validIndex += STEP_SIZE * direction
      setpCount++
      // In one direction, at the end, reversed direction
      if (!hasReversed && (validIndex < 0 || validIndex >= this.items.length)) {
        // Reversed
        direction = -direction
        validIndex += setpCount * direction
        // has reversed, setpCount reduced to 1, in another direction
        setpCount = 1
        hasReversed = true
      }
    }
    return validIndex
  }

  // get valid y
  BScroll.prototype._getWheelValidY = function (y) {
    // verify y
    y = y > 0 ? 0 : y < this.maxScrollY ? this.maxScrollY : y
    let temtIndex = this._getWheelValidIndex(y)
    return -temtIndex * this.itemHeight
  }
}
