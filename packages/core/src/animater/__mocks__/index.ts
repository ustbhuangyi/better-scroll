import Transition from '@better-scroll/core/src/animater/Transition'
import Animation from '@better-scroll/core/src/animater/Animation'

jest.mock('@better-scroll/core/src/animater/Transition')
jest.mock('@better-scroll/core/src/animater/Animation')

const createAnimater = jest
  .fn()
  .mockImplementation((element, translater, bscrollOptions) => {
    if (bscrollOptions.useTransition) {
      return new Transition(element, translater, bscrollOptions as {
        probeType: number
      })
    } else {
      return new Animation(element, translater, bscrollOptions as {
        probeType: number
      })
    }
  })

export default createAnimater
