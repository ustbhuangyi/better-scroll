import { warn } from '../util/debug'

export function wheelMixin(BScroll) {
  BScroll.prototype.wheelTo = function (index) {
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
    if (!wheel.wheelWrapperClass || !wheel.wheelItemClass) {
      if (!wheel.wheelWrapperClass) {
        wheel.wheelWrapperClass = 'wheel-scroll'
      }
      if (!wheel.wheelItemClass) {
        wheel.wheelItemClass = 'wheel-item'
      }
      warn('wheelWrapperClass & wheelItemClass of wheel options use the default setting.')
    }
    if (wheel.selectedIndex === undefined) {
      wheel.selectedIndex = 0
      warn('wheel option selectedIndex is required!')
    }
  }
}