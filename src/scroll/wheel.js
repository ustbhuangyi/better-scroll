export function wheelMixin (BScroll) {
  BScroll.prototype.wheelTo = function (index = 0) {
    if (this.options.wheel) {
      const y = -index * this.itemHeight
      this.scrollTo(0, y)
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
    if (!wheel.wheelDisabledItemClass) {
      wheel.wheelDisabledItemClass = 'wheel-disabled-item'
    }
    if (wheel.selectedIndex === undefined) {
      wheel.selectedIndex = 0
    }
  }

  BScroll.prototype._findNearestValidWheel = function (y) {
    y = y > 0 ? 0 : y < this.maxScrollY ? this.maxScrollY : y
    const wheel = this.options.wheel
    let currentIndex = Math.abs(Math.round(-y / this.itemHeight))
    const cacheIndex = currentIndex
    const items = this.items
    // Impersonation web native select
    // first, check whether there is a enable item whose index is smaller than currentIndex
    // then, check whether there is a enable item whose index is bigger than currentIndex
    // otherwise, there are all disabled items, just keep currentIndex unchange
    while (currentIndex >= 0) {
      if (items[currentIndex].className.indexOf(wheel.wheelDisabledItemClass) === -1) {
        break
      }
      currentIndex--
    }

    if (currentIndex < 0) {
      currentIndex = cacheIndex
      while (currentIndex <= items.length - 1) {
        if (items[currentIndex].className.indexOf(wheel.wheelDisabledItemClass) === -1) {
          break
        }
        currentIndex++
      }
    }

    // keep it unchange when all the items are disabled
    if (currentIndex === items.length) {
      currentIndex = cacheIndex
    }
    // when all the items are disabled, this.selectedIndex should always be -1
    return {
      index: this.wheelItemsAllDisabled ? -1 : currentIndex,
      y: -currentIndex * this.itemHeight
    }
  }

  BScroll.prototype._checkWheelAllDisabled = function () {
    const wheel = this.options.wheel
    const items = this.items
    this.wheelItemsAllDisabled = true
    for (let i = 0; i < items.length; i++) {
      if (items[i].className.indexOf(wheel.wheelDisabledItemClass) === -1) {
        this.wheelItemsAllDisabled = false
        break
      }
    }
  }
}
