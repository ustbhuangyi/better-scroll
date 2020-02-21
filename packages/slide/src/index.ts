import BScroll, { Options } from '@better-scroll/core'
import {
  fixInboundValue,
  prepend,
  removeChild,
  ease,
  EaseItem,
  Direction,
  EventEmitter
} from '@better-scroll/shared-utils'
import SlidePage, { Page, Position } from './SlidePage'
import propertiesConfig from './propertiesConfig'

export type SlideOptions = Partial<Config> | boolean | undefined
export interface Config {
  loop: boolean
  el: HTMLElement | string
  threshold: number
  stepX: number
  stepY: number
  speed: number
  easing: {
    style: string
    fn: (t: number) => number
  }
  listenFlick: boolean
  disableSetWidth: boolean
  disableSetHeight: boolean
}

declare module '@better-scroll/core' {
  interface Options {
    slide?: SlideOptions
  }
}

export default class Slide {
  static pluginName = 'slide'
  private page: SlidePage
  private slideOpt: Partial<Config>
  private thresholdX: number
  private thresholdY: number
  private hooksFn: Array<[EventEmitter, string, Function]>
  private resetLooping = false
  private isTouching = false
  private willChangeToPage: Page
  private resizeTimeout: number
  constructor(public scroll: BScroll) {
    this.scroll.proxy(propertiesConfig)
    this.scroll.registerType(['slideWillChange'])
    this.slideOpt = this.scroll.options.slide as Partial<Config>
    this.page = new SlidePage(scroll, this.slideOpt)
    this.hooksFn = []
    this.willChangeToPage = {
      pageX: 0,
      pageY: 0
    }
    this.init()
  }
  init() {
    const slide = this.slideOpt
    const slideEls = this.scroll.scroller.content
    let lazyInitByRefresh = false
    if (slide.loop) {
      let children = slideEls.children
      if (children.length > 1) {
        this.cloneSlideEleForLoop(slideEls)
        lazyInitByRefresh = true
      } else {
        // Loop does not make any sense if there is only one child.
        slide.loop = false
      }
    }
    const shouldRefreshByWidth = this.setSlideWidth(slideEls)
    const shouldRefreshByHeight = this.setSlideHeight(
      this.scroll.scroller.wrapper,
      slideEls
    )
    const shouldRefresh = shouldRefreshByWidth || shouldRefreshByHeight

    const scrollHooks = this.scroll.hooks
    const scrollerHooks = this.scroll.scroller.hooks

    this.registorHooks(scrollHooks, 'refresh', this.initSlideState)
    this.registorHooks(scrollHooks, 'destroy', this.destroy)
    this.registorHooks(scrollerHooks, 'momentum', this.modifyScrollMetaHandler)
    // scrollEnd handler should be called before customized handlers
    this.registorHooks(this.scroll, 'scrollEnd', this.amendCurrentPage)
    this.registorHooks(scrollerHooks, 'beforeStart', this.setTouchFlag)
    this.registorHooks(scrollerHooks, 'scroll', this.scrollMoving)
    this.registorHooks(scrollerHooks, 'resize', this.resize)

    // for mousewheel event
    if (
      this.scroll.eventTypes.mousewheelMove &&
      this.scroll.eventTypes.mousewheelEnd
    ) {
      this.registorHooks(this.scroll, 'mousewheelMove', () => {
        // prevent default action of mousewheelMove
        return true
      })
      this.registorHooks(
        this.scroll,
        'mousewheelEnd',
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

    if (slide.listenFlick !== false) {
      this.registorHooks(scrollerHooks, 'flick', this.flickHandler)
    }

    if (!lazyInitByRefresh && !shouldRefresh) {
      this.initSlideState()
    } else {
      this.scroll.refresh()
    }
  }
  resize() {
    const slideEls = this.scroll.scroller.content
    const slideWrapper = this.scroll.scroller.wrapper
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = window.setTimeout(() => {
      this.clearSlideWidth(slideEls)
      this.clearSlideHeight(slideEls)
      this.setSlideWidth(slideEls)
      this.setSlideHeight(slideWrapper, slideEls)
      this.scroll.refresh()
    }, this.scroll.options.resizePolling)
    return true
  }
  next(time?: number, easing?: EaseItem) {
    const { pageX, pageY } = this.page.nextPage()
    this.goTo(pageX, pageY, time, easing)
  }
  prev(time?: number, easing?: EaseItem) {
    const { pageX, pageY } = this.page.prevPage()
    this.goTo(pageX, pageY, time, easing)
  }
  goToPage(x: number, y: number, time?: number, easing?: EaseItem) {
    const pageInfo = this.page.realPage2Page(x, y)
    if (!pageInfo) {
      return
    }
    this.goTo(pageInfo.realX, pageInfo.realY, time, easing)
  }
  getCurrentPage(): Page {
    return this.page.getRealPage()
  }
  nearestPage(x: number, y: number): Page & Position {
    const scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
    const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
    let triggerThreshold = true
    if (
      Math.abs(x - scrollBehaviorX.absStartPos) <= this.thresholdX &&
      Math.abs(y - scrollBehaviorY.absStartPos) <= this.thresholdY
    ) {
      triggerThreshold = false
    }
    if (!triggerThreshold) {
      return this.page.currentPage
    }

    return this.page.nearestPage(
      fixInboundValue(
        x,
        scrollBehaviorX.maxScrollPos,
        scrollBehaviorX.minScrollPos
      ),
      fixInboundValue(
        y,
        scrollBehaviorY.maxScrollPos,
        scrollBehaviorY.minScrollPos
      ),
      scrollBehaviorX.direction,
      scrollBehaviorY.direction
    )
  }
  destroy() {
    const slideEls = this.scroll.scroller.content
    if (this.slideOpt.loop) {
      let children = slideEls.children
      if (children.length > 2) {
        removeChild(slideEls, <HTMLElement>children[children.length - 1])
        removeChild(slideEls, <HTMLElement>children[0])
      }
    }
    this.hooksFn.forEach(item => {
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
    this.page.init()
    this.initThreshold()
    const initPage = this.page.getInitPage()
    this.goTo(initPage.pageX, initPage.pageY, 0)
  }
  private initThreshold() {
    const slideThreshold = this.slideOpt.threshold || 0.1

    if (slideThreshold % 1 === 0) {
      this.thresholdX = slideThreshold
      this.thresholdY = slideThreshold
    } else {
      const pageSize = this.page.getPageSize()
      this.thresholdX = Math.round(pageSize.width * slideThreshold)
      this.thresholdY = Math.round(pageSize.height * slideThreshold)
    }
  }
  private cloneSlideEleForLoop(slideEls: HTMLElement) {
    const children = slideEls.children
    prepend(
      <HTMLElement>children[children.length - 1].cloneNode(true),
      slideEls
    )
    slideEls.appendChild(children[1].cloneNode(true))
  }
  private amendCurrentPage() {
    this.isTouching = false
    if (!this.slideOpt.loop) {
      return
    }
    // triggered by resetLoop
    if (this.resetLooping) {
      this.resetLooping = false
      return
    }
    // fix bug: scroll two page or even more page at once and fetch the boundary.
    // In this case, momentum won't be trigger, so the pageIndex will be wrong and won't be trigger reset.
    let isScrollToBoundary = false
    if (
      this.page.loopX &&
      (this.scroll.x === this.scroll.scroller.scrollBehaviorX.minScrollPos ||
        this.scroll.x === this.scroll.scroller.scrollBehaviorX.maxScrollPos)
    ) {
      isScrollToBoundary = true
    }
    if (
      this.page.loopY &&
      (this.scroll.y === this.scroll.scroller.scrollBehaviorY.minScrollPos ||
        this.scroll.y === this.scroll.scroller.scrollBehaviorY.maxScrollPos)
    ) {
      isScrollToBoundary = true
    }
    if (isScrollToBoundary) {
      const scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
      const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
      const newPos = this.page.nearestPage(
        fixInboundValue(
          this.scroll.x,
          scrollBehaviorX.maxScrollPos,
          scrollBehaviorX.minScrollPos
        ),
        fixInboundValue(
          this.scroll.y,
          scrollBehaviorY.maxScrollPos,
          scrollBehaviorY.minScrollPos
        ),
        0,
        0
      )
      const newPage = {
        x: newPos.x,
        y: newPos.y,
        pageX: newPos.pageX,
        pageY: newPos.pageY
      }
      if (!this.page.isSameWithCurrent(newPage)) {
        this.page.changeCurrentPage(newPage)
      }
    }
    const changePage = this.page.resetLoopPage()
    if (changePage) {
      this.resetLooping = true
      this.goTo(changePage.pageX, changePage.pageY, 0)
      return true // stop trigger chain
    }
    // amend willChangeToPage, because willChangeToPage maybe wrong when sliding quickly
    this.pageWillChangeTo(this.page.currentPage)
  }
  private shouldSetWidthHeight(checkType: 'width' | 'height'): Boolean {
    type checkOption = [keyof Options, keyof Config]
    const checkMap = {
      width: <checkOption>['scrollX', 'disableSetWidth'],
      height: <checkOption>['scrollY', 'disableSetHeight']
    }
    const checkOption = checkMap[checkType]
    if (!this.scroll.options[checkOption[0]]) {
      return false
    }
    if (this.slideOpt[checkOption[1]]) {
      return false
    }
    return true
  }
  private clearSlideWidth(slideEls: HTMLElement): void {
    if (!this.shouldSetWidthHeight('width')) {
      return
    }
    const children = slideEls.children
    for (let i = 0; i < children.length; i++) {
      const slideItemDom = children[i] as HTMLElement
      slideItemDom.removeAttribute('style')
    }
    slideEls.removeAttribute('style')
  }
  private setSlideWidth(slideEls: HTMLElement): Boolean {
    if (!this.shouldSetWidthHeight('width')) {
      return false
    }
    const children = slideEls.children
    const slideItemWidth = children[0].clientWidth
    for (let i = 0; i < children.length; i++) {
      const slideItemDom = children[i] as HTMLElement
      slideItemDom.style.width = slideItemWidth + 'px'
    }
    slideEls.style.width = slideItemWidth * children.length + 'px'
    return true
  }
  private clearSlideHeight(slideEls: HTMLElement) {
    if (!this.shouldSetWidthHeight('height')) {
      return
    }
    const children = slideEls.children
    for (let i = 0; i < children.length; i++) {
      const slideItemDom = children[i] as HTMLElement
      slideItemDom.removeAttribute('style')
    }
    slideEls.removeAttribute('style')
  }
  // height change will not effect minScrollY & maxScrollY
  private setSlideHeight(
    slideWrapper: HTMLElement,
    slideEls: HTMLElement
  ): Boolean {
    if (!this.shouldSetWidthHeight('height')) {
      return false
    }
    const wrapperHeight = slideWrapper.clientHeight
    const children = slideEls.children
    for (let i = 0; i < children.length; i++) {
      const slideItemDom = children[i] as HTMLElement
      slideItemDom.style.height = wrapperHeight + 'px'
    }
    slideEls.style.height = wrapperHeight * children.length + 'px'
    return true
  }
  private goTo(
    pageX: number,
    pageY: number = 0,
    time?: number,
    easing?: EaseItem
  ) {
    const newPageInfo = this.page.change2safePage(pageX, pageY)
    if (!newPageInfo) {
      return
    }
    const scrollEasing = easing || this.slideOpt.easing || ease.bounce
    let posX = newPageInfo.x!
    let posY = newPageInfo.y!
    const deltaX = posX - this.scroll.scroller.scrollBehaviorX.currentPos
    const deltaY = posY - this.scroll.scroller.scrollBehaviorY.currentPos
    if (!deltaX && !deltaY) {
      return
    }
    time = time === undefined ? this.getAnimateTime(deltaX, deltaY) : time
    this.page.changeCurrentPage({
      x: posX,
      y: posY,
      pageX: newPageInfo.pageX,
      pageY: newPageInfo.pageY
    })
    this.pageWillChangeTo(this.page.currentPage)
    this.scroll.scroller.scrollTo(posX, posY, time, scrollEasing)
  }
  private flickHandler() {
    let scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
    let scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
    const deltaX = scrollBehaviorX.currentPos - scrollBehaviorX.startPos
    const deltaY = scrollBehaviorY.currentPos - scrollBehaviorY.startPos
    let time = this.getAnimateTime(deltaX, deltaY)
    this.goTo(
      this.page.currentPage.pageX + scrollBehaviorX.direction,
      this.page.currentPage.pageY + scrollBehaviorY.direction,
      time
    )
  }
  private getAnimateTime(deltaX: number, deltaY: number): number {
    if (this.slideOpt.speed) {
      return this.slideOpt.speed
    }
    return Math.max(
      Math.max(
        Math.min(Math.abs(deltaX), 1000),
        Math.min(Math.abs(deltaY), 1000)
      ),
      300
    )
  }
  private modifyScrollMetaHandler(scrollMeta: {
    newX: number
    newY: number
    time: number
    [key: string]: any
  }) {
    const newPos = this.nearestPage(scrollMeta.newX, scrollMeta.newY)
    scrollMeta.time = this.getAnimateTime(
      scrollMeta.newX - <number>newPos.x,
      scrollMeta.newY - <number>newPos.y
    )
    scrollMeta.newX = <number>newPos.x
    scrollMeta.newY = <number>newPos.y
    scrollMeta.easing = this.slideOpt.easing || ease.bounce
    this.page.changeCurrentPage({
      x: scrollMeta.newX,
      y: scrollMeta.newY,
      pageX: newPos.pageX,
      pageY: newPos.pageY
    })
    this.pageWillChangeTo(this.page.currentPage)
  }
  private scrollMoving(point: Position) {
    if (this.isTouching) {
      const newPos = this.nearestPage(point.x, point.y)
      this.pageWillChangeTo(newPos)
    }
  }
  private pageWillChangeTo(newPage: Page) {
    const changeToPage = this.page.getRealPage(newPage)
    if (
      changeToPage.pageX === this.willChangeToPage.pageX &&
      changeToPage.pageY === this.willChangeToPage.pageY
    ) {
      return
    }
    this.willChangeToPage = changeToPage
    this.scroll.trigger('slideWillChange', this.willChangeToPage)
  }
  private setTouchFlag() {
    this.isTouching = true
  }
  private registorHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }
}
