import BScroll, { Boundary } from '@better-scroll/core'
jest.mock('@better-scroll/core')
import { createDiv } from '@better-scroll/core/src/__tests__/__utils__/layout'
import Movable from '../index'

const createMovableEls = () => {
  const wrapper = createDiv(100, 100, 0, 0)
  const content = createDiv(100, 100, 0, 0)
  wrapper.appendChild(content)

  return {
    wrapper,
    content,
  }
}
describe('movable plugin', () => {
  let scroll: BScroll
  let movable: Movable

  beforeEach(() => {
    // create DOM
    const { wrapper } = createMovableEls()
    scroll = new BScroll(wrapper)
    movable = new Movable(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    expect(scroll.proxy).toBeCalled()
    expect(scroll.proxy).toHaveBeenLastCalledWith([
      {
        key: 'putAt',
        sourceKey: 'plugins.movable.putAt',
      },
    ])
  })

  it('should modify boundary', () => {
    const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller
    scrollBehaviorX.options.scrollable = true
    scrollBehaviorY.options.scrollable = true

    scrollBehaviorX.wrapperSize = 200
    scrollBehaviorX.contentSize = 100
    scrollBehaviorY.wrapperSize = 400
    scrollBehaviorY.contentSize = 200

    let boundaryX: Boundary = { minScrollPos: 0, maxScrollPos: 1 }
    let boundaryY: Boundary = { minScrollPos: 0, maxScrollPos: 1 }

    scrollBehaviorX.hooks.trigger(
      scrollBehaviorX.hooks.eventTypes.computeBoundary,
      boundaryX
    )
    scrollBehaviorY.hooks.trigger(
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      boundaryY
    )

    expect(boundaryX).toMatchObject({
      minScrollPos: 100,
      maxScrollPos: 0,
    })

    expect(boundaryY).toMatchObject({
      minScrollPos: 200,
      maxScrollPos: 0,
    })
  })

  it('should register ignoreHasScroll hook', () => {
    const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller
    const retX = scrollBehaviorX.hooks.trigger(
      scrollBehaviorX.hooks.eventTypes.ignoreHasScroll
    )
    const retY = scrollBehaviorY.hooks.trigger(
      scrollBehaviorY.hooks.eventTypes.ignoreHasScroll
    )

    expect(retX).toBe(true)
    expect(retY).toBe(true)
  })

  it('should work well when call putAt()', () => {
    // integer
    movable.putAt(20, 20)
    expect(scroll.scrollTo).toBeCalledWith(20, 20, 800, expect.anything())

    // simulate minScrollPos
    scroll.scroller.scrollBehaviorX.minScrollPos = 300
    scroll.scroller.scrollBehaviorY.minScrollPos = 300

    // [left, bottom]
    movable.putAt('left', 'bottom')
    expect(scroll.scrollTo).toBeCalledWith(0, 300, 800, expect.anything())

    // [right, top]
    movable.putAt('right', 'top')
    expect(scroll.scrollTo).toBeCalledWith(300, 0, 800, expect.anything())

    // [center, center]
    movable.putAt('center', 'center')
    expect(scroll.scrollTo).toBeCalledWith(150, 150, 800, expect.anything())
  })

  it('should destroy all events', () => {
    const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller
    scroll.hooks.trigger(scroll.hooks.eventTypes.destroy)
    expect(scrollBehaviorX.hooks.events['computeBoundary'].length).toBe(0)
    expect(scrollBehaviorX.hooks.events['ignoreHasScroll'].length).toBe(0)

    expect(scrollBehaviorY.hooks.events['computeBoundary'].length).toBe(0)
    expect(scrollBehaviorY.hooks.events['ignoreHasScroll'].length).toBe(0)
  })
})
