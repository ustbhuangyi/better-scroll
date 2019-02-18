import { style } from '../util'
import Base from './Base'
import { safeCSSStyleDeclaration } from '../util'

interface Options {
  translateZ: string
}
export default class Transform extends Base {
  options: Options
  constructor(element: HTMLElement, options: Options) {
    super(element)
    this.options = options
  }

  getComputedPosition() {
    let cssStyle = window.getComputedStyle(
      this.element,
      null
    ) as safeCSSStyleDeclaration
    let matrix = cssStyle[style.transform].split(')')[0].split(', ')
    const x = +(matrix[12] || matrix[4])
    const y = +(matrix[13] || matrix[5])

    return {
      x,
      y
    }
  }

  translate(x: number, y: number) {
    this.style[style.transform as any] = `translate(${x}px,${y}px)${
      this.options.translateZ
    }`
  }
}
