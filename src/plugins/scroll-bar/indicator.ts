import ScrollBar from './scroll-bar'
import BScroll from '../../index'
import { Direction } from './const'
import { style } from '../../util/dom'
import EventRegister from '../../base/EventRegister'
import { TouchEvent } from '../../util/Touch'
import { eventNames } from 'cluster'

export interface IndicatorOption {
  el: HTMLElement
  direction: Direction
  fade: boolean
  interactive: boolean
}

const INDICATOR_MIN_LEN = 8

export default class Indicator {
  public wrapper: HTMLElement
  public wrapperStyle: CSSStyleDeclaration
  public indicator: HTMLElement
  public indicatorStyle: CSSStyleDeclaration
  public indicatorHeight: number
  public indicatorWidth: number
  public direction: Direction
  public visible: number
  // private fadeTimeout: number
  public sizeRatioX: number = 1
  public sizeRatioY: number = 1
  public maxPosX: number = 0
  public maxPosY: number = 0
  public x: number = 0
  public y: number = 0
  public startEventRegister: EventRegister
  public moveEventRegister: EventRegister
  public endEventRegister: EventRegister
  public initiated: boolean
  public moved: boolean
  private lastPointX: number
  private lastPointY: number

  constructor(public bscroll: BScroll, public options: IndicatorOption) {
    this.wrapper = options.el
    this.wrapperStyle = this.wrapper.style
    this.indicator = this.wrapper.children[0] as HTMLElement
    this.indicatorStyle = this.indicator.style
    this.bscroll = bscroll
    this.direction = options.direction

    if (options.interactive) {
      const { disableMouse } = this.bscroll.options
      this.startEventRegister = new EventRegister(this.indicator, [
        {
          name: disableMouse ? 'touchstart' : 'mousedown',
          handler: this._start.bind(this)
        }
      ])

      this.endEventRegister = new EventRegister(window, [
        {
          name: disableMouse ? 'touchend' : 'mouseup',
          handler: this._end.bind(this)
        }
      ])
    }

    // TODO refresh 事件
    this.bscroll.hooks.on('refresh', () => {
      this.refresh()
    })
    this.bscroll.scroller.animater.hooks.on('time', (time: number) => {
      this.setTransitionTime(time)
    })
    this.bscroll.scroller.animater.hooks.on('timeFunction', (ease: string) => {
      this.setTransitionTimingFunction(ease)
    })

    if (options.fade) {
      this.visible = 0
      this.wrapperStyle.opacity = '0'
      // TODO 有时候不会触发 scrollEnd
      ;['scrollEnd', 'scrollCancel'].forEach(eventName => {
        this.bscroll.on(eventName, () => {
          this.fade()
        })
      })

      this.bscroll.on('scrollStart', () => {
        this.fade(true)
      })
      // TODO 考虑是否有用
      // this.scroller.on('beforeScrollStart', () => {
      //   this.fade(true, true)
      // })
    } else {
      this.visible = 1
    }

    const translater = this.bscroll.scroller.translater
    translater.hooks.on(
      'beforeTranslate',
      (transformStyle: string, point: { x: number; y: number }) => {
        this.updatePosition(transformStyle, point)
      }
    )
  }

  refresh() {
    if (this._shouldShow()) {
      this.setTransitionTime()
      this._calculate()
      this.updatePosition()
    }
  }

  private _shouldShow(): boolean {
    if (
      (this.direction === Direction.Vertical &&
        this.bscroll.hasVerticalScroll) ||
      (this.direction === Direction.Horizontal &&
        this.bscroll.hasHorizontalScroll)
    ) {
      this.wrapper.style.display = ''
      return true
    }
    this.wrapper.style.display = 'none'
    return false
  }

  private _calculate() {
    if (this.direction === Direction.Vertical) {
      let wrapperHeight = this.wrapper.clientHeight
      this.indicatorHeight = Math.max(
        Math.round(
          (wrapperHeight * wrapperHeight) /
            (this.bscroll.scrollerHeight || wrapperHeight || 1)
        ),
        INDICATOR_MIN_LEN
      )
      this.indicatorStyle.height = `${this.indicatorHeight}px`

      this.maxPosY = wrapperHeight - this.indicatorHeight
      // 这里 sizeRatio 是个负值
      this.sizeRatioY = this.maxPosY / this.bscroll.maxScrollY
    } else {
      let wrapperWidth = this.wrapper.clientWidth
      this.indicatorWidth = Math.max(
        Math.round(
          (wrapperWidth * wrapperWidth) /
            (this.bscroll.scrollerWidth || wrapperWidth || 1)
        ),
        INDICATOR_MIN_LEN
      )
      this.indicatorStyle.width = `${this.indicatorWidth}px`

      this.maxPosX = wrapperWidth - this.indicatorWidth
      // 这里 sizeRatio 是个负值
      this.sizeRatioX = this.maxPosX / this.bscroll.maxScrollX
    }
  }

  fade(visible?: boolean, hold?: boolean) {
    // TODO 思考 fade 逻辑
    // if (hold && !this.visible) {
    //   return
    // }

    let time = visible ? 250 : 500
    this.wrapperStyle[style.transitionDuration as any] = time + 'ms'

    // clearTimeout(this.fadeTimeout)
    // this.fadeTimeout = window.setTimeout(() => {
    this.wrapperStyle.opacity = visible ? '1' : '0'
    this.visible = visible ? 1 : 0
    // }, 0)
  }

