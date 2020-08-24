import BScroll, { Boundary } from '@better-scroll/core'
import {
  style,
  hasClass,
  ease,
  EaseItem,
  extend,
} from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

export type WheelOptions = Partial<WheelConfig> | true

export interface WheelConfig {
  selectedIndex: number
  rotate: number
  adjustTime: number
  wheelWrapperClass: string
  wheelItemClass: string
  wheelDisabledItemClass: string
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    wheel?: WheelOptions
  }
  interface CustomAPI {
    wheel: PluginAPI
  }
}

interface PluginAPI {
  wheelTo(index?: number, time?: number, ease?: EaseItem): void
  getSelectedIndex(): number
}

const CONSTANTS = {
  rate: 4,
}
export default class Wheel implements PluginAPI {
  static pluginName = 'wheel'
  options: WheelConfig
  wheelItemsAllDisabled: boolean
  items: HTMLCollection
  itemHeight: number
  selectedIndex: number
  target: EventTarget | null
  constructor(public scroll: BScroll) {
    this.init()
  }

  init() {
    this.handleBScroll()
    this.handleOptions()
    this.handleHooks()
    // init boundary for Wheel
    this.refreshBoundary()
    this.handleSelectedIndex()
  }

  private handleBScroll() {
    this.scroll.proxy(propertiesConfig)
  }

  private handleOptions() {
    const userOptions = (this.scroll.options.wheel === true
      ? {}
      : this.scroll.options.wheel) as Partial<WheelConfig>

    const defaultOptions: WheelConfig = {
      wheelWrapperClass: 'wheel-scroll',
      wheelItemClass: 'wheel-item',
      rotate: 25,
      adjustTime: 400,
      selectedIndex: 0,
      wheelDisabledItemClass: 'wheel-disabled-item',
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleHooks() {
    const scroller = this.scroll.scroller
    const {
      actionsHandler,
      scrollBehaviorX,
      scrollBehaviorY,
      animater,
    } = scroller
    // BScroll
    this.scroll.hooks.on(
      this.scroll.hooks.eventTypes.beforeInitialScrollTo,
      (position: { x: number; y: number }) => {
        position.x = 0
        position.y = -(this.selectedIndex * this.itemHeight)
      }
    )
    // Scroller
    scroller.hooks.on(scroller.hooks.eventTypes.checkClick, () => {
      const index = Array.prototype.slice
        .call(this.items, 0)
        .indexOf(this.target as Element)
      if (index === -1) return true

      this.wheelToAfterClick(index, this.options.adjustTime, ease.swipe)
      return true
    })
    scroller.hooks.on(
      scroller.hooks.eventTypes.scrollTo,
      (endPoint: { x: number; y: number }) => {
        endPoint.y = this.findNearestValidWheel(endPoint.y).y
      }
    )
    scroller.hooks.on(
      scroller.hooks.eventTypes.scrollToElement,
      (el: HTMLElement, pos: { top: number; left: number }) => {
        if (!hasClass(el, this.options.wheelItemClass)) {
          return true
        } else {
          pos.top = this.findNearestValidWheel(pos.top).y
        }
      }
    )

    // ActionsHandler
    actionsHandler.hooks.on(
      actionsHandler.hooks.eventTypes.beforeStart,
      (e: TouchEvent) => {
        this.target = e.target
      }
    )

    // ScrollBehaviorX
    // Wheel has no x direction now
    scrollBehaviorX.hooks.on(
      scrollBehaviorX.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        boundary.maxScrollPos = 0
        boundary.minScrollPos = 0
      }
    )

    // ScrollBehaviorY
    scrollBehaviorY.hooks.on(
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        this.items = this.scroll.scroller.content.children
        this.checkWheelAllDisabled()

        this.itemHeight =
          this.items.length > 0
            ? scrollBehaviorY.contentSize / this.items.length
            : 0

        boundary.maxScrollPos = -this.itemHeight * (this.items.length - 1)
        boundary.minScrollPos = 0
      }
    )
    scrollBehaviorY.hooks.on(
      scrollBehaviorY.hooks.eventTypes.momentum,
      (
        momentumInfo: {
          destination: number
          duration: number
          rate: number
        },
        distance: number
      ) => {
        momentumInfo.rate = CONSTANTS.rate
        momentumInfo.destination = this.findNearestValidWheel(
          momentumInfo.destination
        ).y
        // TODO algorithm optimize
        const maxDistance = 1000
        const minDuration = 800
        if (distance < maxDistance) {
          momentumInfo.duration = Math.max(
            minDuration,
            (distance / maxDistance) * this.scroll.options.swipeTime
          )
        }
      }
    )
    scrollBehaviorY.hooks.on(
      scrollBehaviorY.hooks.eventTypes.end,
      (momentumInfo: { destination: number; duration: number }) => {
        let validWheel = this.findNearestValidWheel(scrollBehaviorY.currentPos)
        momentumInfo.destination = validWheel.y
        momentumInfo.duration = this.options.adjustTime
        this.selectedIndex = validWheel.index
      }
    )

    // Animater
    animater.hooks.on(animater.hooks.eventTypes.time, (time: number) => {
      this.transitionDuration(time)
    })
    animater.hooks.on(
      animater.hooks.eventTypes.timeFunction,
      (easing: string) => {
        this.timeFunction(easing)
      }
    )

    animater.hooks.on(
      animater.hooks.eventTypes.beforeForceStop,
      ({ y }: { x: number; y: number }) => {
        this.target = this.items[this.findNearestValidWheel(y).index]
        // don't dispatch scrollEnd when forceStop from transition or animation
        return true
      }
    )
    // bs.stop() to make wheel stop at a correct position
    animater.hooks.on(animater.hooks.eventTypes.callStop, () => {
      const index = Array.prototype.slice
        .call(this.items, 0)
        .indexOf(this.target as Element)
      if (index > 0) {
        const y = -(index * this.itemHeight)
        animater.translate({ x: 0, y })
      }
    })

    // Translater
    animater.translater.hooks.on(
      animater.translater.hooks.eventTypes.translate,
      (endPoint: { x: number; y: number }) => {
        this.rotateX(endPoint.y)
        this.selectedIndex = this.findNearestValidWheel(endPoint.y).index
      }
    )
  }

