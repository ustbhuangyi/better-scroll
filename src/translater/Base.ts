import { isUndef } from '../util'

export default abstract class Base {
  element: HTMLElement
  style: CSSStyleDeclaration
  constructor(element: HTMLElement) {
    this.element = element
    // cache for better performance
    this.style = element.style
  }

  abstract getComputedPosition(): {
    x: number
    y: number
  }

  abstract translate(x: number, y: number): void
}
