export function wheelMixin(BScroll) {
  BScroll.prototype.wheelTo = function (index) {
    if (this.options.wheel) {
      this.y = -index * this.scrollerHeight / this.items.length
      this.scrollTo(0, this.y)
    }
  }

  BScroll.prototype.getSelectedIndex = function () {
    return this.options.wheel && this.selectedIndex
  }
}