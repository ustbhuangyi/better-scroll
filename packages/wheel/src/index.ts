import BScroll, { Boundary } from '@better-scroll/core'
import {
  style,
  hasClass,
  ease,
  EaseItem,
  extend,
  Position,
  HTMLCollectionToArray
} from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

export type WheelOptions = Partial<WheelConfig> | true

const WHEEL_INDEX_CHANGED_EVENT_NAME = 'wheelIndexChanged'

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
  restorePosition(): void
}

const CONSTANTS = {
  rate: 4
}
export default class Wheel implements PluginAPI {
  static pluginName = 'wheel'
  options: WheelConfig
  wheelItemsAllDisabled: boolean
  items: HTMLCollection
  itemHeight: number
  selectedIndex: number
  isAdjustingPosition: boolean
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
    this.setSelectedIndex(this.options.selectedIndex)
  }

  private handleBScroll() {
    this.scroll.proxy(propertiesConfig)
    this.scroll.registerType([WHEEL_INDEX_CHANGED_EVENT_NAME])
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
      wheelDisabledItemClass: 'wheel-disabled-item'
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleHooks() {
    const scroll = this.scroll
    const scroller = this.scroll.scroller
    const {
      actionsHandler,
      scrollBehaviorX,
      scrollBehaviorY,
      animater
    } = scroller
    let prevContent = scroller.content
    // BScroll
    scroll.on(scroll.eventTypes.scrollEnd, (position: Position) => {
      const index = this.findNearestValidWheel(position.y).index
      if (scroller.animater.forceStopped && !this.isAdjustingPosition) {
        this.target = this.items[index]
        // since stopped from an animation.
        // prevent user's scrollEnd callback triggered twice
        return true
      } else {
        this.setSelectedIndex(index)
        if (this.isAdjustingPosition) {
          this.isAdjustingPosition = false
        }
      }
    })
    // BScroll.hooks
    this.scroll.hooks.on(
      this.scroll.hooks.eventTypes.refresh,
      (content: HTMLElement) => {
        if (content !== prevContent) {
          prevContent = content
          this.setSelectedIndex(this.options.selectedIndex, true)
        }
        // rotate all wheel-items
        // because position may not change
        this.rotateX(this.scroll.y)
        // check we are stop at a disable item or not
        this.wheelTo(this.selectedIndex, 0)
      }
    )

    this.scroll.hooks.on(
      this.scroll.hooks.eventTypes.beforeInitialScrollTo,
      (position: Position) => {
        // selectedIndex has higher priority than bs.options.startY
        position.x = 0
        position.y = -(this.selectedIndex * this.itemHeight)
      }
    )
    // Scroller
    scroller.hooks.on(scroller.hooks.eventTypes.checkClick, () => {
      const index = HTMLCollectionToArray(this.items).indexOf(this.target)
      if (index === -1) return true

      this.wheelTo(index, this.options.adjustTime, ease.swipe)
      return true
    })
    scroller.hooks.on(
      scroller.hooks.eventTypes.scrollTo,
      (endPoint: Position) => {
        endPoint.y = this.findNearestValidWheel(endPoint.y).y
      }
    )
    // when content is scrolling
    // click wheel-item DOM repeatedly and crazily will cause scrollEnd not triggered
    // so reset forceStopped
    scroller.hooks.on(scroller.hooks.eventTypes.minDistanceScroll, () => {
      const animater = scroller.animater
      if (animater.forceStopped === true) {
        animater.forceStopped = false
      }
    })
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
        momentumInfo.duration = this.options.adjustTime
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
    // bs.stop() to make wheel stop at a correct position when pending
    animater.hooks.on(animater.hooks.eventTypes.callStop, () => {
      const { index } = this.findNearestValidWheel(this.scroll.y)
      this.isAdjustingPosition = true
      this.wheelTo(index, 0)
    })

    // Translater
    animater.translater.hooks.on(
      animater.translater.hooks.eventTypes.translate,
      (endPoint: Position) => {
        this.rotateX(endPoint.y)
      }
    )
  }

  private refreshBoundary() {
    const { scrollBehaviorX, scrollBehaviorY, content } = this.scroll.scroller
    scrollBehaviorX.refresh(content)
    scrollBehaviorY.refresh(content)
  }

  setSelectedIndex(index: number, contentChanged: boolean = false) {
    const prevSelectedIndex = this.selectedIndex
    this.selectedIndex = index

    // if content DOM changed, should not trigger event
    if (prevSelectedIndex !== index && !contentChanged) {
      this.scroll.trigger(WHEEL_INDEX_CHANGED_EVENT_NAME, index)
    }
  }

  getSelectedIndex() {
    return this.selectedIndex
  }

  wheelTo(index = 0, time = 0, ease?: EaseItem) {
    const y = -index * this.itemHeight
    this.scroll.scrollTo(0, y, time, ease)
  }

  restorePosition() {
    // bs is scrolling
    const isPending = this.scroll.pending
    if (isPending) {
      const selectedIndex = this.getSelectedIndex()
      this.scroll.scroller.animater.clearTimer()
      this.wheelTo(selectedIndex, 0)
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
    // implement web native select element
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
    // when all the items are disabled, selectedIndex should always be -1
    return {
      index: this.wheelItemsAllDisabled ? -1 : currentIndex,
      y: -currentIndex * this.itemHeight
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
