import Translater from '../translater'
import { Options as BScrollOptions } from '../Options'

import Animater from './Base'
import Transition from './Transition'
import Animation from './Animation'

export { Animater, Transition, Animation }

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
