import BScroll from '@/index'
import ActionsHandler from '@/base/ActionsHandler'
import Wheel from '@/plugins/wheel'
jest.mock('@/index')

describe('wheel plugin tests', () => {
  let bscroll: BScroll

  beforeEach(() => {
    // create DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    bscroll = new BScroll(wrapper, { wheel: {} })
  })

  afterEach(() => {})
  it('dummy test', () => {})
})
