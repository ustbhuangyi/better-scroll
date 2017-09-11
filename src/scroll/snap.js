import { getRect, prepend } from '../util/dom'
import { ease } from '../util/ease'

export function snapMixin(BScroll) {
  BScroll.prototype._initSnap = function () {
    this.currentPage = {}
    const snap = this.options.snap

    if (snap.loop) {
      let children = this.scroller.children
      if (children.length > 0) {
        prepend(children[children.length - 1].cloneNode(true), this.scroller)
        this.scroller.appendChild(children[1].cloneNode(true))
      }
    }

    let el = snap.el
    if (typeof el === 'string') {
      el = this.scroller.querySelectorAll(el)
    }

    this.on('refresh', () => {
      this.pages = []

      if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
        return
      }

      let stepX = snap.stepX || this.wrapperWidth
      let stepY = snap.stepY || this.wrapperHeight

      let x = 0
      let y
      let cx
      let cy
      let i = 0
      let l
      let m = 0
      let n
      let rect
      if (!el) {
        cx = Math.round(stepX / 2)
        cy = Math.round(stepY / 2)

        while (x > -this.scrollerWidth) {
          this.pages[i] = []
          l = 0
          y = 0

          while (y > -this.scrollerHeight) {
            this.pages[i][l] = {
              x: Math.max(x, this.maxScrollX),
              y: Math.max(y, this.maxScrollY),
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
      } else {
        l = el.length
        n = -1

        for (; i < l; i++) {
          rect = getRect(el[i])
          if (i === 0 || rect.left <= getRect(el[i - 1]).left) {
            m = 0
            n++
          }

          if (!this.pages[m]) {
            this.pages[m] = []
          }

          x = Math.max(-rect.left, this.maxScrollX)
          y = Math.max(-rect.top, this.maxScrollY)
          cx = x - Math.round(rect.width / 2)
          cy = y - Math.round(rect.height / 2)

          this.pages[m][n] = {
            x: x,
            y: y,
            width: rect.width,
            height: rect.height,
            cx: cx,
            cy: cy
          }

          if (x > this.maxScrollX) {
            m++
          }
        }
      }

      let initPage = snap.loop ? 1 : 0
      this.goToPage(this.currentPage.pageX || initPage, this.currentPage.pageY || 0, 0)

      // Update snap threshold if needed
      const snapThreshold = snap.threshold
      if (snapThreshold % 1 === 0) {
        this.snapThresholdX = snapThreshold
        this.snapThresholdY = snapThreshold
      } else {
        this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * snapThreshold)
        this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * snapThreshold)
      }
    })

    this.on('scrollEnd', () => {
      if (snap.loop) {
        if (this.currentPage.pageX === 0) {
          this.goToPage(this.pages.length - 2, this.currentPage.pageY, 0)
        }
        if (this.currentPage.pageX === this.pages.length - 1) {
          this.goToPage(1, this.currentPage.pageY, 0)
        }
      }
    })

    if (snap.listenFlick !== false) {
      this.on('flick', () => {
        let time = snap.speed || Math.max(
            Math.max(
              Math.min(Math.abs(this.x - this.startX), 1000),
              Math.min(Math.abs(this.y - this.startY), 1000)
            ), 300)

        this.goToPage(
          this.currentPage.pageX + this.directionX,
          this.currentPage.pageY + this.directionY,
          time
        )
      })
    }
  }

  BScroll.prototype._nearestSnap = function (x, y) {
    if (!this.pages.length) {
      return {x: 0, y: 0, pageX: 0, pageY: 0}
    }

    let i = 0
    // Check if we exceeded the snap threshold
    if (Math.abs(x - this.absStartX) <= this.snapThresholdX &&
      Math.abs(y - this.absStartY) <= this.snapThresholdY) {
      return this.currentPage
    }

    if (x > 0) {
      x = 0
    } else if (x < this.maxScrollX) {
      x = this.maxScrollX
    }

    if (y > 0) {
      y = 0
    } else if (y < this.maxScrollY) {
      y = this.maxScrollY
    }

    let l = this.pages.length
    for (; i < l; i++) {
      if (x >= this.pages[i][0].cx) {
        x = this.pages[i][0].x
        break
      }
    }

    l = this.pages[i].length

    let m = 0
    for (; m < l; m++) {
      if (y >= this.pages[0][m].cy) {
        y = this.pages[0][m].y
        break
      }
    }

    if (i === this.currentPage.pageX) {
      i += this.directionX

      if (i < 0) {
        i = 0
      } else if (i >= this.pages.length) {
        i = this.pages.length - 1
      }

      x = this.pages[i][0].x
    }

    if (m === this.currentPage.pageY) {
      m += this.directionY

      if (m < 0) {
        m = 0
      } else if (m >= this.pages[0].length) {
        m = this.pages[0].length - 1
      }

      y = this.pages[0][m].y
    }

    return {
      x,
      y,
      pageX: i,
      pageY: m
    }
  }

  BScroll.prototype.goToPage = function (x, y, time, easing = ease.bounce) {
    const snap = this.options.snap
    if (x >= this.pages.length) {
      x = this.pages.length - 1
    } else if (x < 0) {
      x = 0
    }

    if (y >= this.pages[x].length) {
      y = this.pages[x].length - 1
    } else if (y < 0) {
      y = 0
    }

    let posX = this.pages[x][y].x
    let posY = this.pages[x][y].y

    time = time === undefined ? snap.speed || Math.max(
        Math.max(
          Math.min(Math.abs(posX - this.x), 1000),
          Math.min(Math.abs(posY - this.y), 1000)
        ), 300) : time

    this.currentPage = {
      x: posX,
      y: posY,
      pageX: x,
      pageY: y
    }
    this.scrollTo(posX, posY, time, easing)
  }

  BScroll.prototype.next = function (time, easing) {
    let x = this.currentPage.pageX
    let y = this.currentPage.pageY

    x++
    if (x >= this.pages.length && this.hasVerticalScroll) {
      x = 0
      y++
    }

    this.goToPage(x, y, time, easing)
  }

  BScroll.prototype.prev = function (time, easing) {
    let x = this.currentPage.pageX
    let y = this.currentPage.pageY

    x--
    if (x < 0 && this.hasVerticalScroll) {
      x = 0
      y--
    }

    this.goToPage(x, y, time, easing)
  }

  BScroll.prototype.getCurrentPage = function () {
    return this.options.snap && this.currentPage
  }
}