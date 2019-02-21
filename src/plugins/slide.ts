import BScroll from '../index'
import { staticImplements, PluginCtor } from './type'
import { prepend, removeChild, getRect, extend, warn } from '../util'
import { ease } from '../util/ease'
import { slideConfig } from '../Options'
import { EaseFn } from '../util/ease'

type CurrentPage = {
  x?: number
  y?: number
  pageX: number
  pageY: number
}
type pagePos = {
  x: number
  y: number
  width: number
  height: number
  cx: number
  cy: number
}
enum Direction {
  Positive = 'positive',
  Negative = 'negative'
}

@staticImplements<PluginCtor>()
export default class Snap {
  private currentPage: CurrentPage
  private pages: Array<Array<pagePos>>
  private wrapperWidth: number
  private wrapperHeight: number
  private scrollerWidth: number
  private scrollerHeight: number
  private slideEl: NodeListOf<HTMLElement> | null = null
  private loopX: boolean
  private loopY: boolean
  private slideOpt: Partial<slideConfig>
  static pluginName = 'slide'
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    const slide = (this.slideOpt = this.scroll.options.slide as Partial<
      slideConfig
    >)
    const slideEls = this.scroll.scroller.element
    let lazyInit2Refresh = false
    let el = slide.el
    if (typeof el === 'string') {
      this.slideEl = slideEls.querySelectorAll(el)
    }
    if (slide.loop) {
      let children = slideEls.children
      if (children.length > 1) {
        this.cloneSnapEleForLoop(slideEls)
        lazyInit2Refresh = true
      } else {
        // Loop does not make any sense if there is only one child.
        slide.loop = false
      }
    }
    this.currentPage = {
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    }
    this.scroll.on('refresh', () => {
      this.initSnapState()
    })
    this.scroll.scroller.hooks.on('scrollEnd', () => {
      this.loopReset(slide.loop, this.loopX, this.loopY)
    })
    this.enablePageChangeForFlick()
    // TODO: destroy Event
    if (!lazyInit2Refresh) {
      this.initSnapState()
    } else {
      this.scroll.refresh()
    }
  }
  // TODO: _nearestSnap 逻辑
  next(time?: number, easing?: { style: string; fn: EaseFn }) {
    if (!this.hasValidOptions()) {
      return
    }
    const { pageX, pageY } = this.changedPageNum(Direction.Positive)
    this.goTo(pageX, pageY, time, easing)
  }
  prev(time?: number, easing?: { style: string; fn: EaseFn }) {
    if (!this.hasValidOptions()) {
      return
    }
    const { pageX, pageY } = this.changedPageNum(Direction.Negative)
    this.goTo(pageX, pageY, time, easing)
  }
  gotoPage(
    x: number,
    y: number,
    time?: number,
    easing?: { style: string; fn: EaseFn }
  ) {
    if (!this.hasPageInfo()) {
      return
    }
    if (this.slideOpt.loop) {
      let len
      if (this.loopX) {
        len = this.pages.length - 2
        if (x >= len) {
          x = len - 1
        } else if (x < 0) {
          x = 0
        }
        x += 1
      } else {
        len = this.pages[0].length - 2
        if (y >= len) {
          y = len - 1
        } else if (y < 0) {
          y = 0
        }
        y += 1
      }
    }
    this.goTo(x, y, time, easing)
  }
  getCurrentPage(): CurrentPage | null {
    if (!this.hasValidOptions()) {
      return null
    }
    const snap = this.scroll.options.snap
    if (snap.loop) {
      let currentPage
      if (snap._loopX) {
        currentPage = extend({}, this.currentPage, {
          pageX: this.currentPage.pageX - 1
        }) as CurrentPage
      } else {
        currentPage = extend({}, this.currentPage, {
          pageY: this.currentPage.pageY - 1
        }) as CurrentPage
      }
      return currentPage
    }
    return this.currentPage
  }
  destroy() {
    const snapEls = this.scroll.scroller.element
    if (this.slideOpt.loop) {
      let children = snapEls.children
      if (children.length > 2) {
        removeChild(snapEls, <HTMLElement>children[children.length - 1])
        removeChild(snapEls, <HTMLElement>children[0])
      }
    }
  }
  private initSnapState() {
    this.pages = []
    const wrapper = getRect(this.scroll.scroller.wrapper)
    const scroller = getRect(this.scroll.scroller.element)
    this.wrapperWidth = wrapper.width
    this.scrollerWidth = scroller.width
    this.wrapperHeight = wrapper.height
    this.scrollerHeight = scroller.height
    if (
      !this.wrapperWidth ||
      !this.wrapperHeight ||
      !this.scrollerWidth ||
      !this.scrollerHeight
    ) {
      return
    }
    let stepX = this.slideOpt.stepX || this.wrapperWidth
    let stepY = this.slideOpt.stepY || this.wrapperHeight
    this.pages = this.slideEl
      ? this.computePagePosInfoByEl(this.slideEl)
      : this.computePagePosInfo(stepX, stepY)
    if (!this.checkSnapLoop()) {
      return
    }
    let initPageX = this.loopX ? 1 : 0
    let initPageY = this.loopY ? 1 : 0
    this.goTo(
      this.currentPage.pageX || initPageX,
      this.currentPage.pageY || initPageY,
      0
    )
    // TODO Update snap threshold if needed.
  }
  private cloneSnapEleForLoop(slideEls: HTMLElement) {
    const children = slideEls.children
    prepend(
      <HTMLElement>children[children.length - 1].cloneNode(true),
      slideEls
    )
    slideEls.appendChild(children[1].cloneNode(true))
  }
  private computePagePosInfo(
    stepX: number,
    stepY: number
  ): Array<Array<pagePos>> {
    let pages: Array<Array<pagePos>> = []
    let x = 0
    let y
    let cx
    let cy
    let i = 0
    let l
    let m = 0
    let n
    let rect
    const maxScrollPosX = this.scroll.scroller.scrollBehaviorX.maxScrollPos
    const maxScrollPosY = this.scroll.scroller.scrollBehaviorY.maxScrollPos
    cx = Math.round(stepX / 2)
    cy = Math.round(stepY / 2)

    while (x > -this.scrollerWidth) {
      pages[i] = []
      l = 0
      y = 0
      while (y > -this.scrollerHeight) {
        pages[i][l] = {
          x: Math.max(x, maxScrollPosX),
          y: Math.max(y, maxScrollPosY),
          width: stepX,
          height: stepY,
          cx: x - cx,
          cy: y - cy
        }

        y -= stepY
        l++
      }
      x -= stepX
      i++
    }
    return pages
  }
  private computePagePosInfoByEl(
    el: NodeListOf<HTMLElement>
  ): Array<Array<pagePos>> {
    let pages: Array<Array<pagePos>> = []
    let x = 0
    let y
    let cx
    let cy
    let i = 0
    let l
    let m = 0
    let n
    let rect
    l = el.length
    n = -1

    const maxScrollX = this.scroll.scroller.scrollBehaviorX.maxScrollPos
    const maxScrollY = this.scroll.scroller.scrollBehaviorY.maxScrollPos
    for (; i < l; i++) {
      rect = getRect(<HTMLElement>el[i])
      if (i === 0 || rect.left <= getRect(<HTMLElement>el[i - 1]).left) {
        m = 0
        n++
      }

      if (!this.pages[m]) {
        this.pages[m] = []
      }

      x = Math.max(-rect.left, maxScrollX)
      y = Math.max(-rect.top, maxScrollY)
      cx = x - Math.round(rect.width / 2)
      cy = y - Math.round(rect.height / 2)

      pages[m][n] = {
        x: x,
        y: y,
        width: rect.width,
        height: rect.height,
        cx: cx,
        cy: cy
      }

      if (x > maxScrollY) {
        m++
      }
    }
    return pages
  }
  private checkSnapLoop(): boolean {
    if (!this.hasPageInfo()) {
      return false
    }
    const slide = this.scroll.options.slide
    if (this.pages.length > 1) {
      this.loopX = true
    }
    if (this.pages[0] && this.pages[0].length > 1) {
      this.loopY = true
    }
    if (this.loopX && this.loopY) {
      warn('Loop does not support two direction at the same time.')
    }
    return true
  }
  private goTo(
    x: number,
    y: number = 0,
    time?: number,
    easing?: { style: string; fn: EaseFn }
  ) {
    if (!this.hasPageInfo()) {
      return
    }
    const scrollEasing = easing || this.slideOpt.easing || ease.bounce

    if (x >= this.pages.length) {
      x = this.pages.length - 1
    } else if (x < 0) {
      x = 0
    }

    if (!this.pages[x]) {
      return
    }

    if (y >= this.pages[x].length) {
      y = this.pages[x].length - 1
    } else if (y < 0) {
      y = 0
    }

    let posX = this.pages[x][y].x
    let posY = this.pages[x][y].y

    time =
      time === undefined
        ? this.slideOpt.speed ||
          Math.max(
            Math.max(
              Math.min(
                Math.abs(
                  posX - this.scroll.scroller.scrollBehaviorX.currentPos
                ),
                1000
              ),
              Math.min(
                Math.abs(
                  posY - this.scroll.scroller.scrollBehaviorY.currentPos
                ),
                1000
              )
            ),
            300
          )
        : time

    this.currentPage = {
      x: posX,
      y: posY,
      pageX: x,
      pageY: y
    }
    this.scroll.scroller.scrollTo(posX, posY, time, scrollEasing)
  }
  private loopReset(
    enableLoop: boolean | undefined,
    enableLoopX: boolean,
    enableLoopY: boolean
  ) {
    if (enableLoop) {
      if (enableLoopX) {
        if (this.currentPage.pageX === 0) {
          this.goTo(this.pages.length - 2, this.currentPage.pageY, 0)
        }
        if (this.currentPage.pageX === this.pages.length - 1) {
          this.goTo(1, this.currentPage.pageY, 0)
        }
      }
      if (enableLoopY) {
        if (this.currentPage.pageY === 0) {
          this.goTo(this.currentPage.pageX, this.pages[0].length - 2, 0)
        }
        if (this.currentPage.pageY === this.pages[0].length - 1) {
          this.goTo(this.currentPage.pageX, 1, 0)
        }
      }
    }
  }
  private enablePageChangeForFlick() {
    this.scroll.scroller.hooks.on('flick', () => {
      let scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
      let scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
      let time =
        this.slideOpt.speed ||
        Math.max(
          Math.max(
            Math.min(
              Math.abs(scrollBehaviorX.currentPos - scrollBehaviorX.startPos),
              1000
            ),
            Math.min(
              Math.abs(scrollBehaviorY.currentPos - scrollBehaviorY.startPos),
              1000
            )
          ),
          300
        )
      this.goTo(
        this.currentPage.pageX + scrollBehaviorX.direction,
        this.currentPage.pageY + scrollBehaviorY.direction,
        time
      )
    })
  }
  private changedPageNum(
    direction: Direction
  ): { pageX: number; pageY: number } {
    const slide = this.scroll.options.slide
    let x = this.currentPage.pageX
    let y = this.currentPage.pageY
    if (this.loopX) {
      x = direction === Direction.Negative ? x - 1 : x + 1
    }
    if (this.loopY) {
      y = direction === Direction.Negative ? y - 1 : y + 1
    }
    return {
      pageX: x,
      pageY: y
    }
  }
  private hasValidOptions(): boolean {
    const slide = this.scroll.options.slide
    if (!slide) {
      return false
    }
    return true
  }
  private hasPageInfo(): boolean {
    const slide = this.scroll.options.slide
    if (!slide || !this.pages || !this.pages.length) {
      return false
    }
    return true
  }
}
