import EventEmitter from '../base/EventEmitter'
import { Position, Transform } from '../translater'
import { EaseFn, isUndef } from '../util'

export default class Base {
  style: CSSStyleDeclaration
  hooks: EventEmitter
  timer: number
  pending: boolean
  minScrollX: number
  maxScrollX: number
  minScrollY: number
  maxScrollY: number
  hasHorizontalScroll: boolean
  hasVerticalScroll: boolean
  forceStopped?: boolean
  _reflow?: number
  [key: string]: any

  constructor(
    public element: HTMLElement,
    public translater: Position | Transform,
    public options: {
      bounceTime: number
      probeType: number
    }
  ) {
    this.hooks = new EventEmitter(['scroll', 'scrollEnd'])
    this.style = element.style
  }

  refresh(boundaryInfo: {
    minScrollX: number
    maxScrollX: number
    minScrollY: number
    maxScrollY: number
    hasHorizontalScroll: boolean
    hasVerticalScroll: boolean
    [key: string]: number | boolean
  }) {
    Object.keys(boundaryInfo).forEach(key => {
      this[key] = boundaryInfo[key]
    })
  }

  translate(x: number, y: number, scale: number) {
    this.translater.updatePosition(x, y, scale)
  }

  _resetPosition(time: number, easing: string | EaseFn) {
    let x = this.translater.x
    let roundX = Math.round(x)
    if (!this.hasHorizontalScroll || roundX > this.minScrollX) {
      x = this.minScrollX
    } else if (roundX < this.maxScrollX) {
      x = this.maxScrollX
    }

    let y = this.translater.y
    let roundY = Math.round(y)
    if (!this.hasVerticalScroll || roundY > this.minScrollY) {
      y = this.minScrollY
    } else if (roundY < this.maxScrollY) {
      y = this.maxScrollY
    }

    // in boundary
    if (x === this.translater.x && y === this.translater.y) {
      return false
    }

    // out of boundary
    this.scrollTo(x, y, time, easing)
    return true
  }

  scrollTo(x: number, y: number, time: number, easing: string | EaseFn) {
    throw new Error('Abstract: should be overriden')
  }

  protected callHooks(
    eventType: string,
    pos?: {
      x: number
      y: number
    }
  ) {
    pos = isUndef(pos)
      ? {
          x: this.translater.x,
          y: this.translater.y
        }
      : pos

    this.hooks.trigger(eventType, pos)
  }
}
