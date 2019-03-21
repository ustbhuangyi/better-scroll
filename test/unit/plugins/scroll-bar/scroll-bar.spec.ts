import Indicator from '@/plugins/scroll-bar/indicator'
import { Options } from '@/Options'
import BScroll from '@/index'

jest.mock('@/index')
jest.mock('@/Options')
jest.mock('@/plugins/scroll-bar/indicator')

import ScrollBar from '@/plugins/scroll-bar/scroll-bar'

describe('scroll-bar unit tests', () => {
  let wrapper: HTMLElement
  let content: HTMLElement
  let options: Options
  let bscroll: BScroll
  const CONFIG_SCROLL_BAR = {
    fade: true,
    interactive: true
  }

  beforeAll(() => {
    wrapper = document.createElement('div')
    content = document.createElement('div')
    wrapper.appendChild(content)

    options = new Options()
    options.scrollbar = CONFIG_SCROLL_BAR
    options.scrollX = true
    options.scrollY = true

    bscroll = new BScroll(wrapper, options)
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create indicators when instantiate scroll-bar', () => {
    new ScrollBar(bscroll)

    expect(Indicator).toBeCalledTimes(2)
    expect(bscroll.wrapper).toMatchSnapshot()
  })

  it('should destroy scrollbar when bscroll destroy', () => {
    const scrollbar = new ScrollBar(bscroll)

    expect(bscroll.on).toBeCalledWith('destroy', scrollbar.destroy, scrollbar)

    scrollbar.destroy()

    expect(scrollbar.indicators[0].destroy).toBeCalledTimes(1)
    expect(scrollbar.indicators[1].destroy).toBeCalledTimes(1)
  })
})
