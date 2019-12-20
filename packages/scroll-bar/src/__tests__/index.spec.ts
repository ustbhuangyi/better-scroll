import Indicator from '../indicator'
import BScroll, { Options } from '@better-scroll/core'

jest.mock('@better-scroll/core')
jest.mock('../indicator')

import ScrollBar from '../index'

describe('scroll-bar unit tests', () => {
  let bscroll: BScroll
  let options: Partial<Options>
  const CONFIG_SCROLL_BAR = {
    fade: true,
    interactive: true
  }

  beforeAll(() => {
    // create Dom
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    options = {
      scrollbar: CONFIG_SCROLL_BAR,
      scrollX: true,
      scrollY: true
    }
    bscroll = new BScroll(wrapper, options)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should new indicators', () => {
      // when
      new ScrollBar(bscroll)
      // then
      expect(Indicator).toBeCalledTimes(2)
    })
    it('should create indicator elements', () => {
      // when
      new ScrollBar(bscroll)
      // then
      expect(bscroll.wrapper).toMatchSnapshot()
    })
  })

  it('should destroy scrollbar when bscroll destroy', () => {
    // given
    const scrollbar = new ScrollBar(bscroll)
    // when
    scrollbar.destroy()
    // then
    expect(scrollbar.indicators[0].destroy).toBeCalledTimes(1)
    expect(scrollbar.indicators[1].destroy).toBeCalledTimes(1)
  })
})
