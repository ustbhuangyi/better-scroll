import { isUndef } from '../util'

export default class Base {
  element: HTMLElement
  style: CSSStyleDeclaration
  x: number
  y: number
  scale: number
  lastScale: number
  constructor(element: HTMLElement) {
    this.element = element
    // cache for better performance
    this.style = element.style

    this.setUpProps()
  }

  setScale(scale: number) {
    this.lastScale = isUndef(this.scale) ? scale : this.scale
    this.scale = scale
  }

  private setUpProps() {
    this.x = 0
    this.y = 0
    this.setScale(1)
  }

  updateProps(x: number, y: number, scale: number) {
    this.x = x
    this.y = y

    this.setScale(scale)
  }
}
