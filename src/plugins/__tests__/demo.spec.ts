// import mocked dependencies
import BScroll from '@/index'
jest.mock('@/index')

// import module for test
// import types
import { Options } from '@/Options'
// import Demo from '@/plugins/demo'

describe('demo unit test', () => {
  let bscroll: BScroll
  let options: Partial<Options>

  beforeAll(() => {
    // create DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)

    options = {
      useTransform: false,
      pullUpLoad: {
        threshold: 1
      }
    }
    bscroll = new BScroll(wrapper, options)
    // mock 特殊的 options
    bscroll.options.scrollX = true
    // mock 你测试中需要的 bscroll 属性值
    bscroll.hasVerticalScroll = true
    bscroll.scrollerHeight = 200
    bscroll.maxScrollY = -100
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should instanciate demo', () => {})

  describe('api xxx', () => {
    beforeEach(() => {})

    it('should return xxx', () => {})
  })
})
