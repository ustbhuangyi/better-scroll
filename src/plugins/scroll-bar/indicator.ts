import ScrollBar from './scroll-bar'
import BScroll from '../../index'
import { Direction } from './const'
import { style } from '../../util/dom'
import EventRegister from '../../base/EventRegister'
import { TouchEvent } from '../../util/Touch'
import EventHandler from './eventHandler'
import { TranslaterPoint } from '../../translater'

export interface IndicatorOption {
  el: HTMLElement
  direction: Direction
  fade: boolean
  interactive: boolean
}

interface KeysMap {
  hasScroll: 'hasVerticalScroll' | 'hasHorizontalScroll'
  size: 'height' | 'width'
  wrapperSize: 'clientHeight' | 'clientWidth'
  scrollerSize: 'scrollerHeight' | 'scrollerWidth'
  maxScroll: 'maxScrollY' | 'maxScrollX'
  pos: 'y' | 'x'
  pointPos: 'pageX' | 'pageY'
  translate: 'translateY' | 'translateX'
  position: 'top' | 'left'
}

const INDICATOR_MIN_LEN = 8

export default class Indicator {
  public wrapper: HTMLElement
  public wrapperStyle: CSSStyleDeclaration
  public el: HTMLElement
  public elStyle: CSSStyleDeclaration
  public initialSize: number
  public direction: Direction
  public visible: number
  // private fadeTimeout: number
  public sizeRatio: number = 1
  public maxPos: number = 0
  public curPos: number = 0
  public keysMap: KeysMap
  public eventHandler: EventHandler

  constructor(public bscroll: BScroll, public options: IndicatorOption) {
    this.wrapper = options.el
    this.wrapperStyle = this.wrapper.style
    this.el = this.wrapper.children[0] as HTMLElement
    this.elStyle = this.el.style
    this.bscroll = bscroll
    this.direction = options.direction

    this.keysMap = this._getKeysMap()

    if (options.interactive) {
      const { disableMouse } = this.bscroll.options
      this.eventHandler = new EventHandler(this, { disableMouse })
      this.eventHandler.hooks.on('touchStart', this._startHandler, this)
      this.eventHandler.hooks.on('touchMove', this._moveHandler, this)
      this.eventHandler.hooks.on('touchEnd', this._endHandler, this)
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
      // TDOO scrollCancel
      ;['scrollEnd'].forEach(eventName => {
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

    const animater = this.bscroll.scroller.animater
    animater.hooks.on('translate', (endPoint: TranslaterPoint) => {
      this.updatePosition(endPoint)
    })
  }

  _getKeysMap(): KeysMap {
    if (this.direction === Direction.Vertical) {
      return {
        hasScroll: 'hasVerticalScroll',
        size: 'height',
        wrapperSize: 'clientHeight',
        scrollerSize: 'scrollerHeight',
        maxScroll: 'maxScrollY',
        pos: 'y',
        pointPos: 'pageY',
        translate: 'translateY',
        position: 'top'
      }
    }
    return {
      hasScroll: 'hasHorizontalScroll',
      size: 'width',
      wrapperSize: 'clientWidth',
      scrollerSize: 'scrollerWidth',
      maxScroll: 'maxScrollX',
      pos: 'x',
      pointPos: 'pageX',
      translate: 'translateX',
      position: 'left'
    }
  }

  refresh() {
    if (this._shouldShow()) {
      this.setTransitionTime()
      this._calculate()
      this.updatePosition({
        x: this.bscroll.x,
        y: this.bscroll.y
      })
    }
  }

  private _shouldShow(): boolean {
    if (this.bscroll[this.keysMap.hasScroll]) {
      this.wrapper.style.display = ''
      return true
    }
    this.wrapper.style.display = 'none'
    return false
  }

  private _calculate() {
    let { size, wrapperSize, scrollerSize, maxScroll } = this.keysMap
    let wrapperSizeValue = this.wrapper[wrapperSize] // FIX 取 offsetHeight offsetWidth，reflow？
    this.initialSize = Math.max(
      Math.round(
        (wrapperSizeValue * wrapperSizeValue) /
          (this.bscroll[scrollerSize] || wrapperSizeValue || 1)
      ),
      INDICATOR_MIN_LEN
    )
    this.elStyle[size] = `${this.initialSize}px`

    this.maxPos = wrapperSizeValue - this.initialSize
    // 这里 sizeRatio 是个负值
    this.sizeRatio = this.maxPos / this.bscroll[maxScroll]
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
  updatePosition(endPoint: TranslaterPoint) {
    const { pos, size, translate, position } = this.keysMap
    let newPos = Math.round(this.sizeRatio * endPoint[pos])

    if (newPos < 0) {
      // TODO 取消注释
      // this.transitionTime(500)
      const sizeValue = Math.max(
        this.initialSize + newPos * 3,
        INDICATOR_MIN_LEN
      )
      this.elStyle[size] = `${sizeValue}px`
      newPos = 0
    } else if (newPos > this.maxPos) {
      // this.transitionTime(500)
      const sizeValue = Math.max(
        this.initialSize - (newPos - this.maxPos) * 3,
        INDICATOR_MIN_LEN
      )
      this.elStyle[size] = `${sizeValue}px`
      newPos = this.maxPos + this.initialSize - sizeValue
    } else {
      this.elStyle[size] = `${this.initialSize}px`
    }

    this.curPos = newPos

    if (this.bscroll.options.useTransform) {
      this.elStyle[style.transform as any] = `${translate}(${newPos}px)${
        this.bscroll.translateZ
      }`
    } else {
      this.elStyle[position] = `${newPos}px`
    }
  }

  setTransitionTime(time: number = 0) {
    this.elStyle[style.transitionDuration as any] = time + 'ms'
  }

  setTransitionTimingFunction(easing: string) {
    this.elStyle[style.transitionTimingFunction as any] = easing
  }

  private _startHandler() {
    this.setTransitionTime()
    this.bscroll.trigger('beforeScrollStart')
  }

  private _moveHandler(moved: boolean, delta: number) {
    if (!moved) {
      this.bscroll.trigger('scrollStart')
    }

    const newPos = this._calDesPos(delta)

    // TODO freeScroll ？
    if (this.direction === Direction.Vertical) {
      this.bscroll.scrollTo(this.bscroll.x, newPos)
    } else {
      this.bscroll.scrollTo(newPos, this.bscroll.y)
    }

    this.bscroll.trigger('scroll', {
      x: this.bscroll.x,
      y: this.bscroll.y
    })
  }

  private _calDesPos(delta: number) {
    let newPos = this.curPos + delta

    if (newPos < 0) {
      newPos = 0
    } else if (newPos > this.maxPos) {
      newPos = this.maxPos
    }

    newPos = Math.round(newPos / this.sizeRatio)

    return newPos
  }

  private _endHandler(moved: boolean) {
    if (moved) {
      this.bscroll.trigger('scrollEnd', {
        x: this.bscroll.x,
        y: this.bscroll.y
      })
    }
  }

  destroy() {
    if (this.options.interactive) {
      this.eventHandler.destroy()
    }
    this.wrapper.parentNode!.removeChild(this.wrapper)
  }
}
