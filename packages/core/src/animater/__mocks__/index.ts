import Transition from '../Transition'
import Animation from '../Animation'

jest.mock('../Transition')
jest.mock('../Animation')

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
