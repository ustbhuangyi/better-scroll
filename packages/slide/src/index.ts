import BScroll from '@better-scroll/core'
import {
  between,
  prepend,
  removeChild,
  ease,
  extend,
  EaseItem,
  Direction,
  warn,
  EventEmitter,
} from '@better-scroll/shared-utils'
import SlidePages, { Page, Position } from './SlidePages'
import propertiesConfig from './propertiesConfig'
import { BASE_PAGE } from './constants'

export interface SlideConfig {
  loop: boolean
  threshold: number
  speed: number
  easing: {
    style: string
    fn: (t: number) => number
  }
  listenFlick: boolean
  autoplay: boolean
  interval: number
}
export type SlideOptions = Partial<SlideConfig> | true

declare module '@better-scroll/core' {
  interface CustomOptions {
    slide?: SlideOptions
  }
  interface CustomAPI {
    slide: PluginAPI
  }
}

interface PluginAPI {
  next(time?: number, easing?: EaseItem): void
  prev(time?: number, easing?: EaseItem): void
  goToPage(x: number, y: number, time?: number, easing?: EaseItem): void
  getCurrentPage(): Page
  startPlay(): void
  pausePlay(): void
}

const samePage = (p1: Page, p2: Page) => {
  return p1.pageX === p2.pageX && p1.pageY === p2.pageY
}

type styleConfiguration = {
  direction: 'scrollX' | 'scrollY'
  sizeType: 'offsetWidth' | 'offsetHeight'
  styleType: 'width' | 'height'
}
export default class Slide implements PluginAPI {
  static pluginName = 'slide'
  pages: SlidePages
  options: SlideConfig
  private initialised: boolean
  private thresholdX: number
  private thresholdY: number
  private hooksFn: Array<[EventEmitter, string, Function]>
  private resetLooping = false
  private isTouching = false
  private willChangeToPage: Page
  private autoplayTimer: number = 0
  constructor(public scroll: BScroll) {
    if (!this.satisfyInitialization()) {
      return
    }
    this.init()
  }

  private satisfyInitialization(): boolean {
    if (this.scroll.scroller.content.children.length <= 0) {
      warn(
        `slide need at least one slide page to be initialised.` +
          `please check your DOM layout.`
      )
      return false
    }
    return true
  }

  init() {
    this.willChangeToPage = extend({}, BASE_PAGE)

    this.handleBScroll()
    this.handleOptions()
    this.handleHooks()
    this.createPages()
  }

  private createPages() {
    this.pages = new SlidePages(this.scroll, this.options)
  }

  private handleBScroll() {
    this.scroll.registerType(['slideWillChange'])
    this.scroll.proxy(propertiesConfig)
  }

