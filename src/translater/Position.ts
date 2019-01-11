export default class Position {
  element: HTMLElement
  style: CSSStyleDeclaration
  constructor(element: HTMLElement) {
    this.element = element
    // cache for better performance
    this.style = element.style
  }

  getPosition() {
    let cssStyle = window.getComputedStyle(this.element, null) as any
    let x = +cssStyle.left.replace(/[^-\d.]/g, '')
    let y = +cssStyle.top.replace(/[^-\d.]/g, '')

    return {
      x,
      y
    }
  }

  setPosition(x: number, y: number, scale: number) {
    this.style.left = `${Math.round(x)}px`
    this.style.top = `${Math.round(y)}px`
  }
}
