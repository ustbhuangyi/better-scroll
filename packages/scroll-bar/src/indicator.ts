import BScroll, { TranslaterPoint } from '@better-scroll/core'
import {
  style,
  EventEmitter,
  between,
  getNow,
  Probe,
  EventRegister,
} from '@better-scroll/shared-utils'
import EventHandler from './event-handler'

export const enum IndicatorDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

const enum ScrollTo {
  Up = -1,
  Down = 1,
}

export const enum OffsetType {
  Step = 'step',
  Point = 'clickedPoint',
}

export interface IndicatorOptions {
  wrapper: HTMLElement
  direction: IndicatorDirection
  fade: boolean
  interactive: boolean
  minSize: number
  isCustom: boolean
  scrollbarTrackClickable: boolean
  scrollbarTrackOffsetType: OffsetType
  scrollbarTrackOffsetTime: number
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
  domRect: 'top' | 'left'
}

interface ScrollInfo {
  maxScrollPos: number
  minScrollPos: number
  sizeRatio: number
  baseSize: number
}

export default class Indicator {
  wrapper: HTMLElement
  wrapperRect: DOMRect
  indicatorEl: HTMLElement
  direction: IndicatorDirection
  scrollInfo: ScrollInfo
  currentPos: number
  moved: boolean
  startTime: number
  keysMap: KeysMap
  eventHandler: EventHandler
  clickEventRegister: EventRegister
  hooksFn: [EventEmitter, string, Function][] = []

  constructor(public scroll: BScroll, public options: IndicatorOptions) {
    this.wrapper = options.wrapper
    this.direction = options.direction
    this.indicatorEl = this.wrapper.children[0] as HTMLElement
    this.keysMap = this.getKeysMap()

    this.handleFade()

    this.handleHooks()
  }

  private handleFade() {
    if (this.options.fade) {
      this.wrapper.style.opacity = '0'
    }
  }

