import BScroll, { Boundary } from '@better-scroll/core'
import Wheel from '../index'

jest.mock('@better-scroll/core')

const createWheel = (wheelOptions: Object) => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)
  const scroll = new BScroll(wrapper, { wheel: wheelOptions })
  const wheel = new Wheel(scroll)
  return { scroll, wheel }
}

const addPropertiesToWheel = <T extends Object>(wheel: Wheel, obj: T) => {
  for (const key in obj) {
    ;(wheel as any)[key] = obj[key]
  }
  return wheel
}
describe('wheel plugin tests', () => {
  let scroll: BScroll
  let wheel: Wheel

  beforeEach(() => {
    const created = createWheel({})
    // create DOM
    wheel = created.wheel
    scroll = created.scroll
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    expect(scroll.proxy).toBeCalled()
    expect(scroll.proxy).toHaveBeenLastCalledWith([
      {
        key: 'wheelTo',
        sourceKey: 'plugins.wheel.wheelTo',
      },
      {
        key: 'getSelectedIndex',
        sourceKey: 'plugins.wheel.getSelectedIndex',
      },
    ])
  })

  it('should handle options', () => {
    expect(wheel.options.rotate).toBe(25)
    expect(wheel.options.adjustTime).toBe(400)
    expect(wheel.options.selectedIndex).toBe(0)
    expect(wheel.options.wheelWrapperClass).toBe('wheel-scroll')
    expect(wheel.options.wheelItemClass).toBe('wheel-item')
    expect(wheel.options.wheelDisabledItemClass).toBe('wheel-disabled-item')
  })

  it('should refresh BehaviorX and BehaviorY boundary', () => {
    const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller

    expect(scrollBehaviorX.refresh).toBeCalled()
    expect(scrollBehaviorY.refresh).toBeCalled()
  })

  it('should handle selectedIndex', () => {
    // default
    expect(wheel.selectedIndex).toBe(0)
    // specified
    const { wheel: wheel2 } = createWheel({
      selectedIndex: 2,
    })
    expect(wheel2.selectedIndex).toBe(2)
  })

  it('should trigger scroll.scrollTo when invoking wheelTo method', () => {
    addPropertiesToWheel(wheel, {
      itemHeight: 40,
    })
    wheel.wheelTo(0)

    expect(scroll.scrollTo).toBeCalled()
    expect(scroll.scrollTo).toHaveBeenLastCalledWith(0, -0, 0, undefined)
  })

  it('should return seletedIndex when invoking getSelectedIndex', () => {
    const { wheel: wheel2 } = createWheel({
      selectedIndex: 2,
    })
    expect(wheel2.getSelectedIndex()).toBe(2)
  })

  it('should support scrollTo somewhere by selectedIndex when initialized', () => {
    addPropertiesToWheel(wheel, {
      selectedIndex: 1,
      itemHeight: 50,
    })
    const postion = {
      x: 100,
      y: 100,
    }
    // manually trigger
    scroll.hooks.trigger(scroll.hooks.eventTypes.beforeInitialScrollTo, postion)
    expect(postion).toMatchObject({
      x: 0,
      y: -50,
    })
  })

  it('should invoke wheelTo when scroll.scroller trigger checkClick hook', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      wheelTo: jest.fn(),
    })

    scroll.scroller.hooks.trigger('checkClick')
    expect(wheel.wheelTo).toBeCalled()
    expect(wheel.wheelTo).toHaveBeenCalledWith(0, 400, expect.anything())
  })

  it('should invoke findNearestValidWheel when scroll.scroller trigger scrollTo hook', () => {
    let endPoint = { x: 0, y: -20 }
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40,
      wheelTo: jest.fn(),
    })

    scroll.scroller.hooks.trigger('scrollTo', endPoint)
    expect(endPoint.y).toBe(-0)
  })

  it('should change position when scroll.scroller trigger scrollToElement hook', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40,
    })
    let pos = {
      top: -20,
      left: 0,
    }
    div.className = 'wheel-item'
    scroll.scroller.hooks.trigger('scrollToElement', div, pos)

    expect(pos).toEqual({
      top: -0,
      left: 0,
    })
  })

  it('should change target when scroll.scroller.actionsHandler trigger beforeStart hook', () => {
    let e = {} as any
    let div = document.createElement('div')
    e.target = div
    scroll.scroller.actionsHandler.hooks.trigger('beforeStart', e)

    expect(wheel.target).toEqual(div)
  })

  it('should modify boundary when scrollBehaviorY or scrollBehaviorX computedBoundary', () => {
    let div = document.createElement('div')
    let cachedXBoundary = {} as Boundary
    let cachedYBoundary = {} as Boundary
    addPropertiesToWheel(wheel, {
      items: [div, div],
      itemHight: 50,
    })
    const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller
    // append two element
    scroll.scroller.content.appendChild(document.createElement('div'))
    scroll.scroller.content.appendChild(document.createElement('div'))
    scrollBehaviorY.contentSize = 100

    // manually trigger
    scrollBehaviorX.hooks.trigger(
      scrollBehaviorX.hooks.eventTypes.computeBoundary,
      cachedXBoundary
    )
    scrollBehaviorY.hooks.trigger(
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      cachedYBoundary
    )

    expect(cachedXBoundary).toMatchObject({
      minScrollPos: 0,
      maxScrollPos: 0,
    })

    expect(cachedYBoundary).toMatchObject({
      minScrollPos: 0,
      maxScrollPos: -50,
    })
  })

  it('should change momentumInfo when scroll.scroller.scrollBehaviorY trigger momentum or end hook', () => {
    let momentumInfo = {
      destination: 0,
      rate: 15,
    }
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40,
    })
    scroll.scroller.scrollBehaviorY.hooks.trigger('momentum', momentumInfo)

    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4,
    })

    scroll.scroller.scrollBehaviorY.currentPos = -20
    scroll.scroller.scrollBehaviorY.hooks.trigger('end', momentumInfo)
    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4,
      duration: 400,
    })
  })

  it('should change target when scroll.scroller.animater trigger beforeForceStop hook', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      itemHeight: 40,
      wheelItemsAllDisabled: false,
    })
    scroll.scroller.animater.hooks.trigger('beforeForceStop', { x: 0, y: -20 })
    expect(wheel.target).toEqual(div)
  })

  it('should stop at correct position when callStop hook is trigger', () => {
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div1, div2],
      target: div2,
      itemHeight: 40,
      wheelItemsAllDisabled: false,
    })
    scroll.scroller.animater.hooks.trigger('callStop')
    expect(wheel.target).toEqual(div2)
    expect(scroll.scroller.animater.translate).toBeCalledWith({
      x: 0,
      y: -40,
    })
  })

  it('should change selectedIndex when scroll.scroller.animater.translater trigger translate hook', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      itemHeight: 40,
      wheelItemsAllDisabled: false,
    })

    scroll.scroller.animater.translater.hooks.trigger('translate', {
      x: 0,
      y: -20,
    })
    expect(wheel.selectedIndex).toEqual(0)
  })
})
