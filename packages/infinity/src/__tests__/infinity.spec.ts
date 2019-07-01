import BScroll from '@better-scroll/core'
import EventHandler from '@better-scroll/scroll-bar/src/event-handler'

jest.mock('@better-scroll/core')
jest.mock('@better-scroll/scroll-bar/src/event-handler')

import { mockDomClient } from '@better-scroll/core/src/__tests__/__utils__/layout'
import InfinityScroll from '..'

describe('infinity unit test', () => {
  let bscroll: BScroll
  let wrapper: HTMLElement
  let content: HTMLElement
  const CONFIG_INFINITY = {
    render: (item: any) => {
      const div = document.createElement('div')
      mockDomClient(div, { height: 20, width: 100 })
      return div
    },
    fetch: (count: number) => new Array<number>(count).map((x, i) => i)
  }

  beforeAll(() => {
    // create Dom
    wrapper = document.createElement('div')
    content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    bscroll = new BScroll(wrapper, {})
    bscroll.options.translateZ = ''
    // given for vertical
    bscroll.hasVerticalScroll = true
    bscroll.x = bscroll.y = 0
  })

  beforeEach(() => {
    // create Dom indicator
  })

  afterEach(() => {
    jest.clearAllMocks()
    bscroll.off()
  })

  it('should render enough elements when initial', () => {
    // when
  })
})
