import BScroll from '../../index'
import { style, hasClass, getRect, ease } from '../../util'
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
    this.options = this.scroll.options.wheel
    this.init()
  }

  init() {
    if (this.options) {
      this.normalizeOptions()
      this.refresh()
      this.tapIntoHooks()
      this.wheelTo(this.selectedIndex)
      this.scroll.proxy(propertiesConfig)
    }
  }

  private tapIntoHooks() {
    const scroller = this.scroll.scroller
    const actionsHandler = scroller.actionsHandler
    const scrollBehaviorY = scroller.scrollBehaviorY
    const animater = scroller.animater

    // BScroll
    this.scroll.on(this.scroll.hooks.eventTypes.refresh, () => {
      this.refresh()
    })

    // Scroller
    scroller.hooks.on(scroller.hooks.eventTypes.checkClick, () => {
      const index = Array.from(this.items).indexOf(this.target as Element)
      if (index === -1) return true
      this.scroll.scrollTo(
        0,
        -index * this.itemHeight,
        this.options.adjustTime || 400,
        ease.swipe
      )
      return true
    })
    scroller.hooks.on(
      scroller.hooks.eventTypes.scrollTo,
      (endPoint: { x: number; y: number }) => {
        endPoint.y = this.findNearestValidWheel(endPoint.y).y
      }
    )

    // ActionsHandler
    actionsHandler.hooks.on(
      actionsHandler.hooks.eventTypes.beforeStart,
      (e: TouchEvent) => {
        this.target = e.target
      }
    )

    // ScrollBehaviorY
    scrollBehaviorY.hooks.on(
      scrollBehaviorY.hooks.eventTypes.momentum,
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
    scrollBehaviorY.hooks.on(
      scrollBehaviorY.hooks.eventTypes.end,
      (momentumInfo: { destination: number; duration: number }) => {
        let validWheel = this.findNearestValidWheel(scrollBehaviorY.currentPos)
        momentumInfo.destination = validWheel.y
        momentumInfo.duration = this.options.adjustTime || CONSTANTS.time
        this.selectedIndex = validWheel.index
      }
    )

    // Animater
    animater.hooks.on(animater.hooks.eventTypes.time, (time: number) => {
      for (let i = 0; i < this.items.length; i++) {
        ;(this.items[i] as HTMLElement).style[style.transitionDuration as any] =
          time + 'ms'
      }
    })
    animater.hooks.on(
      animater.hooks.eventTypes.timeFunction,
      (easing: string) => {
        for (let i = 0; i < this.items.length; i++) {
          ;(this.items[i] as HTMLElement).style[
            style.transitionTimingFunction as any
          ] = easing
        }
      }
    )
    animater.hooks.on(
      animater.hooks.eventTypes.scrollToElement,
      (el: HTMLElement, pos: { top: number; left: number }) => {
        if (hasClass(el, this.options.wheelItemClass!)) {
          return true
        } else {
          pos.top = this.findNearestValidWheel(pos.top).y
        }
      }
    )
    animater.hooks.on(
      animater.hooks.eventTypes.forceStop,
      ({ x, y }: { x: number; y: number }) => {
        this.target = this.items[this.findNearestValidWheel(y).index]
        console.log(this.target)
      }
    )

    // Translater
    animater.translater.hooks.on(
      animater.translater.hooks.eventTypes.translate,
      (endPoint: { x: number; y: number }) => {
        const { rotate = 25 } = this.options
        for (let i = 0; i < this.items.length; i++) {
          let deg = rotate * (endPoint.y / this.itemHeight + i)
          ;(this.items[i] as HTMLElement).style[
            style.transform as any
          ] = `rotateX(${deg}deg)`
        }

        this.selectedIndex = this.findNearestValidWheel(endPoint.y).index
      }
    )
  }

  refresh() {
    const scroller = this.scroll.scroller
    const scrollBehaviorY = scroller.scrollBehaviorY

    const contentRect = getRect(scroller.content)

    // ajust contentSize
    scrollBehaviorY.contentSize = contentRect.height
    this.items = scroller.content.children
    this.checkWheelAllDisabled()

    this.itemHeight = this.items.length
      ? scrollBehaviorY.contentSize / this.items.length
      : 0

    if (this.selectedIndex === undefined) {
      this.selectedIndex = this.options.selectedIndex || 0
    }

    this.scroll.maxScrollX = 0
    this.scroll.maxScrollY = -this.itemHeight * (this.items.length - 1)
    this.scroll.minScrollX = 0
    this.scroll.minScrollY = 0

    scrollBehaviorY.hasScroll =
      scrollBehaviorY.options && this.scroll.maxScrollY < this.scroll.minScrollY
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
        !hasClass(
          items[currentIndex] as HTMLElement,
          wheelDisabledItemClassName
        )
      ) {
        break
      }
      currentIndex--
    }

    if (currentIndex < 0) {
      currentIndex = cacheIndex
      while (currentIndex <= items.length - 1) {
        if (
          !hasClass(
            items[currentIndex] as HTMLElement,
            wheelDisabledItemClassName
          )
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

  private normalizeOptions() {
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

  private checkWheelAllDisabled() {
    const wheelDisabledItemClassName = this.options
      .wheelDisabledItemClass as string
    const items = this.items
    this.wheelItemsAllDisabled = true
    for (let i = 0; i < items.length; i++) {
      if (!hasClass(items[i] as HTMLElement, wheelDisabledItemClassName)) {
        this.wheelItemsAllDisabled = false
        break
      }
    }
  }
}
