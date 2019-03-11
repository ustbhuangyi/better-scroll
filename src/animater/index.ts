import Translater from '../translater/Base'
import { Options as BScrollOptions } from '../Options'

import Transition from './Transition'
import Animation from './Animation'

export { Transition, Animation }

export default function createAnimater(
  element: HTMLElement,
  translater: Translater,
  options: BScrollOptions
) {
  const useTransition = options.useTransition
  if (useTransition) {
    return new Transition(element, translater, {
      probeType: options.probeType
    })
  } else {
    return new Animation(element, translater, {
      probeType: options.probeType
    })
  }
}
