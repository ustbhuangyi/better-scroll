import BScroll, { TranslaterPoint } from '@better-scroll/core'
import { style, EventEmitter, between } from '@better-scroll/shared-utils'
import EventHandler from './event-handler'

export const enum IndicatorDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface IndicatorOption {
  wrapper: HTMLElement
  direction: IndicatorDirection
  fade: boolean
  interactive: boolean
  minSize: number
}

interface KeysMap {
  hasScroll: 'hasVerticalScroll' | 'hasHorizontalScroll'
  size: 'height' | 'width'
  wrapperSize: 'clientHeight' | 'clientWidth'
  scrollerSize: 'scrollerHeight' | 'scrollerWidth'
  maxScrollPos: 'maxScrollY' | 'maxScrollX'
  pos: 'y' | 'x'
  point: 'pageX' | 'pageY'
  translateProperty: 'translateY' | 'translateX'
}

interface ScrollInfo {
  maxScrollPos: number
  minScrollPos: number
  sizeRatio: number
  indicatorSize: number
}

export default class Indicator {
  wrapper: HTMLElement
  indicatorEl: HTMLElement
  scrollInfo: ScrollInfo
  currentPos: number = 0
  keysMap: KeysMap
  eventHandler: EventHandler
  hooksFn: [EventEmitter, string, Function][] = []

  constructor(public scroll: BScroll, public options: IndicatorOption) {
    this.wrapper = options.wrapper
    this.indicatorEl = this.wrapper.children[0] as HTMLElement
    this.keysMap = this.getKeysMap(options.direction)

    this.handleFade()

    this.handleHooks()

    this.refresh()
  }

  private handleFade() {
    if (this.options.fade) {
      this.wrapper.style.opacity = '0'
    }
  }

