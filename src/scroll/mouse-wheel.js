import { addEvent, removeEvent } from '../util/dom'

export function mouseWheelMixin(BScroll) {
  BScroll.prototype._initMouseWheel = function () {
    this._handleMouseWheelEvent(addEvent)

    this.on('destroy', () => {
      clearTimeout(this.mouseWheelTimer)
      this._handleMouseWheelEvent(removeEvent)
    })

    this.firstWheelOpreation = true
  }

  BScroll.prototype._handleMouseWheelEvent = function (eventOperation) {
    eventOperation(this.wrapper, 'wheel', this)
    eventOperation(this.wrapper, 'mousewheel', this)
    eventOperation(this.wrapper, 'DOMMouseScroll', this)
  }

  BScroll.prototype._onMouseWheel = function (e) {
    if (!this.enabled) {
      return
    }
    e.preventDefault()

    if (this.firstWheelOpreation) {
      this.trigger('scrollStart')
    }
    this.firstWheelOpreation = false

    clearTimeout(this.mouseWheelTimer)
    this.mouseWheelTimer = setTimeout(() => {
      if (!this.options.snap) {
        this.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        })
      }
      this.firstWheelOpreation = true
    }, 400)

    const {speed = 20, invert = false} = this.options.mouseWheel
    let wheelDeltaX
    let wheelDeltaY

    switch (true) {
      case 'deltaX' in e:
        if (e.deltaMode === 1) {
          wheelDeltaX = -e.deltaX * speed
          wheelDeltaY = -e.deltaY * speed
        } else {
          wheelDeltaX = -e.deltaX
          wheelDeltaY = -e.deltaY
        }
        break
      case 'wheelDeltaX' in e:
        wheelDeltaX = e.wheelDeltaX / 120 * speed
        wheelDeltaY = e.wheelDeltaY / 120 * speed
        break
      case 'wheelDelta' in e:
        wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * speed
        break
      case 'detail' in e:
        wheelDeltaX = wheelDeltaY = -e.detail / 3 * speed
        break
      default:
        return
    }

    let direction = invert ? -1 : 1
    wheelDeltaX *= direction
    wheelDeltaY *= direction

    if (!this.hasVerticalScroll) {
      wheelDeltaX = wheelDeltaY
      wheelDeltaY = 0
    }

    let newX
    let newY
    if (this.options.snap) {
      newX = this.currentPage.pageX
      newY = this.currentPage.pageY

      if (wheelDeltaX > 0) {
        newX--
      } else if (wheelDeltaX < 0) {
        newX++
      }

      if (wheelDeltaY > 0) {
        newY--
      } else if (wheelDeltaY < 0) {
        newY++
      }

      this._goToPage(newX, newY)
      return
    }

    newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0)
    newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0)

    this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0
    this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0

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

    this.scrollTo(newX, newY)
    this.trigger('scroll', {
      x: this.x,
      y: this.y
    })
  }
}