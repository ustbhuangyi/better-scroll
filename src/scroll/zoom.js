import { eventType, style, offsetToBody } from '../util/dom'
import { getDistance } from '../util/lang'

export function zoomMixin(BScroll) {
  BScroll.prototype._initZoom = function () {
    const {start = 1, min = 1, max = 4} = this.options.zoom
    this.scale = Math.min(Math.max(start, min), max)
    this.scrollerStyle[style.transformOrigin] = '0 0'
  }

  BScroll.prototype._zoomStart = function (e) {
    const firstFinger = e.touches[0]
    const secondFinger = e.touches[1]
    const deltaX = Math.abs(firstFinger.pageX - secondFinger.pageX)
    const deltaY = Math.abs(firstFinger.pageY - secondFinger.pageY)

    this.startDistance = getDistance(deltaX, deltaY)
    this.startScale = this.scale

    let {left, top} = offsetToBody(this.wrapper)

    this.originX = Math.abs(firstFinger.pageX + secondFinger.pageX) / 2 + left - this.x
    this.originY = Math.abs(firstFinger.pageY + secondFinger.pageY) / 2 + top - this.y

    this.trigger('zoomStart')
  }

  BScroll.prototype._zoom = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return
    }

    if (this.options.preventDefault) {
      e.preventDefault()
    }

    const firstFinger = e.touches[0]
    const secondFinger = e.touches[1]
    const deltaX = Math.abs(firstFinger.pageX - secondFinger.pageX)
    const deltaY = Math.abs(firstFinger.pageY - secondFinger.pageY)
    const distance = getDistance(deltaX, deltaY)
    let scale = distance / this.startDistance * this.startScale

    this.scaled = true

    const {min = 1, max = 4} = this.options.zoom

    if (scale < min) {
      scale = 0.5 * min * Math.pow(2.0, scale / min)
    } else if (scale > max) {
      scale = 2.0 * max * Math.pow(0.5, max / scale)
    }

    const lastScale = scale / this.startScale

    const x = this.originX - this.originX * lastScale + this.startX
    const y = this.originY - this.originY * lastScale + this.startY

    this.scale = scale

    this.scrollTo(x, y, 0)
  }

  BScroll.prototype._zoomEnd = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return
    }

    if (this.options.preventDefault) {
      e.preventDefault()
    }

    this.isInTransition = false
    this.initiated = 0

    const {min = 1, max = 4} = this.options.zoom

    if (this.scale > max) {
      this.scale = max
    } else if (this.scale < min) {
      this.scale = min
    }

    this.refresh()

    const lastScale = this.scale / this.startScale

    let newX = this.originX - this.originX * lastScale + this.startX
    let newY = this.originY - this.originY * lastScale + this.startY

    if (newX > 0) {
      newX = 0
    } else if (newX < this.maxScrollX) {
      newX = this.maxScrollX
    }

    if (newY > 0) {
      newY = 0
    } else if (newY < this.maxScrollY) {
      newY = this.maxScrollY
    }

    if (this.x !== newX || this.y !== newY) {
      this.scrollTo(newX, newY, this.options.bounceTime)
    }

    this.scaled = false

    this.trigger('zoomEnd')
  }
}
