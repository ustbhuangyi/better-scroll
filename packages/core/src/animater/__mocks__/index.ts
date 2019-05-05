import Transition from '@/animater/Transition'
import Animation from '@/animater/Animation'

jest.mock('@/animater/Transition')
jest.mock('@/animater/Animation')

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