  private refreshBoundary() {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    scrollBehaviorX.refresh()
    scrollBehaviorY.refresh()
  }

  private handleSelectedIndex() {
    this.selectedIndex = this.options.selectedIndex
  }

  getSelectedIndex() {
    return this.selectedIndex
  }

  wheelTo(index = 0, time = 0, ease?: EaseItem): boolean {
    const y = -index * this.itemHeight
    const currentY = Math.round(this.scroll.y)

    this.scroll.scrollTo(0, y, time, ease)
    return y === currentY
  }

  private wheelToAfterClick(index = 0, time = 0, ease: EaseItem) {
    const needDispatchScrollEnd = this.wheelTo(index, time, ease)
    // startpoint === endpoint
    // manually trigger scrollEnd
    if (needDispatchScrollEnd) {
      const hooks = this.scroll.scroller.hooks
      hooks.trigger(hooks.eventTypes.scrollEnd)
    }
  }

  private transitionDuration(time: number) {
    for (let i = 0; i < this.items.length; i++) {
      ;(this.items[i] as HTMLElement).style[style.transitionDuration as any] =
        time + 'ms'
    }
  }

  private timeFunction(easing: string) {
    for (let i = 0; i < this.items.length; i++) {
      ;(this.items[i] as HTMLElement).style[
        style.transitionTimingFunction as any
      ] = easing
    }
  }

  private rotateX(y: number) {
    const { rotate = 25 } = this.options
    for (let i = 0; i < this.items.length; i++) {
      const deg = rotate * (y / this.itemHeight + i)
      // Too small value is invalid in some phones, issue 1026
      const SafeDeg = deg.toFixed(3)
      ;(this.items[i] as HTMLElement).style[
        style.transform as any
      ] = `rotateX(${SafeDeg}deg)`
    }
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
      y: -currentIndex * this.itemHeight,
    }
  }

  private checkWheelAllDisabled() {
    const wheelDisabledItemClassName = this.options.wheelDisabledItemClass
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
