import { style } from '../util'
import Base from './Base'

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
    let cssStyle = window.getComputedStyle(this.element, null) as any
    let matrix = cssStyle[style.transform as string].split(')')[0].split(', ')
    const x = +(matrix[12] || matrix[4])
    const y = +(matrix[13] || matrix[5])

    return {
      x,
      y
    }
  }

  updatePosition(x: number, y: number, scale: number) {
    this.style[
      style.transform as any
    ] = `translate(${x}px,${y}px) scale(${scale})${this.options.translateZ}`

    this.updateProps(x, y, scale)
  }
}
