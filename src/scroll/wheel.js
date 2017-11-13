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
    if (this.options.wheel && (!this.options.wheel.wheelWrapperClass || !this.options.wheel.wheelItemClass)) {
      if (!this.options.wheel.wheelWrapperClass) {
        this.options.wheel.wheelWrapperClass = 'wheel-scroll'
      }
      if (!this.options.wheel.wheelItemClass) {
        this.options.wheel.wheelItemClass = 'wheel-item'
      }
      warn('wheelWrapperClass & wheelItemClass of wheel options use the default setting.')
    }
    if (this.options.wheel && this.options.wheel.selectedIndex === undefined) {
      this.options.wheel.selectedIndex = 0
      warn('wheel option selectedIndex is required!')
    }
  }
}