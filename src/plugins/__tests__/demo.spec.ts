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
      pullUpLoad: {
        threshold: 1
      }
    }
    bscroll = new BScroll(wrapper, options)
    // mock special options property
    bscroll.options.scrollX = true
    // mock the property of scroll that you need for test
    bscroll.hasVerticalScroll = true
    bscroll.scrollerHeight = 200
    bscroll.maxScrollY = -100
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should instantiate demo', () => {})

  describe('api xxx', () => {
    beforeEach(() => {})

    it('should return xxx', () => {})
  })
})
