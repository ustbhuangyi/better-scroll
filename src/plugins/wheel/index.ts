import BScroll from '../../index'
import { style } from '../../util'
import { Options } from '../../Options'
import propertiesConfig from './propertiesConfig'

export type wheelOptions = Partial<WheelConfig>
export interface WheelConfig {
  selectedIndex: number
  rotate: number
  adjustTime: number
  wheelWrapperClass: string
  wheelItemClass: string
  wheelDisabledItemClass: string
}

declare module '../../Options' {
  interface Options {
    wheel: wheelOptions
  }
}

const CONSTANTS = {
  rate: 4,
  time: 400
}
export default class Wheel {
  static pluginName = 'wheel'
  options: wheelOptions
  wheelItemsAllDisabled: boolean
  items: HTMLCollection
  itemHeight: number
  selectedIndex: number
  target: EventTarget | null
  constructor(public scroll: BScroll) {
    this.scroll.proxy(propertiesConfig)
    this.options = this.scroll.options.wheel
    if (this.options) {
      this.init()
      this.refresh()
      this.scroll.scrollTo(0, this.selectedIndex * this.itemHeight)
      this._tapIntoHooks()
    }
  }
  init() {
    const wheel = this.options || {}
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

  private _tapIntoHooks() {
    // refresh
    this.scroll.on(this.scroll.eventTypes.refresh, () => {
      this.refresh()
    })
    // touchstart
    this.scroll.scroller.actionsHandler.hooks.on(
      this.scroll.scroller.actionsHandler.hooks.eventTypes.start,
      (e: TouchEvent) => {
        this.target = e.target
      }
    )
    // momentum
    this.scroll.scroller.scrollBehaviorY.hooks.on(
      this.scroll.scroller.scrollBehaviorY.hooks.eventTypes.momentum,
      (momentumInfo: {
        destination: number
        duration: number
        rate: number
      }) => {
        momentumInfo.rate = CONSTANTS.rate
        momentumInfo.destination = this.findNearestValidWheel(
          momentumInfo.destination
        ).y
      }
    )
    // touchend
    this.scroll.scroller.scrollBehaviorY.hooks.on(
      this.scroll.scroller.scrollBehaviorY.hooks.eventTypes.end,
      (momentumInfo: { destination: number; duration: number }) => {
        debugger
        let validWheel = this.findNearestValidWheel(
          this.scroll.scroller.scrollBehaviorY.currentPos
        )
        momentumInfo.destination = validWheel.y
        momentumInfo.duration = this.options.adjustTime || CONSTANTS.time
        this.selectedIndex = validWheel.index
      }
    )
    // transition time
    this.scroll.scroller.animater.hooks.on(
      this.scroll.scroller.animater.hooks.eventTypes.time,
      (time: number) => {
        for (let i = 0; i < this.items.length; i++) {
          ;(this.items[i] as HTMLElement).style[
            style.transitionDuration as any
          ] = time + 'ms'
        }
      }
    )
    // transition time function
    this.scroll.scroller.animater.hooks.on(
      this.scroll.scroller.animater.hooks.eventTypes.timeFunction,
      (easing: string) => {
        for (let i = 0; i < this.items.length; i++) {
          ;(this.items[i] as HTMLElement).style[
            style.transitionTimingFunction as any
          ] = easing
        }
      }
    )
    // translate
    this.scroll.scroller.animater.hooks.on(
      this.scroll.scroller.animater.hooks.eventTypes.translate,
      (endPoint: { x: number; y: number }) => {
        const { rotate = 25 } = this.options
        for (let i = 0; i < this.items.length; i++) {
          let deg = rotate * (endPoint.y / this.itemHeight + i)
          ;(this.items[i] as HTMLElement).style[
            style.transform as any
          ] = `rotateX(${deg}deg)`
        }
      }
    )

    this.scroll.scroller.animater.hooks.on(
      this.scroll.scroller.animater.hooks.eventTypes.scrollToElement,
      (el: HTMLElement, pos: { top: number; left: number }) => {
        if (!el.classList.contains(this.options.wheelItemClass as string)) {
          return true
        } else {
          pos.top = this.findNearestValidWheel(pos.top).y
        }
      }
    )
  }

  refresh() {
    this.items = this.scroll.scroller.element.children
    this._checkWheelAllDisabled()
    this.itemHeight = this.items.length
      ? this.scroll.scroller.scrollBehaviorY.elementSize / this.items.length
      : 0

    if (this.selectedIndex === undefined) {
      this.selectedIndex = this.options.selectedIndex || 0
    }
    this.scroll.maxScrollX = 0
    this.scroll.maxScrollY = -this.itemHeight * (this.items.length - 1)
  }

  getSelectedIndex() {
    return this.selectedIndex
  }

  wheelTo(index = 0) {
    const y = -index * this.itemHeight
    this.scroll.scrollTo(0, y)
  }

  private findNearestValidWheel(y: number) {
    y = y > 0 ? 0 : y < this.scroll.maxScrollY ? this.scroll.maxScrollY : y
    let currentIndex = Math.abs(Math.round(-y / this.itemHeight))
    const cacheIndex = currentIndex
    const items = this.items
    const wheelDisabledItemClassName = this.options
      .wheelDisabledItemClass as string
    // Impersonation web native select
    // first, check whether there is a enable item whose index is smaller than currentIndex
    // then, check whether there is a enable item whose index is bigger than currentIndex
    // otherwise, there are all disabled items, just keep currentIndex unchange
    while (currentIndex >= 0) {
      if (
        items[currentIndex].className.indexOf(wheelDisabledItemClassName) === -1
      ) {
        break
      }
      currentIndex--
    }

    if (currentIndex < 0) {
      currentIndex = cacheIndex
      while (currentIndex <= items.length - 1) {
        if (
          items[currentIndex].className.indexOf(wheelDisabledItemClassName) ===
          -1
        ) {
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
    const wheelDisabledItemClassName = this.options
      .wheelDisabledItemClass as string
    const items = this.items
    this.wheelItemsAllDisabled = true
    for (let i = 0; i < items.length; i++) {
      if (items[i].className.indexOf(wheelDisabledItemClassName) === -1) {
        this.wheelItemsAllDisabled = false
        break
      }
    }
  }
}
