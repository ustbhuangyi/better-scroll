import BScroll from '@better-scroll/core'
import {
  between,
  prepend,
  removeChild,
  ease,
  extend,
  EaseItem,
  Direction,
  EventEmitter,
  removeSizeStyle,
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

export const samePage = (p1: Page, p2: Page) => {
  return p1.pageX === p2.pageX && p1.pageY === p2.pageY
}

export default class Slide implements PluginAPI {
  static pluginName = 'slide'
  pages: SlidePages
  private inited: boolean
  options: SlideConfig
  private thresholdX: number
  private thresholdY: number
  private hooksFn: Array<[EventEmitter, string, Function]>
  private resetLooping = false
  private isTouching = false
  private willChangeToPage: Page
  private resizeTimer: number = 0
  private autoplayTimer: number = 0
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    this.handleBScroll()
    this.handleOptions()

    this.createPage()
    this.willChangeToPage = extend({}, BASE_PAGE)

    this.handleLoop()
    this.handleHooks()

    this.setSlideInlineStyle()
  }

  private createPage() {
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
    const slideContent = this.scroll.scroller.content
    if (loop) {
      const slidePages = slideContent.children
      if (slidePages.length > 1) {
        this.cloneFirstAndLastSlideItem(slideContent)
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
      this.initSlideState
    )
    this.registerHooks(
      scrollHooks,
      scrollHooks.eventTypes.destroy,
      this.destroy
    )

    // scroller
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
    this.registerHooks(
      scrollerHooks,
      scrollerHooks.eventTypes.resize,
      this.resize
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
    const {
      content: slideContent,
      wrapper: slideWrapper,
    } = this.scroll.scroller
    this.setSlideInlineWidthStyle(slideContent)
    this.setSlideInlineHeightStyle(slideWrapper, slideContent)
  }

  resize() {
    const { content: slideContent } = this.scroll.scroller
    clearTimeout(this.resizeTimer)
    this.resizeTimer = window.setTimeout(() => {
      this.clearSlideInlineWidthStyle(slideContent)
      this.clearSlideInlineHeightStyle(slideContent)

      this.setSlideInlineStyle()
      this.scroll.refresh()
    }, this.scroll.options.resizePolling)
    return true
  }

  private clearSlideInlineWidthStyle(slideContent: HTMLElement) {
    const SIZE_TYPE = 'width'
    if (this.shouldSetInlineSizeStyle(SIZE_TYPE)) {
      const children = slideContent.children
      for (let i = 0; i < children.length; i++) {
        const slidePageDOM = children[i] as HTMLElement
        removeSizeStyle(slidePageDOM, SIZE_TYPE)
      }
      removeSizeStyle(slideContent, SIZE_TYPE)
    }
  }

  private clearSlideInlineHeightStyle(slideContent: HTMLElement) {
    const SIZE_TYPE = 'height'
    if (this.shouldSetInlineSizeStyle(SIZE_TYPE)) {
      const children = slideContent.children
      for (let i = 0; i < children.length; i++) {
        const slidePageDOM = children[i] as HTMLElement
        removeSizeStyle(slidePageDOM, SIZE_TYPE)
      }
      removeSizeStyle(slideContent, SIZE_TYPE)
    }
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
  destroy() {
    const slideContent = this.scroll.scroller.content
    const { loop, autoplay } = this.options
    if (loop) {
      let slidePages = slideContent.children
      if (slidePages.length > 2) {
        removeChild(
          slideContent,
          <HTMLElement>slidePages[slidePages.length - 1]
        )
        removeChild(slideContent, <HTMLElement>slidePages[0])
      }
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
  private initSlideState() {
    this.pages.init()
    this.computeThreshold()
    const initPage = this.pages.getInitialPage()
    if (this.inited) {
      this.goTo(initPage.pageX, initPage.pageY, 0)
    } else {
      this.registerHooks(
        this.scroll.hooks,
        this.scroll.hooks.eventTypes.beforeInitialScrollTo,
        (position: { x: number; y: number }) => {
          this.inited = true
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
  private cloneFirstAndLastSlideItem(slideContent: HTMLElement) {
    const children = slideContent.children
    prepend(
      <HTMLElement>children[children.length - 1].cloneNode(true),
      slideContent
    )
    slideContent.appendChild(children[1].cloneNode(true))
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

    // TODO:
    // fix bug: scroll two page or even more page at once and fetch the boundary in pc
    // In this case, momentum won't be trigger, so the pageIndex will be wrong and won't be trigger reset.
    let atTheBoundary = false
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const {
      currentPos: currentPosX,
      minScrollPos: minScrollPosX,
      maxScrollPos: maxScrollPosX,
    } = scrollBehaviorX
    const {
      currentPos: currentPosY,
      minScrollPos: minScrollPosY,
      maxScrollPos: maxScrollPosY,
    } = scrollBehaviorY
    if (
      this.pages.loopX &&
      (currentPosX === minScrollPosX || currentPosX === maxScrollPosX)
    ) {
      atTheBoundary = true
    }
    if (
      this.pages.loopY &&
      (currentPosY === minScrollPosY || currentPosY === maxScrollPosY)
    ) {
      atTheBoundary = true
    }
    if (atTheBoundary) {
      const newPage = this.pages.nearestPage(
        between(currentPosX, maxScrollPosX, minScrollPosX),
        between(currentPosY, maxScrollPosY, minScrollPosY),
        0,
        0
      )
      if (!samePage(this.pages.currentPage, newPage)) {
        this.pages.setCurrentPage(newPage)
      }
    }
    const changePage = this.pages.resetLoopPage()
    if (changePage) {
      this.resetLooping = true
      this.goTo(changePage.pageX, changePage.pageY, 0)
      // stop user's scrollEnd
      // since it is a seamless scroll
      return true
    }
    // amend willChangeToPage, because willChangeToPage maybe wrong when sliding quickly
    this.pageWillChangeTo(this.pages.currentPage)
  }

  private setSlideInlineWidthStyle(slideContent: HTMLElement) {
    if (this.shouldSetInlineSizeStyle('width')) {
      const children = slideContent.children
      const lenth = children.length
      const slidePageWidth = children[0].clientWidth
      for (let i = 0; i < lenth; i++) {
        const slidePageDOM = children[i] as HTMLElement
        slidePageDOM.style.width = slidePageWidth + 'px'
      }
      slideContent.style.width = slidePageWidth * lenth + 'px'
    }
  }

  private setSlideInlineHeightStyle(
    slideWrapper: HTMLElement,
    slideContent: HTMLElement
  ) {
    if (this.shouldSetInlineSizeStyle('height')) {
      const wrapperHeight = slideWrapper.clientHeight
      const children = slideContent.children
      const lenth = children.length
      for (let i = 0; i < lenth; i++) {
        const slidePageDOM = children[i] as HTMLElement
        slidePageDOM.style.height = wrapperHeight + 'px'
      }
      slideContent.style.height = wrapperHeight * lenth + 'px'
    }
  }

  private shouldSetInlineSizeStyle(sizeType: 'width' | 'height'): Boolean {
    const scrollableMap = {
      width: 'scrollX',
      height: 'scrollY',
    }
    const scrollable = scrollableMap[sizeType]
    return this.scroll.options[scrollable]
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
}
