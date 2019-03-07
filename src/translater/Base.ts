export interface TransformPoint {
  x: number
  y: number
  [key: string]: number
}

export default abstract class Base {
  element: HTMLElement
  style: CSSStyleDeclaration
  constructor(element: HTMLElement) {
    this.element = element
    // cache for better performance
    this.style = element.style
  }

  abstract getComputedPosition(): TransformPoint

  abstract translate(point: TransformPoint): void
}
