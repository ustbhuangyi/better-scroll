import BScroll, { TranslaterPoint } from '@better-scroll/core'
import { style, EventEmitter } from '@better-scroll/shared-utils'
import EventHandler from './event-handler'
import { Direction } from './index'

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
  private hooksHandlers: Array<[EventEmitter, string, Function]> = []

  constructor(public bscroll: BScroll, public options: IndicatorOption) {
    this.wrapper = options.wrapper
    this.wrapperStyle = this.wrapper.style
    this.el = this.wrapper.children[0] as HTMLElement
    this.elStyle = this.el.style
    this.bscroll = bscroll
    this.direction = options.direction

    this.keysMap = this._getKeysMap()

    if (options.fade) {
      this.visible = 0
      this.wrapperStyle.opacity = '0'
    } else {
      this.visible = 1
    }

    this._listenHooks(options.fade, options.interactive)

    this.refresh()
  }

  private _listenHooks(fade: boolean, interactive: boolean) {
    const bscroll = this.bscroll
    const bscrollHooks = bscroll
    const translaterHooks = bscroll.scroller.translater.hooks
    const animaterHooks = bscroll.scroller.animater.hooks

    this._listen(bscrollHooks, 'refresh', this.refresh)
    this._listen(translaterHooks, 'translate', this.updatePosAndSize)
    this._listen(animaterHooks, 'time', (time: number) => {
      this.setTransitionTime(time)
    })
    this._listen(animaterHooks, 'timeFunction', (ease: string) => {
      this.setTransitionTimingFunction(ease)
    })

    if (fade) {
      this._listen(bscrollHooks, 'scrollEnd', () => {
        this.fade()
      })
      this._listen(bscrollHooks, 'scrollStart', () => {
        this.fade(true)
      })
      // for mousewheel event
      if (
        bscroll.eventTypes.mousewheelStart &&
        bscroll.eventTypes.mousewheelEnd
      ) {
        this._listen(bscrollHooks, 'mousewheelStart', () => {
          this.fade(true)
        })
        this._listen(bscrollHooks, 'mousewheelEnd', () => {
          this.fade()
        })
      }
    }

    if (interactive) {
      const { disableMouse } = this.bscroll.options
      this.eventHandler = new EventHandler(this, { disableMouse })
      const eventHandlerHooks = this.eventHandler.hooks
      this._listen(eventHandlerHooks, 'touchStart', this.startHandler)
      this._listen(eventHandlerHooks, 'touchMove', this.moveHandler)
      this._listen(eventHandlerHooks, 'touchEnd', this.endHandler)
    }
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
        translate: 'translateY'
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
      translate: 'translateX'
    }
  }

  fade(visible?: boolean) {
    let time = visible ? 250 : 500
    this.wrapperStyle[style.transitionDuration as any] = time + 'ms'
    this.wrapperStyle.opacity = visible ? '1' : '0'
    this.visible = visible ? 1 : 0
  }

  refresh() {
    let { hasScroll } = this.keysMap
    if (this._setShowBy(this.bscroll[hasScroll])) {
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
    // sizeRatio is negative
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
      size = Math.max(initialSize + pos * 3, INDICATOR_MIN_LEN)
      pos = 0
    } else if (pos > maxPos) {
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
    const { translate, size: sizeKey } = this.keysMap

    this.elStyle[sizeKey] = `${size}px`

    this.elStyle[style.transform as any] = `${translate}(${pos}px)${
      this.bscroll.options.translateZ
    }`
  }

  setTransitionTime(time: number = 0) {
    this.elStyle[style.transitionDuration as any] = time + 'ms'
  }

  setTransitionTimingFunction(easing: string) {
    this.elStyle[style.transitionTimingFunction as any] = easing
  }

  startHandler() {
    this.setTransitionTime()
    this.bscroll.trigger('beforeScrollStart')
  }

  moveHandler(moved: boolean, delta: number) {
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

  endHandler(moved: boolean) {
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

    this.hooksHandlers.forEach(item => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksHandlers.length = 0
  }

  private _listen(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksHandlers.push([hooks, name, handler])
  }
}
