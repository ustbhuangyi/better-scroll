import BScroll from '../../index'

export default class Wheel {
  static pluginName = 'wheel'
  wheelItemsAllDisabled: boolean
  items: HTMLCollection
  itemHeight: number
  constructor(public scroll: BScroll) {
    this.items = this.scroll.scroller.element.children
    this.itemHeight = this.items.length ? this.scroll.scroller.scrollBehaviorY.elementSize / this.items.length : 0
    this.init()
    this.scroll.on(this.scroll.eventTypes.refresh, () => {
      this._checkWheelAllDisabled()
    })
  }
  init() {
    const wheel = this.scroll.options.wheel
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

  private findNearestValidWheel(y: number) {
    y = y > 0 ? 0 : y < this.scroll.maxScrollY ? this.scroll.maxScrollY : y
    const wheel = this.scroll.options.wheel
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

  private _checkWheelAllDisabled() {
    const wheel = this.scroll.options.wheel
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
