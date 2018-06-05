import { eventType, style, offsetToBody } from '../util/dom'
import { getDistance } from '../util/lang'

export function zoomMixin(BScroll) {
  BScroll.prototype._initZoom = function () {
    const {start = 1, min = 1, max = 4} = this.options.zoom
    this.scale = Math.min(Math.max(start, min), max)
    this.setScale(this.scale)
    this.scrollerStyle[style.transformOrigin] = '0 0'
  }

  BScroll.prototype._zoomTo = function (scale, originX, originY, startScale) {
    this.scaled = true

    const lastScale = scale / (startScale || this.scale)
    this.setScale(scale)

    this.refresh()

    let newX = Math.round(this.startX - (originX - this.relativeX) * (lastScale - 1))
    let newY = Math.round(this.startY - (originY - this.relativeY) * (lastScale - 1))

    if (newX > this.minScrollX) {
      newX = this.minScrollX
    } else if (newX < this.maxScrollX) {
      newX = this.maxScrollX
    }

    if (newY > this.minScrollY) {
      newY = this.minScrollY
    } else if (newY < this.maxScrollY) {
      newY = this.maxScrollY
    }

    if (this.x !== newX || this.y !== newY) {
      this.scrollTo(newX, newY, this.options.bounceTime)
    }

    this.scaled = false
  }

  BScroll.prototype.zoomTo = function (scale, x, y) {
    let {left, top} = offsetToBody(this.wrapper)
    let originX = x + left - this.x
    let originY = y + top - this.y
    this._zoomTo(scale, originX, originY)
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

    if (this.options.stopPropagation) {
      e.stopPropagation()
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

    const x = this.startX - (this.originX - this.relativeX) * (lastScale - 1)
    const y = this.startY - (this.originY - this.relativeY) * (lastScale - 1)

    this.setScale(scale)

    this.scrollTo(x, y, 0)
  }

  BScroll.prototype._zoomEnd = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return
    }

    if (this.options.preventDefault) {
      e.preventDefault()
    }

    if (this.options.stopPropagation) {
      e.stopPropagation()
    }

    this.isInTransition = false
    this.isAnimating = false
    this.initiated = 0

    const {min = 1, max = 4} = this.options.zoom

    const scale = this.scale > max ? max : this.scale < min ? min : this.scale

    this._zoomTo(scale, this.originX, this.originY, this.startScale)

    this.trigger('zoomEnd')
  }
}