  // TODO 拆分 x y, refactor to pure function
  updatePosition(transformStyle?: string, point?: { x: number; y: number }) {
    if (this.direction === Direction.Vertical) {
      let y = Math.round(this.sizeRatioY * this.bscroll.y)

      if (y < 0) {
        // TODO 取消注释
        // this.transitionTime(500)
        const height = Math.max(this.indicatorHeight + y * 3, INDICATOR_MIN_LEN)
        this.indicatorStyle.height = `${height}px`
        y = 0
      } else if (y > this.maxPosY) {
        // this.transitionTime(500)
        const height = Math.max(
          this.indicatorHeight - (y - this.maxPosY) * 3,
          INDICATOR_MIN_LEN
        )
        this.indicatorStyle.height = `${height}px`
        y = this.maxPosY + this.indicatorHeight - height
      } else {
        this.indicatorStyle.height = `${this.indicatorHeight}px`
      }
      this.y = y

      if (this.bscroll.options.useTransform) {
        this.indicatorStyle[style.transform as any] = `translateY(${y}px)${
          this.bscroll.translateZ
        }`
      } else {
        this.indicatorStyle.top = `${y}px`
      }
    } else {
      let x = Math.round(this.sizeRatioX * this.bscroll.x)

      if (x < 0) {
        this.setTransitionTime(500)
        const width = Math.max(this.indicatorWidth + x * 3, INDICATOR_MIN_LEN)
        this.indicatorStyle.width = `${width}px`
        x = 0
      } else if (x > this.maxPosX) {
        this.setTransitionTime(500)
        const width = Math.max(
          this.indicatorWidth - (x - this.maxPosX) * 3,
          INDICATOR_MIN_LEN
        )
        this.indicatorStyle.width = `${width}px`
        x = this.maxPosX + this.indicatorWidth - width
      } else {
        this.indicatorStyle.width = `${this.indicatorWidth}px`
      }

      this.x = x

      if (this.bscroll.options.useTransform) {
        this.indicatorStyle[style.transform as any] = `translateX(${x}px)${
          this.bscroll.translateZ
        }`
      } else {
        this.indicatorStyle.left = `${x}px`
      }
    }
  }

  setTransitionTime(time: number = 0) {
    this.indicatorStyle[style.transitionDuration as any] = time + 'ms'
  }

  setTransitionTimingFunction(easing: string) {
    this.indicatorStyle[style.transitionTimingFunction as any] = easing
  }

  private _start(e: TouchEvent) {
    let point = (e.touches ? e.touches[0] : e) as Touch

    e.preventDefault()
    e.stopPropagation()

    this.setTransitionTime()

    this.initiated = true
    this.moved = false
    this.lastPointX = point.pageX
    this.lastPointY = point.pageY

    const { disableMouse } = this.bscroll.options
    this.moveEventRegister = new EventRegister(window, [
      {
        name: disableMouse ? 'touchmove' : 'mousemove',
        handler: this._move.bind(this)
      }
    ])

    this.bscroll.trigger('beforeScrollStart')
  }

  private _move(e: TouchEvent) {
    let point = (e.touches ? e.touches[0] : e) as Touch

    e.preventDefault()
    e.stopPropagation()

    if (!this.moved) {
      this.bscroll.trigger('scrollStart')
    }

    this.moved = true

    const { x, y } = this._calDesPos(point)

    this.bscroll.scrollTo(x, y)

    this.bscroll.trigger('scroll', {
      x: this.bscroll.x,
      y: this.bscroll.y
    })
  }

  private _calDesPos(point: Touch) {
    let deltaX = point.pageX - this.lastPointX
    this.lastPointX = point.pageX

    let deltaY = point.pageY - this.lastPointY
    this.lastPointY = point.pageY

    let x = this.x + deltaX
    let y = this.y + deltaY

    if (x < 0) {
      x = 0
    } else if (x > this.maxPosX) {
      x = this.maxPosX
    }

    if (y < 0) {
      y = 0
    } else if (y > this.maxPosY) {
      y = this.maxPosY
    }

    x = Math.round(x / this.sizeRatioX)
    y = Math.round(y / this.sizeRatioY)

    return {
      x,
      y
    }
  }

  private _end(e: TouchEvent) {
    if (!this.initiated) {
      return
    }
    this.initiated = false

    e.preventDefault()
    e.stopPropagation()

    this.moveEventRegister.destroy()

    // TODO 处理 snap 相关逻辑
    // const snapOption = this.scroller.options.snap
    // if (snapOption) {
    //   let {speed, easing = ease.bounce} = snapOption
    //   let snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y)

    //   let time = speed || Math.max(
    //       Math.max(
    //         Math.min(Math.abs(this.scroller.x - snap.x), 1000),
    //         Math.min(Math.abs(this.scroller.y - snap.y), 1000)
    //       ), 300)

    //   if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
    //     this.scroller.directionX = 0
    //     this.scroller.directionY = 0
    //     this.scroller.currentPage = snap
    //     this.scroller.scrollTo(snap.x, snap.y, time, easing)
    //   }
    // }

    if (this.moved) {
      this.bscroll.trigger('scrollEnd', {
        x: this.bscroll.x,
        y: this.bscroll.y
      })
    }
  }
  destroy() {
    this.startEventRegister.destroy()
    this.moveEventRegister && this.moveEventRegister.destroy()
    this.endEventRegister.destroy()
    this.wrapper.parentNode!.removeChild(this.wrapper)
  }
}
