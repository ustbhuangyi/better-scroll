import BScroll from '../../index'
import EventEmitter from '../../base/EventEmitter'
import propertiesConfig from './propertiesConfig'
import { getDistance, isUndef } from '../../util/lang'
import { offsetToBody, getRect, DOMRect } from '../../util/dom'
import { style } from '../../util'
import { staticImplements, PluginCtor } from '../type'
import { TranslaterPoint } from '../../translater'
import Behavior from '../../scroller/Behavior'

type zoomOptions = Partial<ZoomConfig> | boolean | undefined
interface ZoomConfig {
  start: number
  min: number
  max: number
}

declare module '../../Options' {
  interface Options {
    zoom?: ZoomConfig
  }
}

interface Point {
  x: number
  y: number
}

interface ScrollBoundary {
  x: [number, number]
  y: [number, number]
}

@staticImplements<PluginCtor>()
export default class Zoom {
  static pluginName = 'zoom'
  origin: Point
  scale = 1
  hooks: EventEmitter
  private zoomOpt: Partial<ZoomConfig>
  private startDistance: number
  private startScale: number
  private wrapper: HTMLElement
  private scaleElement: HTMLElement
  private scaleElementInitSize: DOMRect
  private initScrollBoundary: ScrollBoundary
  private zooming: boolean
  private lastTransformScale: number
  constructor(public scroll: BScroll) {
    this.hooks = new EventEmitter(['zoomStart', 'zoomEnd'])
    this.scroll.proxy(propertiesConfig)
    this.scroll.registerType(['zoomStart', 'zoomEnd'])
    this.zoomOpt = this.scroll.options.zoom as Partial<ZoomConfig>
    this.init()
  }
  init() {
    const scrollerIns = this.scroll.scroller
    this.wrapper = this.scroll.scroller.wrapper
    this.scaleElement = this.scroll.scroller.content
    this.scaleElement.style[style.transformOrigin as any] = '0 0'
    this.scaleElementInitSize = getRect(this.scaleElement)
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY
    this.initScrollBoundary = {
      x: [scrollBehaviorX.minScrollPos, scrollBehaviorX.maxScrollPos],
      y: [scrollBehaviorY.minScrollPos, scrollBehaviorY.maxScrollPos]
    }
    scrollerIns.hooks.on('beforeStart', (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        this.zoomStart(e)
      }
    })
    scrollerIns.hooks.on('beforeMove', (e: TouchEvent) => {
      if (!e.touches || e.touches.length < 2) {
        return false
      }
      this.zoom(e)
      return true
    })
    scrollerIns.hooks.on('beforeEnd', (e: TouchEvent) => {
      if (!this.zooming) {
        return false
      }
      this.zoomEnd()
      return true
    })
    scrollerIns.translater.hooks.on(
      'beforeTranslate',
      (transformStyle: string[], point: TranslaterPoint) => {
        const scale = point.scale ? point.scale : this.lastTransformScale
        this.lastTransformScale = scale
        transformStyle.push(`scale(${scale})`)
      }
    )
  }
  zoomTo(scale: number, x: number, y: number) {
    let { left, top } = offsetToBody(this.wrapper)
    let originX = x + left - this.scroll.x
    let originY = y + top - this.scroll.y
    this.zooming = true
    this._zoomTo(scale, { x: originX, y: originY }, this.scale)
    this.zooming = false
  }
  private zoomStart(e: TouchEvent) {
    this.zooming = true
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
        this.scroll.y
    }
    this.scroll.trigger(this.scroll.eventTypes.zoomStart)
  }
  private zoom(e: TouchEvent) {
    const scrollerIns = this.scroll.scroller
    const currentDistance = this.getFingerDistance(e)
    let currentScale = (currentDistance / this.startDistance) * this.startScale
    this.scale = this.scaleCure(currentScale)
    const lastScale = this.scale / this.startScale
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY
    const x = this.getNewPos(this.origin.x, lastScale, scrollBehaviorX)
    const y = this.getNewPos(this.origin.y, lastScale, scrollBehaviorY)
    this.resetBoundaries(this.scale, scrollBehaviorX, 'x', x)
    this.resetBoundaries(this.scale, scrollBehaviorY, 'y', y)
    scrollerIns.scrollTo(x, y, 0, undefined, {
      start: {
        scale: this.scale / this.startScale
      },
      end: {
        scale: this.scale
      }
    })
  }
  private getFingerDistance(e: TouchEvent): number {
    const firstFinger = e.touches[0]
    const secondFinger = e.touches[1]
    const deltaX = Math.abs(firstFinger.pageX - secondFinger.pageX)
    const deltaY = Math.abs(firstFinger.pageY - secondFinger.pageY)

    return getDistance(deltaX, deltaY)
  }
  private zoomEnd() {
    this._zoomTo(this.scale, this.origin, this.startScale || this.scale)
    this.zooming = false
    this.scroll.trigger(this.scroll.eventTypes.zoomEnd)
  }
  private _zoomTo(scale: number, origin: Point, startScale: number) {
    const oldScale = this.scale
    this.scale = this.fixInScaleLimit(scale)
    const lastScale = this.scale / startScale
    const scrollerIns = this.scroll.scroller
    const scrollBehaviorX = scrollerIns.scrollBehaviorX
    const scrollBehaviorY = scrollerIns.scrollBehaviorY

    this.resetBoundaries(this.scale, scrollBehaviorX, 'x')
    this.resetBoundaries(this.scale, scrollBehaviorY, 'y')
    // resetPosition
    const newX = this.getNewPos(origin.x, lastScale, scrollBehaviorX, true)
    const newY = this.getNewPos(origin.y, lastScale, scrollBehaviorY, true)
    if (
      scrollBehaviorX.currentPos !== Math.round(newX) ||
      scrollBehaviorY.currentPos !== Math.round(newY) ||
      this.scale !== oldScale
    ) {
      scrollerIns.scrollTo(
        newX,
        newY,
        this.scroll.options.bounceTime,
        undefined,
        {
          start: {
            scale: oldScale
          },
          end: {
            scale: this.scale
          }
        },
        true
      )
    }
  }
  private resetBoundaries(
    scale: number,
    scrollBehavior: Behavior,
    direction: 'x' | 'y',
    extendValue?: number
  ) {
    let min = this.initScrollBoundary[direction][0]
    let max = this.initScrollBoundary[direction][1]
    let hasScroll = false
    if (scale > 1) {
      let sideName = direction === 'x' ? 'width' : 'height'
      max =
        -this.scaleElementInitSize[sideName] * (scale - 1) -
        this.initScrollBoundary[direction][1]
      hasScroll = true
    }
    if (!isUndef(extendValue)) {
      max = Math.min(<number>extendValue, max)
      min = Math.max(<number>extendValue, min) // max & min & curValue is negative value
      hasScroll = !!(min || max)
    }

    scrollBehavior.minScrollPos = min
    scrollBehavior.maxScrollPos = max
    scrollBehavior.hasScroll = hasScroll
  }
  private getNewPos(
    origin: number,
    lastScale: number,
    scrollBehavior: Behavior,
    fixInBound?: boolean
  ) {
    let newPos = origin - origin * lastScale + scrollBehavior.startPos
    if (!fixInBound) {
      return newPos
    }
    if (newPos > 0) {
      newPos = 0
    } else if (newPos < scrollBehavior.maxScrollPos) {
      newPos = scrollBehavior.maxScrollPos
    }
    return newPos
  }

  private scaleCure(scale: number) {
    const { min = 1, max = 4 } = this.zoomOpt

    if (scale < min) {
      scale = 0.5 * min * Math.pow(2.0, scale / min)
    } else if (scale > max) {
      scale = 2.0 * max * Math.pow(0.5, max / scale)
    }
    return scale
  }
  private fixInScaleLimit(scale: number) {
    const { min = 1, max = 4 } = this.zoomOpt
    if (scale > max) {
      scale = max
    } else if (scale < min) {
      scale = min
    }
    return scale
  }
}
