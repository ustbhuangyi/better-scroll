import BScroll from '../../index'
import { style } from '../../util'
const CONSTANTS = {
  rate: 4,
  time: 400
}
export default class Wheel {
  static pluginName = 'wheel'
  wheelItemsAllDisabled: boolean
  items: HTMLCollection
  itemHeight: number
  selectedIndex: number
  target: EventTarget | null
  constructor(public scroll: BScroll) {
    this.init()
    this.refresh()
    this.scroll.scroller.scrollTo(0, this.selectedIndex * this.itemHeight)
    // refresh
    this.scroll.on(this.scroll.eventTypes.refresh, () => {
      this.refresh()
    })
    this.scroll.scroller.actionsHandler.hooks.on(this.scroll.scroller.actionsHandler.hooks.eventTypes.start, (e: TouchEvent) => {
      this.target = e.target
    })
    this.scroll.scroller.scrollBehaviorY.hooks.on(this.scroll.scroller.scrollBehaviorY.hooks.eventTypes.momentum, (momentumInfo: {
      destination: number
      duration: number
      rate: number
    }) => {
      momentumInfo.rate = CONSTANTS.rate
      momentumInfo.destination = this.findNearestValidWheel(momentumInfo.destination).y
    })

    this.scroll.scroller.scrollBehaviorY.hooks.on(this.scroll.scroller.scrollBehaviorY.hooks.eventTypes.end, (momentumInfo: {
      destination: number
      duration: number
    }) => {
      let validWheel = this.findNearestValidWheel(this.scroll.scroller.scrollBehaviorY.currentPos)
      momentumInfo.destination = validWheel.y
      momentumInfo.duration = this.scroll.options.wheel.time || CONSTANTS.time
      this.selectedIndex = validWheel.index
    })

    this.scroll.scroller.animater.hooks.trigger(this.scroll.scroller.animater.hooks.eventTypes.time, (time: number) => {
      for (let i = 0; i < this.items.length; i++) {
        (this.items[i] as HTMLElement).style[style.transitionDuration as any] = time + 'ms'
      }
    })

    this.scroll.scroller.animater.hooks.trigger(this.scroll.scroller.animater.hooks.eventTypes.timeFunction, (easing: string) => {
      for (let i = 0; i < this.items.length; i++) {
        (this.items[i] as HTMLElement).style[style.transitionTimingFunction as any] = easing
      }
    })

    this.scroll.scroller.animater.hooks.trigger(this.scroll.scroller.animater.hooks.eventTypes.translate, (endPoint: {
      x: number
      y: number
    }) => {
      const { rotate = 25 } = this.scroll.options.wheel
      for (let i = 0; i < this.items.length; i++) {
        let deg = rotate * (endPoint.y / this.itemHeight + i);
        (this.items[i] as HTMLElement).style[style.transform as any] = `rotateX(${deg}deg)`
      }
    })

    this.scroll.scroller.animater.hooks.trigger(this.scroll.scroller.animater.hooks.eventTypes.scrollToElement, (el: HTMLElement, pos: { top: number, left: number}) => {
      if (!el.classList.contains(this.scroll.options.wheel.wheelItemClass)) {
        return true
      } else {
        pos.top = this.findNearestValidWheel(pos.top).y
      }
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
  }

  refresh () {
    const wheel = this.scroll.options.wheel
    this._checkWheelAllDisabled()
    this.items = this.scroll.scroller.element.children
    this.itemHeight = this.items.length ? this.scroll.scroller.scrollBehaviorY.elementSize / this.items.length : 0
    if (this.selectedIndex === undefined) {
      this.selectedIndex = wheel.selectedIndex || 0
    }
    this.scroll.maxScrollX = 0
    this.scroll.maxScrollY = -this.itemHeight * (this.items.length - 1)
  }

  getSelectedIndex () {
    return this.selectedIndex
  }

  wheelTo (index = 0) {
    const y = -index * this.itemHeight
    this.scroll.scrollTo(0, y)
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
