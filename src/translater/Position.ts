import Base, { TransformPoint } from './Base'

export default class Position extends Base {
  constructor(element: HTMLElement) {
    super(element)
  }

  getComputedPosition() {
    let cssStyle = window.getComputedStyle(this.element, null) as any
    let x = +cssStyle.left.replace(/[^-\d.]/g, '')
    let y = +cssStyle.top.replace(/[^-\d.]/g, '')

    return {
      x,
      y
    }
  }

  translate(point: TransformPoint) {
    this.style.left = `${Math.round(point.x)}px`
    this.style.top = `${Math.round(point.y)}px`
  }
}
