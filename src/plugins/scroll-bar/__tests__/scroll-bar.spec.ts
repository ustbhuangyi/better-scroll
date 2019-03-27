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
    // create Dom
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    bscroll = new BScroll(wrapper, {})
    bscroll.options.scrollbar = CONFIG_SCROLL_BAR
    bscroll.options.scrollX = true
    bscroll.options.scrollY = true
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
