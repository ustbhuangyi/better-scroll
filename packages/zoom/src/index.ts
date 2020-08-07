import BScroll, { Behavior, TranslaterPoint } from '@better-scroll/core'
import propertiesConfig from './propertiesConfig'
import {
  getDistance,
  between,
  offsetToBody,
  getRect,
  DOMRect,
  style,
  EventEmitter,
  extend
} from '@better-scroll/shared-utils'

export interface ZoomConfig {
  start: number
  min: number
  max: number
  initialOrigin: [OriginX, OriginY]
  minimalZoomDistance: number
  bounceTime: number
}

type OriginX = number | 'left' | 'right' | 'center'
type OriginY = number | 'top' | 'bottom' | 'center'

declare module '@better-scroll/core' {
  interface CustomOptions {
    zoom?: Partial<ZoomConfig>
  }
  interface CustomAPI {
    zoom: {
      zoomTo: Zoom['zoomTo']
    }
  }
}

interface Point {
  x: number
  y: number
  scale: number
}

interface TransformFormula {
  left(): number
  top(): number
  right(): number
  bottom(): number
  center(index: number): number
}

const TWO_FINGERS = 2
export default class Zoom {
  static pluginName = 'zoom'
  origin: Point
  scale: number = 1
  zoomOpt: ZoomConfig
  numberOfFingers: number
  private zoomed: boolean
  private startDistance: number
  private startScale: number
  private wrapper: HTMLElement
  private scaleElement: HTMLElement
  private scaleElementInitSize: DOMRect
  private prevScale: number = 1
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.hooksFn = []
    this.init()
  }

  init() {
    this.handleBScroll()

    this.handleOptions()

    this.handleHooks()

    this.tryInitialZoomTo(this.zoomOpt)
  }

  private handleBScroll() {
    this.scroll.proxy(propertiesConfig)
    this.scroll.registerType([
      'beforeZoomStart',
      'zoomStart',
      'zooming',
      'zoomEnd'
    ])
  }

  private handleOptions() {
    const userOptions =
      this.scroll.options.zoom === true ? {} : this.scroll.options.zoom
    const defaultOptions: ZoomConfig = {
      start: 1,
      min: 1,
      max: 4,
      initialOrigin: [0, 0],
      minimalZoomDistance: 5,
      bounceTime: 800 // ms
    }
    this.zoomOpt = extend(defaultOptions, userOptions)
  }

  private handleHooks() {
    const scrollerIns = this.scroll.scroller
    this.wrapper = this.scroll.scroller.wrapper
    this.scaleElement = this.scroll.scroller.content
    this.scaleElement.style[style.transformOrigin as any] = '0 0'
    this.scaleElementInitSize = getRect(this.scaleElement)
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY

    // enlarge boundary
    this.registorHooks(
      scrollBehaviorX.hooks,
      scrollBehaviorX.hooks.eventTypes.beforeComputeBoundary,
      () => {
        scrollBehaviorX.contentSize = Math.floor(
          this.scaleElementInitSize.width * this.scale
        )
      }
    )
    this.registorHooks(
      scrollBehaviorY.hooks,
      scrollBehaviorY.hooks.eventTypes.beforeComputeBoundary,
      () => {
        scrollBehaviorY.contentSize = Math.floor(
          this.scaleElementInitSize.height * this.scale
        )
      }
    )

    // touch event
    this.registorHooks(
      scrollerIns.actions.hooks,
      scrollerIns.actions.hooks.eventTypes.start,
      (e: TouchEvent) => {
        const numberOfFingers = (e.touches && e.touches.length) || 0
        this.fingersOperation(numberOfFingers)
        if (numberOfFingers === TWO_FINGERS) {
          this.zoomStart(e)
        }
      }
    )
    this.registorHooks(
      scrollerIns.actions.hooks,
      scrollerIns.actions.hooks.eventTypes.beforeMove,
      (e: TouchEvent) => {
        const numberOfFingers = (e.touches && e.touches.length) || 0
        this.fingersOperation(numberOfFingers)
        if (numberOfFingers === TWO_FINGERS) {
          this.zoom(e)
          return true
        }
      }
    )
    this.registorHooks(
      scrollerIns.actions.hooks,
      scrollerIns.actions.hooks.eventTypes.beforeEnd,
      (e: TouchEvent) => {
        const numberOfFingers = this.fingersOperation()
        if (numberOfFingers === TWO_FINGERS) {
          this.zoomEnd()
          return true
        }
      }
    )

    this.registorHooks(
      scrollerIns.translater.hooks,
      scrollerIns.translater.hooks.eventTypes.beforeTranslate,
      (transformStyle: string[], point: TranslaterPoint) => {
        const scale = point.scale ? point.scale : this.prevScale
        this.prevScale = scale
        transformStyle.push(`scale(${scale})`)
      }
    )

    this.registorHooks(
      scrollerIns.hooks,
      scrollerIns.hooks.eventTypes.scrollEnd,
      () => {
        if (this.fingersOperation() === TWO_FINGERS) {
          this.scroll.trigger(this.scroll.eventTypes.zoomEnd)
        }
      }
    )

    this.registorHooks(this.scroll.hooks, 'destroy', this.destroy)
  }

  private tryInitialZoomTo(options: ZoomConfig) {
    const { start, initialOrigin } = options
    this.zoomTo(start, initialOrigin[0], initialOrigin[1], 0)
  }

  // getter or setter operation
  fingersOperation(amounts?: number): number | void {
    if (typeof amounts === 'number') {
      this.numberOfFingers = amounts
    } else {
      return this.numberOfFingers
    }
  }

  zoomTo(scale: number, x: OriginX, y: OriginY, time?: number) {
    // TODO full hooks logic, like zoomStart, zooming, zoomEnd
    ;[x, y] = this.transformOrigin([x, y])
    // suppose you are zooming by two fingers
    this.fingersOperation(2)
    this._zoomTo(scale, this.scale, { x, y, scale: this.scale }, time)
  }

  transformOrigin(rawOrigin: [OriginX, OriginY]) {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const transformFormula: TransformFormula = {
      left() {
        return 0
      },
      top() {
        return 0
      },
      right() {
        return scrollBehaviorX.wrapperSize
      },
      bottom() {
        return scrollBehaviorY.wrapperSize
      },
      center(index: number) {
        const baseSize =
          index === 0
            ? scrollBehaviorX.wrapperSize
            : scrollBehaviorY.wrapperSize
        return baseSize / 2
      }
    }
    return rawOrigin.map((raw, index) => {
      const origin = raw
      if (typeof origin === 'number') return origin
      return transformFormula[origin](index)
    })
  }

  zoomStart(e: TouchEvent) {
    const firstFinger = e.touches[0]
    const secondFinger = e.touches[1]
    this.startDistance = this.getFingerDistance(e)
    this.startScale = this.scale

    let { left, top } = offsetToBody(this.wrapper)

    this.origin = {
      x:
        Math.abs(firstFinger.pageX + secondFinger.pageX) / 2 +
        left -
        this.scroll.x,
      y:
        Math.abs(firstFinger.pageY + secondFinger.pageY) / 2 +
        top -
        this.scroll.y,
      scale: this.startScale
    }
    this.scroll.trigger(this.scroll.eventTypes.beforeZoomStart)
  }

  zoom(e: TouchEvent) {
    const currentDistance = this.getFingerDistance(e)
    // at least minimalZoomDistance pixels for the zoom to initiate
    if (
      !this.zoomed &&
      Math.abs(currentDistance - this.startDistance) <
        this.zoomOpt.minimalZoomDistance
    ) {
      return
    }
    // when out of boundary , perform a damping algorithm
    const endScale = this.dampingScale(
      (currentDistance / this.startDistance) * this.startScale
    )
    const ratio = endScale / this.startScale
    this.setScale(endScale)

    if (!this.zoomed) {
      this.zoomed = true
      this.scroll.trigger(this.scroll.eventTypes.zoomStart)
    }

    const scrollerIns = this.scroll.scroller
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY
    const x = this.getNewPos(this.origin.x, ratio, scrollBehaviorX)
    const y = this.getNewPos(this.origin.y, ratio, scrollBehaviorY)

    this.scroll.trigger(this.scroll.eventTypes.zooming, {
      scale: this.scale,
      bounceTime: 0
    })
    scrollerIns.translater.translate({ x, y, scale: endScale })
  }

  private getFingerDistance(e: TouchEvent): number {
    const firstFinger = e.touches[0]
    const secondFinger = e.touches[1]
    const deltaX = Math.abs(firstFinger.pageX - secondFinger.pageX)
    const deltaY = Math.abs(firstFinger.pageY - secondFinger.pageY)

    return getDistance(deltaX, deltaY)
  }
  zoomEnd() {
    if (!this.zoomed) return
    const { min, max } = this.zoomOpt
    const needRebound = this.scale !== between(this.scale, min, max)
    // if out of boundary, do rebound!
    if (needRebound) {
      this._zoomTo(this.scale, this.scale, this.origin)
      return
    }

    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    // enlarge boundaries manually when zoom is end
    this.resetBoundaries([scrollBehaviorX, scrollBehaviorY])
    this.scroll.trigger(this.scroll.eventTypes.zoomEnd)
  }

  destroy() {
    this.hooksFn.forEach(item => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }

  private setScale(scale: number) {
    this.scale = scale
  }

  private _zoomTo(
    toScale: number,
    fromScale: number,
    origin: Point,
    time: number = this.zoomOpt.bounceTime
  ) {
    const { min, max } = this.zoomOpt
    toScale = between(toScale, min, max)
    const scaleChanged = this.scale !== toScale
    const ratio = toScale / origin.scale
    this.setScale(toScale)

    const scrollerIns = this.scroll.scroller
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY

    this.resetBoundaries([scrollBehaviorX, scrollBehaviorY])
    // position is restrained in boundary
    const newX = this.getNewPos(origin.x, ratio, scrollBehaviorX, true)
    const newY = this.getNewPos(origin.y, ratio, scrollBehaviorY, true)

    if (
      scrollBehaviorX.currentPos !== Math.round(newX) ||
      scrollBehaviorY.currentPos !== Math.round(newY) ||
      (toScale !== fromScale && scaleChanged)
    ) {
      this.scroll.trigger(this.scroll.eventTypes.zooming, {
        scale: toScale,
        bounceTime: time
      })

      scrollerIns.scrollTo(newX, newY, time, undefined, {
        start: {
          scale: fromScale
        },
        end: {
          scale: toScale
        }
      })
    }
  }
  private resetBoundaries(scrollBehaviorPairs: [Behavior, Behavior]) {
    scrollBehaviorPairs.forEach(behavior => behavior.computeBoundary())
  }

  private getNewPos(
    origin: number,
    lastScale: number,
    scrollBehavior: Behavior,
    shouldInBoundary?: boolean
  ) {
    let newPos = origin - origin * lastScale + scrollBehavior.startPos
    if (shouldInBoundary) {
      newPos = between(
        newPos,
        scrollBehavior.maxScrollPos,
        scrollBehavior.minScrollPos
      )
    }
    // maxScrollPos or minScrollPos maybe a negative or positive digital
    return newPos > 0 ? Math.floor(newPos) : Math.ceil(newPos)
  }

  private dampingScale(scale: number) {
    const { min, max } = this.zoomOpt

    if (scale < min) {
      scale = 0.5 * min * Math.pow(2.0, scale / min)
    } else if (scale > max) {
      scale = 2.0 * max * Math.pow(0.5, max / scale)
    }
    return scale
  }

  private registorHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }
}
