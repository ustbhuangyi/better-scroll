import { style } from '../util'

interface Options {
  translateZ: string
}
export default class Transform {
  element: HTMLElement
  style: CSSStyleDeclaration
  options: Options

  constructor(element: HTMLElement, options: Options) {
    this.element = element
    // cache for better performance
    this.style = element.style
    this.options = options
  }
  getPosition() {
    let cssStyle = window.getComputedStyle(this.element, null) as any
    let matrix = cssStyle[style.transform as string].split(')')[0].split(', ')
    const x = +(matrix[12] || matrix[4])
    const y = +(matrix[13] || matrix[5])

    return {
      x,
      y
    }
  }

  setPosition(x: number, y: number, scale: number) {
    this.style[
      style.transform as any
    ] = `translate(${x}px,${y}px) scale(${scale})${this.options.translateZ}`
  }
}
