import ScrollBar from './scroll-bar'
import BScroll from '../../index'
import { Direction } from './const'
import { style, getRect } from '../../util/dom'
import EventRegister from '../../base/EventRegister'
import { TouchEvent } from '../../util/Touch'
import EventHandler from './eventHandler'
import { TranslaterPoint } from '../../translater'

export interface IndicatorOption {
  wrapper: HTMLElement
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

interface KeyValues {
  maxPos: number
  sizeRatio: number
  initialSize: number
}

const INDICATOR_MIN_LEN = 8

export default class Indicator {
  public wrapper: HTMLElement
  public wrapperStyle: CSSStyleDeclaration
  public el: HTMLElement
  public elStyle: CSSStyleDeclaration
  public direction: Direction
  public visible: number
  public keyVals: KeyValues = {
    sizeRatio: 1,
    maxPos: 0,
    initialSize: 0
  }
  public curPos: number = 0
  public keysMap: KeysMap
  public eventHandler: EventHandler

  constructor(public bscroll: BScroll, public options: IndicatorOption) {
    this.wrapper = options.wrapper
    this.wrapperStyle = this.wrapper.style
    this.el = this.wrapper.children[0] as HTMLElement
    this.elStyle = this.el.style
    this.bscroll = bscroll
    this.direction = options.direction

    this.keysMap = this._getKeysMap()

    if (options.interactive) {
      // const { disableMouse } = this.bscroll.options
      // this.eventHandler = new EventHandler(this, { disableMouse })
      // this.eventHandler.hooks.on('touchStart', this._startHandler, this)
      // this.eventHandler.hooks.on('touchMove', this._moveHandler, this)
      // this.eventHandler.hooks.on('touchEnd', this._endHandler, this)
    }

    // TODO refresh 事件
    this.bscroll.hooks.on('refresh', this.refresh, this)

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
    animater.hooks.on('translate', this.updatePosAndSize, this)
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

  fade(visible?: boolean) {
    // TODO 对比 1.0
    let time = visible ? 250 : 500
    this.wrapperStyle[style.transitionDuration as any] = time + 'ms'
    this.wrapperStyle.opacity = visible ? '1' : '0'
    this.visible = visible ? 1 : 0
  }

  refresh() {
    let { hasScroll } = this.keysMap
    if (this._setShowBy(this.bscroll[hasScroll])) {
      // TODO time？
      this.setTransitionTime()
      let { wrapperSize, scrollerSize, maxScroll } = this.keysMap

      this.keyVals = this._refreshKeyValues(
        this.wrapper[wrapperSize],
        this.bscroll[scrollerSize],
        this.bscroll[maxScroll]
      )

      this.updatePosAndSize({
        x: this.bscroll.x,
        y: this.bscroll.y
      })
    }
  }

  private _setShowBy(hasScroll: boolean): boolean {
    if (hasScroll) {
      this.wrapper.style.display = ''
      return true
    }
    this.wrapper.style.display = 'none'
    return false
  }

  private _refreshKeyValues(
    wrapperSize: number,
    scrollerSize: number,
    maxScroll: number
  ): KeyValues {
    let initialSize = Math.max(
      Math.round(
        (wrapperSize * wrapperSize) / (scrollerSize || wrapperSize || 1)
      ),
      INDICATOR_MIN_LEN
    )

    let maxPos = wrapperSize - initialSize
    // 这里 sizeRatio 是个负值
    let sizeRatio = maxPos / maxScroll

    return {
      initialSize,
      maxPos,
      sizeRatio
    }
  }

  updatePosAndSize(endPoint: TranslaterPoint) {
    const { pos, size } = this._refreshPosAndSizeValue(endPoint, this.keyVals)
    this.curPos = pos
    this._refreshPosAndSizeStyle(size, pos)
  }

  private _refreshPosAndSizeValue(
    endPoint: TranslaterPoint,
    keyVals: KeyValues
  ): { pos: number; size: number } {
    const { pos: posKey } = this.keysMap
    const { sizeRatio, initialSize, maxPos } = keyVals

    let pos = Math.round(sizeRatio * endPoint[posKey])
    let size
    if (pos < 0) {
      // TODO 搞清楚这里设置transitionTime 的逻辑
      // this.transitionTime(500)
      size = Math.max(initialSize + pos * 3, INDICATOR_MIN_LEN)
      pos = 0
    } else if (pos > maxPos) {
      // this.transitionTime(500)
      size = Math.max(initialSize - (pos - maxPos) * 3, INDICATOR_MIN_LEN)
      pos = maxPos + initialSize - size
    } else {
      size = initialSize
    }

    return {
      pos,
      size
    }
  }

  private _refreshPosAndSizeStyle(size: number, pos: number) {
    const { position, translate, size: sizeKey } = this.keysMap

    this.elStyle[sizeKey] = `${size}px`

    // TODO translateZ ？
    if (this.bscroll.options.useTransform) {
      this.elStyle[style.transform as any] = `${translate}(${pos}px)${
        this.bscroll.translateZ
      }`
    } else {
      this.elStyle[position] = `${pos}px`
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

    const newScrollPos = this._calScrollDesPos(this.curPos, delta, this.keyVals)

    // TODO freeScroll ？
    if (this.direction === Direction.Vertical) {
      this.bscroll.scrollTo(this.bscroll.x, newScrollPos)
    } else {
      this.bscroll.scrollTo(newScrollPos, this.bscroll.y)
    }

    this.bscroll.trigger('scroll', {
      x: this.bscroll.x,
      y: this.bscroll.y
    })
  }

  private _calScrollDesPos(
    curPos: number,
    delta: number,
    keyVals: KeyValues
  ): number {
    const { maxPos, sizeRatio } = keyVals
    let newPos = curPos + delta

    if (newPos < 0) {
      newPos = 0
    } else if (newPos > maxPos) {
      newPos = maxPos
    }

    return Math.round(newPos / sizeRatio)
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
