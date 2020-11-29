import { Direction } from '@better-scroll/shared-utils'
import { TranslaterPoint } from '../translater'

type Position = {
  x: number
  y: number
}
// iOS 13.6 - 14.x, window.getComputedStyle sometimes will get wrong transform value
// when bs use transition mode
// eg: translateY -100px -> -200px, when the last frame which is about to scroll to -200px
// window.getComputedStyle(this.content) will calculate transformY to be -100px(startPoint)
// it is weird
// so we should validate position caculated by 'window.getComputedStyle'
export const isValidPostion = (
  startPoint: TranslaterPoint,
  endPoint: TranslaterPoint,
  currentPos: Position,
  prePos: Position
) => {
  const computeDirection = (endValue: number, startValue: number) => {
    const delta = endValue - startValue
    const direction =
      delta > 0
        ? Direction.Negative
        : delta < 0
        ? Direction.Positive
        : Direction.Default
    return direction
  }
  const directionX = computeDirection(endPoint.x, startPoint.x)
  const directionY = computeDirection(endPoint.y, startPoint.y)
  const deltaX = currentPos.x - prePos.x
  const deltaY = currentPos.y - prePos.y

  return directionX * deltaX <= 0 && directionY * deltaY <= 0
}