  private handleOptions() {
    const userOptions = (this.scroll.options.slide === true
      ? {}
      : this.scroll.options.slide) as Partial<SlideConfig>
    const defaultOptions: SlideConfig = {
      loop: true,
      threshold: 0.1,
      speed: 400,
      easing: ease.bounce,
      listenFlick: true,
      autoplay: true,
      interval: 3000,
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleLoop() {
    const { loop } = this.options
    if (loop) {
      const slideContent = this.scroll.scroller.content
      const slidePages = slideContent.children
      if (slidePages.length > 1) {
        this.cloneFirstAndLastSlidePage(slideContent)
      }
    }
  }

  private handleHooks() {
    const scrollHooks = this.scroll.hooks
    const scrollerHooks = this.scroll.scroller.hooks
    const { listenFlick } = this.options

    this.hooksFn = []
    // scroll
    this.registerHooks(
      this.scroll,
      this.scroll.eventTypes.beforeScrollStart,
      this.pausePlay
    )
    this.registerHooks(
      this.scroll,
      this.scroll.eventTypes.scrollEnd,
      this.modifyCurrentPage
    )
    this.registerHooks(
      this.scroll,
      this.scroll.eventTypes.scrollEnd,
      this.startPlay
    )
    // for mousewheel event
    if (this.scroll.eventTypes.mousewheelMove) {
      this.registerHooks(
        this.scroll,
        this.scroll.eventTypes.mousewheelMove,
        () => {
          // prevent default action of mousewheelMove
          return true
        }
      )
      this.registerHooks(
        this.scroll,
        this.scroll.eventTypes.mousewheelEnd,
        (delta: { directionX: number; directionY: number }) => {
          if (
            delta.directionX === Direction.Positive ||
            delta.directionY === Direction.Positive
          ) {
            this.next()
          }
          if (
            delta.directionX === Direction.Negative ||
            delta.directionY === Direction.Negative
          ) {
            this.prev()
          }
        }
      )
    }

    // scrollHooks
    this.registerHooks(
      scrollHooks,
      scrollHooks.eventTypes.refresh,
      this.refreshHandler
    )
    this.registerHooks(
      scrollHooks,
      scrollHooks.eventTypes.destroy,
      this.destroy
    )

    // scroller
    this.registerHooks(
      scrollerHooks,
      scrollerHooks.eventTypes.beforeRefresh,
      () => {
        this.handleLoop()
        this.setSlideInlineStyle()
      }
    )
    this.registerHooks(
      scrollerHooks,
      scrollerHooks.eventTypes.momentum,
      this.modifyScrollMetaHandler
    )
    this.registerHooks(
      scrollerHooks,
      scrollerHooks.eventTypes.beforeStart,
      this.setTouchFlag
    )
    this.registerHooks(
      scrollerHooks,
      scrollerHooks.eventTypes.scroll,
      this.scrollMoving
    )
    // a click operation will clearTimer, so restart a new one
    this.registerHooks(
      scrollerHooks,
      scrollerHooks.eventTypes.checkClick,
      this.startPlay
    )
    if (listenFlick) {
      this.registerHooks(
        scrollerHooks,
        scrollerHooks.eventTypes.flick,
        this.flickHandler
      )
    }
  }

  startPlay() {
    const { interval, autoplay } = this.options
    if (autoplay) {
      clearTimeout(this.autoplayTimer)
      this.autoplayTimer = window.setTimeout(() => {
        this.next()
      }, interval)
    }
  }

  pausePlay() {
    if (this.options.autoplay) {
      clearTimeout(this.autoplayTimer)
    }
  }

  private setSlideInlineStyle() {
    const styleConfigurations: styleConfiguration[] = [
      {
        direction: 'scrollX',
        sizeType: 'offsetWidth',
        styleType: 'width',
      },
      {
        direction: 'scrollY',
        sizeType: 'offsetHeight',
        styleType: 'height',
      },
    ]
    const {
      content: slideContent,
      wrapper: slideWrapper,
    } = this.scroll.scroller
    const scrollOptions = this.scroll.options

    styleConfigurations.forEach(({ direction, sizeType, styleType }) => {
      // wanna scroll in this direction
      if (scrollOptions[direction]) {
        const size = slideWrapper[sizeType]
        const children = slideContent.children
        const length = children.length
        for (let i = 0; i < length; i++) {
          const slidePageDOM = children[i] as HTMLElement
          slidePageDOM.style[styleType] = size + 'px'
        }
        slideContent.style[styleType] = size * length + 'px'
      }
    })
  }

  next(time?: number, easing?: EaseItem) {
    const { pageX, pageY } = this.pages.nextPageIndex()
    this.goTo(pageX, pageY, time, easing)
  }
  prev(time?: number, easing?: EaseItem) {
    const { pageX, pageY } = this.pages.prevPageIndex()
    this.goTo(pageX, pageY, time, easing)
  }

  goToPage(pageX: number, pageY: number, time?: number, easing?: EaseItem) {
    const pageIndex = this.pages.getValidPageIndex(pageX, pageY)
    if (!pageIndex) {
      return
    }
    this.goTo(pageIndex.pageX, pageIndex.pageY, time, easing)
  }

  getCurrentPage(): Page {
    return this.pages.getExposedPage()
  }

  nearestPage(x: number, y: number): Page {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const {
      absStartPos: absStartPosX,
      maxScrollPos: maxScrollPosX,
      minScrollPos: minScrollPosX,
      direction: directionX,
    } = scrollBehaviorX
    const {
      absStartPos: absStartPosY,
      maxScrollPos: maxScrollPosY,
      minScrollPos: minScrollPosY,
      direction: directionY,
    } = scrollBehaviorY

    let triggerThreshold = true
    if (
      Math.abs(x - absStartPosX) <= this.thresholdX &&
      Math.abs(y - absStartPosY) <= this.thresholdY
    ) {
      triggerThreshold = false
    }
    if (!triggerThreshold) {
      return this.pages.currentPage
    }

    return this.pages.nearestPage(
      between(x, maxScrollPosX, minScrollPosX),
      between(y, maxScrollPosY, minScrollPosY),
      directionX,
      directionY
    )
  }
  private refreshHandler() {
    if (!this.satisfyInitialization()) {
      return
    }
    this.pages.refresh()
    this.computeThreshold()

    const initPage = this.pages.getInitialPage()
    if (this.initialised) {
      this.goTo(initPage.pageX, initPage.pageY, 0)
    } else {
      this.registerHooks(
        this.scroll.hooks,
        this.scroll.hooks.eventTypes.beforeInitialScrollTo,
        (position: { x: number; y: number }) => {
          this.initialised = true
          position.x = initPage.x
          position.y = initPage.y
          this.pages.setCurrentPage(initPage)
        }
      )
    }

    this.startPlay()
  }

  private computeThreshold() {
    const threshold = this.options.threshold

    // Integer
    if (threshold % 1 === 0) {
      this.thresholdX = threshold
      this.thresholdY = threshold
    } else {
      // decimal
      const { width, height } = this.pages.getPageStats()
      this.thresholdX = Math.round(width * threshold)
      this.thresholdY = Math.round(height * threshold)
    }
  }

  private cloneFirstAndLastSlidePage(slideContent: HTMLElement) {
    if (this.initialised) {
      this.removeClonedSlidePage(slideContent)
    }
    const children = slideContent.children
    prepend(
      <HTMLElement>children[children.length - 1].cloneNode(true),
      slideContent
    )
    slideContent.appendChild(children[1].cloneNode(true))
  }

  private removeClonedSlidePage(slideContent: HTMLElement) {
    const slidePages = slideContent.children
    if (slidePages.length > 2) {
      removeChild(slideContent, <HTMLElement>slidePages[slidePages.length - 1])
      removeChild(slideContent, <HTMLElement>slidePages[0])
    }
  }

  private modifyCurrentPage() {
    this.isTouching = false
    if (!this.options.loop) {
      return
    }
    // triggered by resetLoop
    if (this.resetLooping) {
      this.resetLooping = false
      return
    }

    const changePage = this.pages.resetLoopPage()
    if (changePage) {
      this.resetLooping = true
      this.goTo(changePage.pageX, changePage.pageY, 0)
      // stop user's scrollEnd
      // since it is a seamless scroll
      return true
    }
    this.pageWillChangeTo(this.pages.currentPage)
  }

  private goTo(pageX: number, pageY: number, time?: number, easing?: EaseItem) {
    const newPage = this.pages.getInternalPage(pageX, pageY)
    if (!newPage) {
      return
    }
    const scrollEasing = easing || this.options.easing || ease.bounce
    const { x, y } = newPage

    const deltaX = x - this.scroll.scroller.scrollBehaviorX.currentPos
    const deltaY = y - this.scroll.scroller.scrollBehaviorY.currentPos
    if (!deltaX && !deltaY) {
      return
    }
    time = time === undefined ? this.getEaseTime(deltaX, deltaY) : time
    this.pages.setCurrentPage(newPage)
    this.pageWillChangeTo(this.pages.currentPage)
    this.scroll.scroller.scrollTo(x, y, time, scrollEasing)
  }

  private flickHandler() {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const {
      currentPos: currentPosX,
      startPos: startPosX,
      direction: directionX,
    } = scrollBehaviorX
    const {
      currentPos: currentPosY,
      startPos: startPosY,
      direction: directionY,
    } = scrollBehaviorY
    const { pageX, pageY } = this.pages.currentPage

    let time = this.getEaseTime(
      currentPosX - startPosX,
      currentPosY - startPosY
    )
    this.goTo(pageX + directionX, pageY + directionY, time)
  }

  private getEaseTime(deltaX: number, deltaY: number): number {
    return (
      this.options.speed ||
      Math.max(
        Math.max(
          Math.min(Math.abs(deltaX), 1000),
          Math.min(Math.abs(deltaY), 1000)
        ),
        300
      )
    )
  }

  private modifyScrollMetaHandler(scrollMeta: {
    newX: number
    newY: number
    time: number
    [key: string]: any
  }) {
    const newPage = this.nearestPage(scrollMeta.newX, scrollMeta.newY)

    scrollMeta.time = this.getEaseTime(
      scrollMeta.newX - newPage.x,
      scrollMeta.newY - newPage.y
    )
    scrollMeta.newX = newPage.x
    scrollMeta.newY = newPage.y
    scrollMeta.easing = this.options.easing || ease.bounce
    this.pages.setCurrentPage(newPage)
    this.pageWillChangeTo(this.pages.currentPage)
  }

  private scrollMoving(point: Position) {
    if (this.isTouching) {
      const newPos = this.nearestPage(point.x, point.y)
      this.pageWillChangeTo(newPos)
    }
  }

  private pageWillChangeTo(newPage: Page) {
    const changeToPage = this.pages.getWillChangedPage(newPage)
    if (!samePage(this.willChangeToPage, changeToPage)) {
      this.willChangeToPage = changeToPage
      this.scroll.trigger(
        this.scroll.eventTypes.slideWillChange,
        this.willChangeToPage
      )
    }
  }

  private setTouchFlag() {
    this.isTouching = true
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  destroy() {
    const slideContent = this.scroll.scroller.content
    const { loop, autoplay } = this.options
    if (loop) {
      this.removeClonedSlidePage(slideContent)
    }
    if (autoplay) {
      clearTimeout(this.autoplayTimer)
    }
    this.hooksFn.forEach((item) => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      if (hooks.eventTypes[hooksName]) {
        hooks.off(hooksName, handlerFn)
      }
    })
    this.hooksFn.length = 0
  }
}
