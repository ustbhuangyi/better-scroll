import BScroll from '../index'
import { PluginInterface } from '../index'
import { prepend, warn } from '../util'
import { ease } from '../util/ease'

type CurrentPage = {
  x: number
  y: number
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
export default class Snap implements PluginInterface {
  currentPage: CurrentPage
  pages: Array<Array<pagePos>>
  wrapperWidth: number
  wrapperHeight: number
  scrollerWidth: number
  scrollerHeight: number
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    console.log('snap init')
    const snap = this.scroll.options.snap
    const snapEls = this.scroll.scroller.element
    this.currentPage = {
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0
    }
    if (snap.loop) {
      let children = snapEls.children
      if (children.length > 1) {
        this.cloneSnapEleForLoop(snapEls)
      } else {
        // Loop does not make any sense if there is only one child.
        snap.loop = false
      }
    }
    // TODO: snap.el
    // let el = snap.el
    // if (typeof el === 'string') {
    //   el = snapEls.querySelectorAll(el)
    // }
    this.scroll.on('refresh', () => {
      console.log('refresh')
      this.pages = []
      const wrapper = this.scroll.scroller.wrapper
      const scroller = this.scroll.scroller.element
      this.wrapperWidth = wrapper.offsetWidth
      this.scrollerWidth = scroller.offsetWidth
      this.wrapperHeight = wrapper.offsetHeight
      this.scrollerHeight = scroller.offsetHeight
      if (
        !this.wrapperWidth ||
        !this.wrapperHeight ||
        !this.scrollerWidth ||
        !this.scrollerHeight
      ) {
        return
      }
      let stepX = snap.stepX || this.wrapperWidth
      let stepY = snap.stepY || this.wrapperHeight
      this.computePagePosInfo(stepX, stepY)
      if (!this.checkSnapLoop()) {
        return
      }
      let initPageX = snap._loopX ? 1 : 0
      let initPageY = snap._loopY ? 1 : 0
      this.goToPage(
        this.currentPage.pageX || initPageX,
        this.currentPage.pageY || initPageY,
        0
      )
    })
    this.scroll.scroller.hooks.on('scrollEnd', () => {
      console.log('scrollEnd')
    })
  }
  private cloneSnapEleForLoop(snapEls: HTMLElement): void {
    const children = snapEls.children
    prepend(<HTMLElement>children[children.length - 1].cloneNode(true), snapEls)
    snapEls.appendChild(children[1].cloneNode(true))
  }
  private computePagePosInfo(stepX: number, stepY: number) {
    let x = 0
    let y
    let cx
    let cy
    let i = 0
    let l
    let m = 0
    let n
    let rect
    cx = Math.round(stepX / 2)
    cy = Math.round(stepY / 2)
    while (x > -this.scrollerWidth) {
      this.pages[i] = []
      l = 0
      y = 0
      while (y > -this.scrollerHeight) {
        this.pages[i][l] = {
          x: Math.max(x, this.scroll.scroller.scrollBehaviorX.maxScrollPos),
          y: Math.max(y, this.scroll.scroller.scrollBehaviorY.maxScrollPos),
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
  }
  private checkSnapLoop(): boolean {
    const snap = this.scroll.options.snap

    if (!snap.loop || !this.pages || !this.pages.length) {
      return false
    }

    if (this.pages.length > 1) {
      snap._loopX = true
    }
    if (this.pages[0] && this.pages[0].length > 1) {
      snap._loopY = true
    }
    if (snap._loopX && snap._loopY) {
      warn('Loop does not support two direction at the same time.')
    }
    return true
  }
  private goToPage(x: number, y: number = 0, time?: number, easing?: Function) {
    const snap = this.scroll.options.snap

    if (!snap || !this.pages || !this.pages.length) {
      return
    }

    const scrollEasing = easing || snap.easing || ease.bounce

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
        ? snap.speed ||
          Math.max(
            Math.max(
              Math.min(Math.abs(posX - this.scroll.scroller.x), 1000),
              Math.min(Math.abs(posY - this.scroll.scroller.y), 1000)
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
  next(time: number, easing: Function): void {
    const snap = this.scroll.options.snap
    if (!snap) {
      return
    }

    let x = this.currentPage.pageX
    let y = this.currentPage.pageY

    x++
    // if (x >= this.pages.length && this.hasVerticalScroll) {
    //   x = 0
    //   y++
    // }

    this.goToPage(x, y, time, easing)
  }
}
