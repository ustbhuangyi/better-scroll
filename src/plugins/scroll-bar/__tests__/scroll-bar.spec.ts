import Indicator from '@/plugins/scroll-bar/indicator'
import { Options } from '@/Options'
import BScroll from '@/index'

jest.mock('@/index')
jest.mock('@/Options')
jest.mock('@/plugins/scroll-bar/indicator')

import ScrollBar from '@/plugins/scroll-bar/scroll-bar'

describe('scroll-bar unit tests', () => {
  let bscroll: BScroll
  const CONFIG_SCROLL_BAR = {
    fade: true,
    interactive: true
  }

  beforeAll(() => {
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)

    const options = new Options()
    options.scrollbar = CONFIG_SCROLL_BAR
    options.scrollX = true
    options.scrollY = true

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
