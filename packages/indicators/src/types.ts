export type Ratio = number | RatioOfDirection
export type RatioOfDirection = {
  x: number
  y: number
}
export interface IndicatorOptions {
  interactive?: boolean
  ratio?: Ratio
  relationElementHandleElementIndex?: number
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

export const enum ValueSign {
  Positive = -1,
  NotPositive = 1,
}
