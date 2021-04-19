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
  startPageXIndex: number
  startPageYIndex: number
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
  initialised: boolean
  contentChanged: boolean
  prevContent: HTMLElement
  exposedPage: Page
  private cachedClonedPageDOM: HTMLElement[] = []
  private oneToMorePagesInLoop: boolean
  private moreToOnePageInLoop: boolean
  private thresholdX: number
  private thresholdY: number
  private hooksFn: Array<[EventEmitter, string, Function]>
  private resetLooping = false
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
    this.scroll.registerType(['slideWillChange', 'slidePageChanged'])
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
      startPageXIndex: 0,
      startPageYIndex: 0,
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleLoop(prevSlideContent: HTMLElement) {
    const { loop } = this.options
    const slideContent = this.scroll.scroller.content
    const currentSlidePagesLength = slideContent.children.length
    // only should respect loop scene
    if (loop) {
      if (slideContent !== prevSlideContent) {
        this.resetLoopChangedStatus()
        this.removeClonedSlidePage(prevSlideContent)
        currentSlidePagesLength > 1 &&
          this.cloneFirstAndLastSlidePage(slideContent)
      } else {
        // many pages reduce to one page
        if (currentSlidePagesLength === 3 && this.initialised) {
          this.removeClonedSlidePage(slideContent)
          this.moreToOnePageInLoop = true
          this.oneToMorePagesInLoop = false
        } else if (currentSlidePagesLength > 1) {
          // one page increases to many page
          if (this.initialised && this.cachedClonedPageDOM.length === 0) {
            this.oneToMorePagesInLoop = true
            this.moreToOnePageInLoop = false
          } else {
            this.removeClonedSlidePage(slideContent)
            this.resetLoopChangedStatus()
          }
          this.cloneFirstAndLastSlidePage(slideContent)
        } else {
          this.resetLoopChangedStatus()
        }
      }
    }
  }

  private resetLoopChangedStatus() {
    this.moreToOnePageInLoop = false
    this.oneToMorePagesInLoop = false
  }

  private handleHooks() {
    const scrollHooks = this.scroll.hooks
    const scrollerHooks = this.scroll.scroller.hooks
    const { listenFlick } = this.options
    this.prevContent = this.scroll.scroller.content

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
        this.handleLoop(this.prevContent)
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
      scrollerHooks.eventTypes.scroll,
      this.scrollHandler
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
    this.goTo(pageIndex.pageX, pageIndex.pageY, time, easing)
  }

  getCurrentPage(): Page {
    return this.exposedPage || this.pages.getInitialPage(false, true)
  }

  setCurrentPage(page: Page) {
    this.pages.setCurrentPage(page)
    this.exposedPage = this.pages.getExposedPage(page)
  }

  nearestPage(x: number, y: number): Page {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const {
      maxScrollPos: maxScrollPosX,
      minScrollPos: minScrollPosX,
    } = scrollBehaviorX
    const {
      maxScrollPos: maxScrollPosY,
      minScrollPos: minScrollPosY,
    } = scrollBehaviorY

    return this.pages.getNearestPage(
      between(x, maxScrollPosX, minScrollPosX),
      between(y, maxScrollPosY, minScrollPosY)
    )
  }

  private satisfyThreshold(x: number, y: number): boolean {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller

    let satisfied = true
    if (
      Math.abs(x - scrollBehaviorX.absStartPos) <= this.thresholdX &&
      Math.abs(y - scrollBehaviorY.absStartPos) <= this.thresholdY
    ) {
      satisfied = false
    }

    return satisfied
  }

  private refreshHandler(content: HTMLElement) {
    if (!this.satisfyInitialization()) {
      return
    }
    this.pages.refresh()
    this.computeThreshold()

    const contentChanged = (this.contentChanged = this.prevContent !== content)
    if (contentChanged) {
      this.prevContent = content
    }
    const initPage = this.pages.getInitialPage(
      this.oneToMorePagesInLoop || this.moreToOnePageInLoop,
      contentChanged || !this.initialised
    )
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
    const children = slideContent.children
    const preprendDOM = children[children.length - 1].cloneNode(
      true
    ) as HTMLElement
    const appendDOM = children[0].cloneNode(true) as HTMLElement
    prepend(preprendDOM, slideContent)
    slideContent.appendChild(appendDOM)
    this.cachedClonedPageDOM = [preprendDOM, appendDOM]
  }

  private removeClonedSlidePage(slideContent: HTMLElement) {
    // maybe slideContent has removed from DOM Tree
    const slidePages = (slideContent && slideContent.children) || []
    if (slidePages.length) {
      this.cachedClonedPageDOM.forEach((el) => {
        removeChild(slideContent, el)
      })
    }
    this.cachedClonedPageDOM = []
  }

  private modifyCurrentPage(point: Position) {
    const {
      pageX: prevExposedPageX,
      pageY: prevExposedPageY,
    } = this.getCurrentPage()
    const newPage = this.nearestPage(point.x, point.y)
    this.setCurrentPage(newPage)

    /* istanbul ignore if */
    if (this.contentChanged) {
      this.contentChanged = false
      return true
    }

    const {
      pageX: currentExposedPageX,
      pageY: currentExposedPageY,
    } = this.getCurrentPage()
    this.pageWillChangeTo(newPage)

    // loop is true, and one page becomes many pages when call bs.refresh
    if (this.oneToMorePagesInLoop) {
      this.oneToMorePagesInLoop = false
      return true
    }

    // loop is true, and many page becomes one page when call bs.refresh
    // if prevPage > 0, dispatch slidePageChanged and scrollEnd events
    /* istanbul ignore if */
    if (
      this.moreToOnePageInLoop &&
      prevExposedPageX === 0 &&
      prevExposedPageY === 0
    ) {
      this.moreToOnePageInLoop = false
      return true
    }

    if (
      prevExposedPageX !== currentExposedPageX ||
      prevExposedPageY !== currentExposedPageY
    ) {
      // only trust pageX & pageY when loop is true
      const page = this.pages.getExposedPageByPageIndex(
        currentExposedPageX,
        currentExposedPageY
      )
      this.scroll.trigger(this.scroll.eventTypes.slidePageChanged, page)
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
  }

  private goTo(pageX: number, pageY: number, time?: number, easing?: EaseItem) {
    const newPage = this.pages.getInternalPage(pageX, pageY)
    const scrollEasing = easing || this.options.easing || ease.bounce
    const { x, y } = newPage

    const deltaX = x - this.scroll.scroller.scrollBehaviorX.currentPos
    const deltaY = y - this.scroll.scroller.scrollBehaviorY.currentPos
    /* istanbul ignore if */
    if (!deltaX && !deltaY) {
      this.scroll.scroller.togglePointerEvents(true)
      return
    }
    time = time === undefined ? this.getEaseTime(deltaX, deltaY) : time
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
    const { scrollBehaviorX, scrollBehaviorY, animater } = this.scroll.scroller
    const newX = scrollMeta.newX
    const newY = scrollMeta.newY

    const newPage =
      this.satisfyThreshold(newX, newY) || animater.forceStopped
        ? this.pages.getPageByDirection(
            this.nearestPage(newX, newY),
            scrollBehaviorX.direction,
            scrollBehaviorY.direction
          )
        : this.pages.currentPage

    scrollMeta.time = this.getEaseTime(
      scrollMeta.newX - newPage.x,
      scrollMeta.newY - newPage.y
    )
    scrollMeta.newX = newPage.x
    scrollMeta.newY = newPage.y
    scrollMeta.easing = this.options.easing || ease.bounce
  }

  private scrollHandler({ x, y }: Position) {
    if (this.satisfyThreshold(x, y)) {
      const newPage = this.nearestPage(x, y)
      this.pageWillChangeTo(newPage)
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
