import { Options as BScrollOptions } from '../Options'
import Position from './Position'
import Transform from './Transform'
import { TransformPoint } from './Base'

export { Position, Transform, TransformPoint }

export default function createTranslater(
  element: HTMLElement,
  options: BScrollOptions
) {
  if (options.useTransform) {
    return new Transform(element, {
      translateZ: options.translateZ
    })
  } else {
    return new Position(element)
  }
}