  private handleHooks() {
    const { fade, interactive, scrollbarTrackClickable } = this.options
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
      (pos: { x: number; y: number }) => {
        const { hasScroll: hasScrollKey } = this.keysMap
        if (this.scroll[hasScrollKey]) {
          this.updatePosition(pos)
        }
      }
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
          this.fade(true)
        })

        this.registerHooks(scroll, scroll.eventTypes.mousewheelMove, () => {
          this.fade(true)
        })

        this.registerHooks(scroll, scroll.eventTypes.mousewheelEnd, () => {
          this.fade()
        })
      }
    }

    if (interactive) {
      const { disableMouse, disableTouch } = this.scroll.options
      this.eventHandler = new EventHandler(this, {
        disableMouse,
        disableTouch,
      })
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

    if (scrollbarTrackClickable) {
      this.bindClick()
    }
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  private bindClick() {
    const wrapper = this.wrapper
    this.clickEventRegister = new EventRegister(wrapper, [
      {
        name: 'click',
        handler: this.handleClick.bind(this),
      },
    ])
  }

  private handleClick(e: MouseEvent) {
    const newPos = this.calculateclickOffsetPos(e)
    let { x, y } = this.scroll
    x = this.direction === IndicatorDirection.Horizontal ? newPos : x
    y = this.direction === IndicatorDirection.Vertical ? newPos : y
    this.scroll.scrollTo(x, y, this.options.scrollbarTrackOffsetTime)
  }

  private calculateclickOffsetPos(e: MouseEvent) {
    const { point: poinKey, domRect: domRectKey } = this.keysMap
    const { scrollbarTrackOffsetType } = this.options
    const clickPointOffset = e[poinKey] - this.wrapperRect[domRectKey]
    const scrollToWhere =
      clickPointOffset < this.currentPos ? ScrollTo.Up : ScrollTo.Down
    let delta = 0
    let currentPos = this.currentPos
    if (scrollbarTrackOffsetType === OffsetType.Step) {
      delta = this.scrollInfo.baseSize * scrollToWhere
    } else {
      delta = 0
      currentPos = clickPointOffset
    }
    return this.newPos(currentPos, delta, this.scrollInfo)
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
        domRect: 'top',
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
      domRect: 'left',
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
    this.wrapperRect = this.wrapper.getBoundingClientRect()
    if (this.canScroll(scroll[hasScrollKey])) {
      let {
        wrapperSize: wrapperSizeKey,
        scrollerSize: scrollerSizeKey,
        maxScrollPos: maxScrollPosKey,
      } = this.keysMap

      this.scrollInfo = this.refreshScrollInfo(
        this.wrapper[wrapperSizeKey],
        scroll[scrollerSizeKey],
        scroll[maxScrollPosKey],
        this.indicatorEl[wrapperSizeKey]
      )

      this.updatePosition({
        x,
        y,
      })
    }
  }

  transitionTime(time: number = 0) {
    this.indicatorEl.style[style.transitionDuration as any] = time + 'ms'
  }

  transitionTimingFunction(easing: string) {
    this.indicatorEl.style[style.transitionTimingFunction as any] = easing
  }

  private canScroll(hasScroll: boolean): boolean {
    this.wrapper.style.display = hasScroll ? 'block' : 'none'
    return hasScroll
  }

  private refreshScrollInfo(
    wrapperSize: number,
    scrollerSize: number,
    maxScrollPos: number,
    indicatorElSize: number
  ): ScrollInfo {
    let baseSize = Math.max(
      Math.round(
        (wrapperSize * wrapperSize) / (scrollerSize || wrapperSize || 1)
      ),
      this.options.minSize
    )

    if (this.options.isCustom) {
      baseSize = indicatorElSize
    }

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

  startHandler() {
    this.moved = false
    this.startTime = getNow()
    this.transitionTime()
    this.scroll.scroller.hooks.trigger(
      this.scroll.scroller.hooks.eventTypes.beforeScrollStart
    )
  }

  moveHandler(delta: number) {
    if (!this.moved && !this.indicatorNotMoved(delta)) {
      this.moved = true
      this.scroll.scroller.hooks.trigger(
        this.scroll.scroller.hooks.eventTypes.scrollStart
      )
    }
    if (this.moved) {
      const newPos = this.newPos(this.currentPos, delta, this.scrollInfo)
      this.syncBScroll(newPos)
    }
  }

  endHandler() {
    if (this.moved) {
      const { x, y } = this.scroll
      this.scroll.scroller.hooks.trigger(
        this.scroll.scroller.hooks.eventTypes.scrollEnd,
        {
          x,
          y,
        }
      )
    }
  }

  private indicatorNotMoved(delta: number): boolean {
    const currentPos = this.currentPos
    const { maxScrollPos, minScrollPos } = this.scrollInfo
    const notMoved =
      (currentPos === minScrollPos && delta <= 0) ||
      (currentPos === maxScrollPos && delta >= 0)
    return notMoved
  }

  private syncBScroll(newPos: number) {
    const timestamp = getNow()
    const {
      x,
      y,
      options,
      scroller,
      maxScrollY,
      minScrollY,
      maxScrollX,
      minScrollX,
    } = this.scroll
    const { probeType, momentumLimitTime } = options
    const position = { x, y }
    if (this.direction === IndicatorDirection.Vertical) {
      position.y = between(newPos, maxScrollY, minScrollY)
    } else {
      position.x = between(newPos, maxScrollX, minScrollX)
    }
    scroller.translater.translate(position)

    // dispatch scroll in interval time
    if (timestamp - this.startTime > momentumLimitTime) {
      this.startTime = timestamp
      if (probeType === Probe.Throttle) {
        scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, position)
      }
    }

    // dispatch scroll all the time
    if (probeType > Probe.Throttle) {
      scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, position)
    }
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

  destroy() {
    const { interactive, scrollbarTrackClickable, isCustom } = this.options
    if (interactive) {
      this.eventHandler.destroy()
    }
    if (scrollbarTrackClickable) {
      this.clickEventRegister.destroy()
    }
    if (!isCustom) {
      this.wrapper.parentNode!.removeChild(this.wrapper)
    }

    this.hooksFn.forEach((item) => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }
}
