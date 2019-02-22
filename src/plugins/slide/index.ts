import BScroll from '../../index'
import { staticImplements, PluginCtor } from '../type'
import { prepend, removeChild, fixInboundValue } from '../../util'
import { ease, EaseFn } from '../../util/ease'
import { slideConfig } from '../../Options'
import PageInfo, { SlidePoint } from './PageInfo'

@staticImplements<PluginCtor>()
export default class Slide {
  private currentPage: SlidePoint
  private page: PageInfo
  private slideOpt: Partial<slideConfig>
  private thresholdX: number
  private thresholdY: number
  static pluginName = 'slide'
  constructor(public scroll: BScroll) {
    this.slideOpt = this.scroll.options.slide as Partial<slideConfig>
    this.page = new PageInfo(scroll, this.slideOpt)
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

    this.page.currentPage = {
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    }
    this.scroll.on('refresh', () => {
      this.initSlideState()
    })
    this.scroll.scroller.hooks.on(
      'modifyScrollMeta',
      (scrollMeta: {
        newX: number
        newY: number
        time: number
        [key: string]: any
      }) => {
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
    )
    this.scroll.scroller.hooks.on('scrollEnd', () => {
      const changePage = this.page.resetLoopPage()
      if (changePage) {
        this.goTo(changePage.pageX, changePage.pageY, 0)
      }
    })
    if (slide.listenFlick !== false) {
      this.enablePageChangeForFlick()
    }
    // TODO: destroy Event
    if (!lazyInit2Refresh) {
      this.initSlideState()
    } else {
      this.scroll.refresh()
    }
  }
  next(time?: number, easing?: { style: string; fn: EaseFn }) {
    if (!this.hasValidOptions()) {
      return
    }
    const { pageX, pageY } = this.page.nextPage()
    this.goTo(pageX, pageY, time, easing)
  }
  prev(time?: number, easing?: { style: string; fn: EaseFn }) {
    if (!this.hasValidOptions()) {
      return
    }
    const { pageX, pageY } = this.page.prevPage()
    this.goTo(pageX, pageY, time, easing)
  }
  gotoPage(
    x: number,
    y: number,
    time?: number,
    easing?: { style: string; fn: EaseFn }
  ) {
    const pageInfo = this.page.realPage2Page(x, y)
    if (!pageInfo) {
      return
    }
    this.goTo(pageInfo.realX, pageInfo.realY, time, easing)
  }
  getCurrentPage(): SlidePoint | null {
    if (!this.hasValidOptions()) {
      return null
    }
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
  }
  private initSlideState() {
    this.page.init()
    this.initThreshold()
    if (this.page.loopX || this.page.loopY) {
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
  private goTo(
    x: number,
    y: number = 0,
    time?: number,
    easing?: { style: string; fn: EaseFn }
  ) {
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
      pageX: x,
      pageY: y
    }
    this.scroll.scroller.scrollTo(posX, posY, time, scrollEasing)
  }
  private enablePageChangeForFlick() {
    this.scroll.scroller.hooks.on('flick', () => {
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
    })
  }
  private hasValidOptions(): boolean {
    const slide = this.scroll.options.slide
    if (!slide) {
      return false
    }
    return true
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
}
