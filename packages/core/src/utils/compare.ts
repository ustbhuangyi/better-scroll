import { TranslaterPoint } from '../translater'

export function isSamePoint(
  startPoint: TranslaterPoint,
  endPoint: TranslaterPoint
): boolean {
  // keys of startPoint and endPoint should be equal
  const keys = Object.keys(startPoint)
  for (let key of keys) {
    if (startPoint[key] !== endPoint[key]) return false
  }
  return true
}
