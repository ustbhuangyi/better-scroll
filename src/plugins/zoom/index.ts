import BScroll from '../../index'
import propertiesConfig from './propertiesConfig'
import { getDistance, isUndef } from '../../util/lang'
import { offsetToBody, getRect, DOMRect } from '../../util/dom'
import { zoomConfig } from '../../Options'
import { style } from '../../util'

import Behavior from '../../scroller/Behavior'

interface Point {
  x: number
  y: number
}

export default class Zoom {
  static pluginName = 'zoom'
  origin: Point
  scale = 1
  private zoomOpt: Partial<zoomConfig>
  private startDistance: number
  private startScale: number
  private wrapper: HTMLElement
  private scaleElement: HTMLElement
  private wrapperSize: DOMRect
  private scaleElementInitSize: DOMRect
  private zooming: boolean
  constructor(public scroll: BScroll) {
    this.scroll.proxy(propertiesConfig)
    this.zoomOpt = this.scroll.options.zoom as Partial<zoomConfig>
    this.init()
  }
  init() {
    const scrollerIns = this.scroll.scroller
    this.wrapper = this.scroll.scroller.wrapper
    this.scaleElement = this.scroll.scroller.element
    this.scaleElement.style[style.transformOrigin as any] = '0 0'
    this.wrapperSize = getRect(this.wrapper)
    this.scaleElementInitSize = getRect(this.scaleElement)
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
    this._zoomTo(this.scale, this.origin, this.startScale)
    this.zooming = false
  }
  private _zoomTo(scale: number, origin: Point, startScale: number) {
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
      scrollBehaviorY.currentPos !== Math.round(newY)
    ) {
      scrollerIns.scrollTo(
        newX,
        newY,
        this.scroll.options.bounceTime,
        undefined,
        {
          start: {
            scale: lastScale
          },
          end: {
            scale: this.scale
          }
        }
      )
    }
  }
  private resetBoundaries(
    scale: number,
    scrollBehavior: Behavior,
    direction: 'x' | 'y',
    extendValue?: number
  ) {
    let min
    let max
    let hasScroll
    if (scale < 1) {
      min = 0
      max = 0
      hasScroll = false
    } else {
      min = 0
      if (direction === 'x') {
        max = -(
          this.scaleElementInitSize.width * scale -
          this.wrapperSize.width
        )
      } else {
        max = -(
          this.scaleElementInitSize.height * scale -
          this.wrapperSize.height
        )
      }
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
