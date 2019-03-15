import BScroll from '../../index'
import { fixInboundValue } from '../../util/lang'
import { prepend, removeChild, addClass } from '../../util/dom'
import { ease, EaseItem } from '../../util/ease'
import PageInfo, { SlidePoint } from './PageInfo'
import propertiesConfig from './propertiesConfig'
import { staticImplements, PluginCtor } from '../type'
import EventEmitter from '../../base/EventEmitter'

export type slideOptions = Partial<SlideConfig> | boolean | undefined
export interface SlideConfig {
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
}

declare module '../../Options' {
  interface Options {
    slide?: slideOptions
  }
}

@staticImplements<PluginCtor>()
export default class Slide {
  private page: PageInfo
  private slideOpt: Partial<SlideConfig>
  private thresholdX: number
  private thresholdY: number
  static pluginName = 'slide'
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.scroll.proxy(propertiesConfig)
    this.slideOpt = this.scroll.options.slide as Partial<SlideConfig>
    this.page = new PageInfo(scroll, this.slideOpt)
    this.hooksFn = []
    this.init()
  }
  init() {
    const slide = this.slideOpt
    const slideEls = this.scroll.scroller.element
    let lazyInit2Refresh = false
    if (slide.loop) {
      let children = slideEls.children
      if (children.length > 1) {
        this.cloneSlideEleForLoop(slideEls)
        lazyInit2Refresh = true
      } else {
        // Loop does not make any sense if there is only one child.
        slide.loop = false
      }
    }
    this.setSlideWidth(slideEls)
    this.page.currentPage = {
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    }
    const scrollHooks = this.scroll.hooks
    const scrollerHooks = this.scroll.scroller.hooks

    this.registorHooks(scrollHooks, 'refresh', this.initSlideState)
    this.registorHooks(scrollHooks, 'destroy', this.destroy)
    this.registorHooks(
      scrollerHooks,
      'modifyScrollMeta',
      this.modifyScrollMetaHandler
    )
    this.registorHooks(scrollerHooks, 'scrollEnd', this.resetLoop)
    this.registorHooks(
      this.scroll.scroller.animater.hooks,
      'forceStop',
      this.resetLoop
    )
    if (slide.listenFlick !== false) {
      this.registorHooks(scrollerHooks, 'flick', this.flickHandler)
    }

    if (!lazyInit2Refresh) {
      this.initSlideState()
    } else {
      this.scroll.refresh()
    }
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
  getCurrentPage(): SlidePoint {
    return this.page.getRealPage()
  }
  nearestPage(x: number, y: number): SlidePoint {
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
    const slideEls = this.scroll.scroller.element
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
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }
  private initSlideState() {
    this.page.init()
    this.initThreshold()
    if (this.page.slideX || this.page.slideY) {
      let initPageX = this.page.loopX ? 1 : 0
      let initPageY = this.page.loopY ? 1 : 0
      this.goTo(
        this.page.currentPage.pageX || initPageX,
        this.page.currentPage.pageY || initPageY,
        0
      )
    }
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
  private resetLoop() {
    if (!this.slideOpt.loop) {
      return
    }
    const changePage = this.page.resetLoopPage()
    if (changePage) {
      this.goTo(changePage.pageX, changePage.pageY, 0)
    }
  }
  private setSlideWidth(slideEls: HTMLElement) {
    if (this.slideOpt.disableSetWidth) {
      return
    }
    if (!this.scroll.options.scrollX) {
      return
    }
    const children = slideEls.children
    const slideItemWidth = children[0].clientWidth
    for (let i = 0; i < children.length; i++) {
      const slideItemDom = children[i] as HTMLElement
      slideItemDom.style.width = slideItemWidth + 'px'
    }
    slideEls.style.width = slideItemWidth * children.length + 'px'
  }
  private goTo(x: number, y: number = 0, time?: number, easing?: EaseItem) {
    const pageInfo = this.page.change2safePage(x, y)
    if (!pageInfo) {
      return
    }
    const scrollEasing = easing || this.slideOpt.easing || ease.bounce
    let posX = pageInfo.x as number
    let posY = pageInfo.y as number
    const deltaX = posX - this.scroll.scroller.scrollBehaviorX.currentPos
    const deltaY = posY - this.scroll.scroller.scrollBehaviorY.currentPos
    time = time === undefined ? this.getAnimateTime(deltaX, deltaY) : time

    this.page.currentPage = {
      x: posX,
      y: posY,
      pageX: pageInfo.pageX,
      pageY: pageInfo.pageY
    }
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
    this.page.currentPage = {
      x: scrollMeta.newX,
      y: scrollMeta.newY,
      pageX: newPos.pageX,
      pageY: newPos.pageY
    }
  }
  private registorHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }
}
