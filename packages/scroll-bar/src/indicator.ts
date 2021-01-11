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
  baseSize: number
}

export default class Indicator {
  wrapper: HTMLElement
  indicatorEl: HTMLElement
  direction: IndicatorDirection
  scrollInfo: ScrollInfo
  currentPos: number
  moved: boolean
  keysMap: KeysMap
  eventHandler: EventHandler
  hooksFn: [EventEmitter, string, Function][] = []

  constructor(public scroll: BScroll, public options: IndicatorOption) {
    this.wrapper = options.wrapper
    this.direction = options.direction
    this.indicatorEl = this.wrapper.children[0] as HTMLElement
    this.keysMap = this.getKeysMap()

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
      this.transitionTime
    )

    this.registerHooks(
      animaterHooks,
      animaterHooks.eventTypes.timeFunction,
      this.transitionTimingFunction
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

  getKeysMap(): KeysMap {
    if (this.direction === IndicatorDirection.Vertical) {
      return {
        hasScroll: 'hasVerticalScroll',
        size: 'height',
        wrapperSize: 'clientHeight',
        scrollerSize: 'scrollerHeight',
        maxScrollPos: 'maxScrollY',
        pos: 'y',
        point: 'pageY',
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
      point: 'pageX',
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
    this.wrapper.style.display = hasScroll ? 'block' : 'none'
    return hasScroll
  }

  private refreshScrollInfo(
    wrapperSize: number,
    scrollerSize: number,
    maxScrollPos: number
  ): ScrollInfo {
    const baseSize = Math.max(
      Math.round(
        (wrapperSize * wrapperSize) / (scrollerSize || wrapperSize || 1)
      ),
      this.options.minSize
    )

    const maxIndicatorScrollPos = wrapperSize - baseSize
    // sizeRatio is negative
    let sizeRatio = maxIndicatorScrollPos / maxScrollPos

    return {
      baseSize,
      maxScrollPos: maxIndicatorScrollPos,
      minScrollPos: 0,
      sizeRatio,
    }
  }

  updatePosition(point: TranslaterPoint) {
    const { pos, size } = this.caculatePosAndSize(point, this.scrollInfo)
    this.refreshStyle(size, pos)
    this.currentPos = pos
  }

  private caculatePosAndSize(
    point: TranslaterPoint,
    scrollInfo: ScrollInfo
  ): { pos: number; size: number } {
    const { pos: posKey } = this.keysMap
    const { sizeRatio, baseSize, maxScrollPos, minScrollPos } = scrollInfo
    const minSize = this.options.minSize

    let pos = Math.round(sizeRatio * point[posKey])
    let size
    // when out of boundary, slow down size reduction
    if (pos < minScrollPos) {
      size = Math.max(baseSize + pos * 3, minSize)
      pos = minScrollPos
    } else if (pos > maxScrollPos) {
      size = Math.max(baseSize - (pos - maxScrollPos) * 3, minSize)
      pos = maxScrollPos + baseSize - size
    } else {
      size = baseSize
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

  transitionTime(time: number = 0) {
    this.indicatorEl.style[style.transitionDuration as any] = time + 'ms'
  }

  transitionTimingFunction(easing: string) {
    this.indicatorEl.style[style.transitionTimingFunction as any] = easing
  }

  startHandler() {
    this.transitionTime()
    this.scroll.trigger(this.scroll.eventTypes.beforeScrollStart)
  }

  moveHandler(delta: number) {
    if (!this.moved) {
      this.scroll.trigger('scrollStart')
    }
    const newPos = this.newPos(this.currentPos, delta, this.scrollInfo)
    this.syncBScroll(newPos)
  }

  private syncBScroll(newPos: number) {
    const scroll = this.scroll
    const position = {
      x: this.direction === IndicatorDirection.Vertical ? scroll.x : newPos,
      y: this.direction === IndicatorDirection.Horizontal ? scroll.y : newPos,
    }
    scroll.scroller.translater.translate(position)
    scroll.trigger(scroll.eventTypes.scroll, position)
  }

  private newPos(
    currentPos: number,
    delta: number,
    scrollInfo: ScrollInfo
  ): number {
    const { maxScrollPos, sizeRatio, minScrollPos } = scrollInfo
    let newPos = currentPos + delta

    newPos = between(newPos, minScrollPos, maxScrollPos)

    return Math.round(newPos / sizeRatio)
  }

  endHandler(moved: boolean) {
    if (moved) {
      const { x, y } = this.scroll
      this.scroll.trigger(this.scroll.eventTypes.scrollEnd, {
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
