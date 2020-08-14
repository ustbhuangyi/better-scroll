import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')
import { createDiv } from '@better-scroll/core/src/__tests__/__utils__/layout'
import Movable from '../index'

const createMovableEls = () => {
  const wrapper = createDiv(100, 100, 0, 0)
  const content = createDiv(100, 100, 0, 0)
  wrapper.appendChild(content)

  return {
    wrapper,
    content
  }
}
describe('movable plugin', () => {
  let scroll: BScroll

  beforeEach(() => {
    // create DOM
    const { wrapper } = createMovableEls()
    scroll = new BScroll(wrapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    new Movable(scroll)

    expect(scroll.proxy).toBeCalled()
    expect(scroll.proxy).toHaveBeenLastCalledWith([
      {
        key: 'zoomTo',
        sourceKey: 'plugins.zoom.zoomTo'
      }
    ])
  })
})
