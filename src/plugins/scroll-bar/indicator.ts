import ScrollBar from './scroll-bar'
import BScroll from '../../index'
import { Direction } from './const'
import { style } from '../../util/dom'

interface IndicatorInterface {
  refresh(): void
  fade(visible?: boolean, hold?: boolean): void
  updatePosition(): void
  transitionTime(time: number): void
  transitionTimingFunction(easing: string): void
  destroy(): void
}

export interface IndicatorOption {
  el: HTMLElement
  direction: Direction
  fade: boolean
  interactive: boolean
}

const INDICATOR_MIN_LEN = 8

export default class Indicator implements IndicatorInterface {
  private wrapper: HTMLElement
  private wrapperStyle: CSSStyleDeclaration
  private indicator: HTMLElement
  private indicatorStyle: CSSStyleDeclaration
  private indicatorHeight: number
  private indicatorWidth: number
  private direction: Direction
  private visible: number
  private fadeTimeout: number
  private sizeRatioX: number
  private sizeRatioY: number
  private maxPosX: number
  private maxPosY: number
  private x: number
  private y: number
  // TODO 考虑是否需要
  constructor(public scroller: BScroll, public options: IndicatorOption) {
    this.wrapper = options.el
    this.wrapperStyle = this.wrapper.style
    this.indicator = this.wrapper.children[0] as HTMLElement
    this.indicatorStyle = this.indicator.style
    this.scroller = scroller
    this.direction = options.direction

    if (options.fade) {
      this.visible = 0
      this.wrapperStyle.opacity = '0'
    } else {
      this.visible = 1
    }

    this.sizeRatioX = 1
    this.sizeRatioY = 1
    this.maxPosX = 0
    this.maxPosY = 0
    this.x = 0
    this.y = 0

    if (options.interactive) {
      // TODO 取消注释
      // this._addDOMEvents()
    }

    this.scroller.on('refresh', () => {
      this.refresh()
    })

    if (options.fade) {
      this.scroller.on('scrollEnd', () => {
        this.fade()
      })

      this.scroller.on('scrollCancel', () => {
        this.fade()
      })

      this.scroller.on('scrollStart', () => {
        this.fade(true)
      })

      this.scroller.on('beforeScrollStart', () => {
        this.fade(true, true)
      })
    }
  }

  refresh() {
    if (this._shouldShow()) {
      this.transitionTime()
      this._calculate()
      this.updatePosition()
    }
  }

  private _shouldShow(): boolean {
    if (
      (this.direction === 'vertical' && this.scroller.hasVerticalScroll) ||
      (this.direction === 'horizontal' && this.scroller.hasHorizontalScroll)
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
            (this.scroller.scrollerHeight || wrapperHeight || 1)
        ),
        INDICATOR_MIN_LEN
      )
      this.indicatorStyle.height = `${this.indicatorHeight}px`

      this.maxPosY = wrapperHeight - this.indicatorHeight
      // 这里 sizeRatio 是个负值
      this.sizeRatioY = this.maxPosY / this.scroller.maxScrollY
    } else {
      let wrapperWidth = this.wrapper.clientWidth
      this.indicatorWidth = Math.max(
        Math.round(
          (wrapperWidth * wrapperWidth) /
            (this.scroller.scrollerWidth || wrapperWidth || 1)
        ),
        INDICATOR_MIN_LEN
      )
      this.indicatorStyle.width = `${this.indicatorWidth}px`

      this.maxPosX = wrapperWidth - this.indicatorWidth
      // 这里 sizeRatio 是个负值
      this.sizeRatioX = this.maxPosX / this.scroller.maxScrollX
    }
  }

  fade(visible?: boolean, hold?: boolean) {
    if (hold && !this.visible) {
      return
    }

    let time = visible ? 250 : 500
    ;(this.wrapperStyle as any)[style.transitionDuration] = time + 'ms'

    clearTimeout(this.fadeTimeout)
    this.fadeTimeout = setTimeout(() => {
      this.wrapperStyle.opacity = visible ? '1' : '0'
      this.visible = visible ? 1 : 0
    }, 0)
  }

  updatePosition() {
    if (this.direction === Direction.Vertical) {
      let y = Math.round(this.sizeRatioY * this.scroller.y)

      if (y < 0) {
        this.transitionTime(500)
        const height = Math.max(this.indicatorHeight + y * 3, INDICATOR_MIN_LEN)
        this.indicatorStyle.height = `${height}px`
        y = 0
      } else if (y > this.maxPosY) {
        this.transitionTime(500)
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

      if (this.scroller.options.useTransform) {
        ;(this.indicatorStyle as any)[style.transform] = `translateY(${y}px)${
          this.scroller.translateZ
        }`
      } else {
        this.indicatorStyle.top = `${y}px`
      }
    } else {
      let x = Math.round(this.sizeRatioX * this.scroller.x)

      if (x < 0) {
        this.transitionTime(500)
        const width = Math.max(this.indicatorWidth + x * 3, INDICATOR_MIN_LEN)
        this.indicatorStyle.width = `${width}px`
        x = 0
      } else if (x > this.maxPosX) {
        this.transitionTime(500)
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

      if (this.scroller.options.useTransform) {
        ;(this.indicatorStyle as any)[style.transform] = `translateX(${x}px)${
          this.scroller.translateZ
        }`
      } else {
        this.indicatorStyle.left = `${x}px`
      }
    }
  }
  transitionTime(time: number = 0) {
    ;(this.indicatorStyle as any)[style.transitionDuration] = time + 'ms'
  }
  transitionTimingFunction(easing: string) {
    ;(this.indicatorStyle as any)[style.transitionTimingFunction] = easing
  }
  destroy() {
    // TODO 取消注释
    // this._removeDOMEvents()
    this.wrapper.parentNode!.removeChild(this.wrapper)
  }
}
