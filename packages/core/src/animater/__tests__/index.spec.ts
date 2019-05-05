import Translater from '@/translater/index'
import Transition from '@/animater/Transition'
import Animation from '@/animater/Animation'
import { Options } from '@/Options'
jest.mock('@/animater/Animation')
jest.mock('@/animater/Transition')
jest.mock('@/animater/Base')
jest.mock('@/translater/index')
jest.mock('@/Options')

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
