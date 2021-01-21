export type Ratio = number | RatioOfDirection
export type RatioOfDirection = {
  x: number
  y: number
}
export interface IndicatorOptions {
  interactive?: boolean
  ratio?: Ratio
  relationElement: HTMLElement
}

export const enum Direction {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export type Postion = {
  x: number
  y: number
}
