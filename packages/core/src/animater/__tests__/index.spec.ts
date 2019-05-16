import Translater from '@better-scroll/core/src/translater/index'
import Transition from '@better-scroll/core/src/animater/Transition'
import Animation from '@better-scroll/core/src/animater/Animation'
import { Options } from '@better-scroll/core/src/Options'
jest.mock('@better-scroll/core/src/animater/Animation')
jest.mock('@better-scroll/core/src/animater/Transition')
jest.mock('@better-scroll/core/src/animater/Base')
jest.mock('@better-scroll/core/src/translater/index')
jest.mock('@better-scroll/core/src/Options')

import createAnimater from '../index'

describe('animater create test suit', () => {
  const dom = document.createElement('div')
  const translater = new Translater(dom)
  it('should create Transition class when useTransition=true', () => {
    const options = new Options()
    options.probeType = 0
    options.useTransition = true
    const animater = createAnimater(dom, translater, options)
    expect(Transition).toBeCalledWith(dom, translater, { probeType: 0 })
  })
  it('should create Animation class when useTransition=false', () => {
    const options = new Options()
    options.probeType = 0
    options.useTransition = false
    const animater = createAnimater(dom, translater, options)
    expect(Animation).toBeCalledWith(dom, translater, { probeType: 0 })
  })
})