  private handleHooks() {
    const { fade, interactive } = this.options
    const scroll = this.scroll
    const scrollHooks = scroll.hooks
    const translaterHooks = scroll.scroller.translater.hooks
    const animaterHooks = scroll.scroller.animater.hooks

    this.registerHooks(
      scrollHooks,
      scrollHooks.eventTypes.refresh,
      this.refresh
    )

    this.registerHooks(
      translaterHooks,
      translaterHooks.eventTypes.translate,
      this.updatePosition
    )

    this.registerHooks(
      animaterHooks,
      animaterHooks.eventTypes.time,
      this.setTransitionTime
    )

    this.registerHooks(
      animaterHooks,
      animaterHooks.eventTypes.timeFunction,
      this.setTransitionTimingFunction
    )

    if (fade) {
      this.registerHooks(scroll, scroll.eventTypes.scrollEnd, () => {
        this.fade()
      })

      this.registerHooks(scroll, scroll.eventTypes.scrollStart, () => {
        this.fade(true)
      })

      // for mousewheel event
      if (
        scroll.eventTypes.mousewheelStart &&
        scroll.eventTypes.mousewheelEnd
      ) {
        this.registerHooks(scroll, scroll.eventTypes.mousewheelStart, () => {
          this.fade()
        })

        this.registerHooks(scroll, scroll.eventTypes.mousewheelEnd, () => {
          this.fade(true)
        })
      }
    }

    if (interactive) {
      const { disableMouse, disableTouch } = this.scroll.options
      this.eventHandler = new EventHandler(this, { disableMouse, disableTouch })
      const eventHandlerHooks = this.eventHandler.hooks
      this.registerHooks(
        eventHandlerHooks,
        eventHandlerHooks.eventTypes.touchStart,
        this.startHandler
      )
      this.registerHooks(
        eventHandlerHooks,
        eventHandlerHooks.eventTypes.touchMove,
        this.moveHandler
      )
      this.registerHooks(
        eventHandlerHooks,
        eventHandlerHooks.eventTypes.touchEnd,
        this.endHandler
      )
    }
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  getKeysMap(direction: IndicatorDirection): KeysMap {
    if (direction === IndicatorDirection.Vertical) {
      return {
        hasScroll: 'hasVerticalScroll',
        size: 'height',
        wrapperSize: 'clientHeight',
        scrollerSize: 'scrollerHeight',
        maxScrollPos: 'maxScrollY',
        pos: 'y',
        point: 'pageX',
        translateProperty: 'translateY',
      }
    }
    return {
      hasScroll: 'hasHorizontalScroll',
      size: 'width',
      wrapperSize: 'clientWidth',
      scrollerSize: 'scrollerWidth',
      maxScrollPos: 'maxScrollX',
      pos: 'x',
      point: 'pageY',
      translateProperty: 'translateX',
    }
  }

  fade(visible?: boolean) {
    const time = visible ? 250 : 500
    const wrapper = this.wrapper
    wrapper.style[style.transitionDuration as any] = time + 'ms'
    wrapper.style.opacity = visible ? '1' : '0'
  }

  refresh() {
    const { hasScroll: hasScrollKey } = this.keysMap
    const scroll = this.scroll
    const { x, y } = scroll
    if (this.canScroll(scroll[hasScrollKey])) {
      let {
        wrapperSize: wrapperSizeKey,
        scrollerSize: scrollerSizeKey,
        maxScrollPos: maxScrollPosKey,
      } = this.keysMap

      this.scrollInfo = this.refreshScrollInfo(
        this.wrapper[wrapperSizeKey],
        scroll[scrollerSizeKey],
        scroll[maxScrollPosKey]
      )

      this.updatePosition({
        x,
        y,
      })
    }
  }

  private canScroll(hasScroll: boolean): boolean {
    if (hasScroll) {
      this.wrapper.style.display = 'block'
      return true
    }
    this.wrapper.style.display = 'none'
    return false
  }

  private refreshScrollInfo(
    wrapperSize: number,
    scrollerSize: number,
    maxScroll: number
  ): ScrollInfo {
    const indicatorSize = Math.max(
      Math.round(
        (wrapperSize * wrapperSize) / (scrollerSize || wrapperSize || 1)
      ),
      this.options.minSize
    )

    const maxIndicatorScrollPos = wrapperSize - indicatorSize
    // sizeRatio is negative
    let sizeRatio = maxIndicatorScrollPos / maxScroll

    return {
      indicatorSize,
      maxScrollPos: maxIndicatorScrollPos,
      minScrollPos: 0,
      sizeRatio,
    }
  }

  updatePosition(point: TranslaterPoint) {
    const { pos, size } = this._refreshPosAndSizeValue(point, this.scrollInfo)
    this.currentPos = pos
    this.refreshStyle(size, pos)
  }

  private _refreshPosAndSizeValue(
    point: TranslaterPoint,
    scrollInfo: ScrollInfo
  ): { pos: number; size: number } {
    const { pos: posKey } = this.keysMap
    const { sizeRatio, indicatorSize, maxScrollPos, minScrollPos } = scrollInfo
    const minSize = this.options.minSize

    let pos = Math.round(sizeRatio * point[posKey])
    let size
    if (pos < minScrollPos) {
      size = Math.max(indicatorSize + pos * 3, minSize)
      pos = minScrollPos
    } else if (pos > maxScrollPos) {
      size = Math.max(indicatorSize - (pos - maxScrollPos) * 3, minSize)
      pos = maxScrollPos + indicatorSize - size
    } else {
      size = indicatorSize
    }

    return {
      pos,
      size,
    }
  }

  private refreshStyle(size: number, pos: number) {
    const {
      translateProperty: translatePropertyKey,
      size: sizeKey,
    } = this.keysMap
    const translateZ = this.scroll.options.translateZ

    this.indicatorEl.style[sizeKey] = `${size}px`

    this.indicatorEl.style[
      style.transform as any
    ] = `${translatePropertyKey}(${pos}px)${translateZ}`
  }

  setTransitionTime(time: number = 0) {
    this.indicatorEl.style[style.transitionDuration as any] = time + 'ms'
  }

  setTransitionTimingFunction(easing: string) {
    this.indicatorEl.style[style.transitionTimingFunction as any] = easing
  }

  startHandler() {
    this.setTransitionTime()
    this.scroll.trigger('beforeScrollStart')
  }

  moveHandler(moved: boolean, delta: number) {
    if (!moved) {
      this.scroll.trigger('scrollStart')
    }

    const newScrollPos = this.newPos(this.currentPos, delta, this.scrollInfo)

    if (this.direction === IndicatorDirection.Vertical) {
      this.bscroll.scrollTo(this.bscroll.x, newScrollPos)
    } else {
      this.bscroll.scrollTo(newScrollPos, this.bscroll.y)
    }

    this.bscroll.trigger('scroll', {
      x: this.bscroll.x,
      y: this.bscroll.y,
    })
  }

  private newPos(
    curPos: number,
    delta: number,
    scrollInfo: ScrollInfo
  ): number {
    const { maxScrollPos, sizeRatio, minScrollPos } = scrollInfo
    let newPos = curPos + delta

    newPos = between(newPos, minScrollPos, maxScrollPos)

    return Math.round(newPos / sizeRatio)
  }

  endHandler(moved: boolean) {
    if (moved) {
      const { x, y } = this.scroll
      this.scroll.trigger('scrollEnd', {
        x,
        y,
      })
    }
  }

  destroy() {
    if (this.options.interactive) {
      this.eventHandler.destroy()
    }
    this.wrapper.parentNode!.removeChild(this.wrapper)

    this.hooksFn.forEach((item) => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }
}
