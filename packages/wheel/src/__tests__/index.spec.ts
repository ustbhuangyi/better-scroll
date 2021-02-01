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
        sourceKey: 'plugins.wheel.wheelTo'
      },
      {
        key: 'getSelectedIndex',
        sourceKey: 'plugins.wheel.getSelectedIndex'
      },
      {
        key: 'restorePosition',
        sourceKey: 'plugins.wheel.restorePosition'
      }
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
      selectedIndex: 2
    })
    expect(wheel2.selectedIndex).toBe(2)
  })

  it('should trigger scroll.scrollTo when invoking wheelTo method', () => {
    addPropertiesToWheel(wheel, {
      itemHeight: 40
    })
    wheel.wheelTo(0)

    expect(scroll.scrollTo).toBeCalled()
    expect(scroll.scrollTo).toHaveBeenLastCalledWith(0, -0, 0, undefined)
  })

  it('should return seletedIndex when invoking getSelectedIndex', () => {
    const { wheel: wheel2 } = createWheel({
      selectedIndex: 2
    })
    expect(wheel2.getSelectedIndex()).toBe(2)
  })

  it('should support scrollTo somewhere by selectedIndex when initialized', () => {
    addPropertiesToWheel(wheel, {
      selectedIndex: 1,
      itemHeight: 50
    })
    const postion = {
      x: 100,
      y: 100
    }
    // manually trigger
    scroll.hooks.trigger(scroll.hooks.eventTypes.beforeInitialScrollTo, postion)
    expect(postion).toMatchObject({
      x: 0,
      y: -50
    })
  })

  it('should invoke wheelTo when scroll.scroller trigger checkClick hook', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      wheelTo: jest.fn()
    })

    scroll.scroller.hooks.trigger('checkClick')
    expect(wheel.wheelTo).toBeCalled()
    expect(wheel.wheelTo).toHaveBeenCalledWith(0, 400, expect.anything())

    // if target element is not found
    addPropertiesToWheel(wheel, {
      items: [div],
      target: null,
      wheelTo: jest.fn()
    })
    let ret = scroll.scroller.hooks.trigger('checkClick')
    expect(ret).toBe(true)
  })

  it('should invoke findNearestValidWheel when scroll.scroller trigger scrollTo hook', () => {
    let endPoint = { x: 0, y: -20 }
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40,
      wheelTo: jest.fn()
    })

    scroll.scroller.hooks.trigger('scrollTo', endPoint)
    expect(endPoint.y).toBe(-0)
  })

  it('should change position when scroll.scroller trigger scrollToElement hook', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40
    })
    let pos = {
      top: -20,
      left: 0
    }
    div.className = 'wheel-item'
    scroll.scroller.hooks.trigger('scrollToElement', div, pos)

    expect(pos).toEqual({
      top: -0,
      left: 0
    })

    // mismatch target element
    let div1 = document.createElement('div')
    let pos1 = {
      top: -40,
      left: 0
    }
    addPropertiesToWheel(wheel, {
      items: [div1],
      target: div1,
      itemHeight: 40
    })
    let ret = scroll.scroller.hooks.trigger('scrollToElement', div1, pos1)
    expect(ret).toBe(true)
    expect(pos1).toMatchObject({
      top: -40,
      left: 0
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
      itemHight: 50
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
      maxScrollPos: 0
    })

    expect(cachedYBoundary).toMatchObject({
      minScrollPos: 0,
      maxScrollPos: -50
    })
  })

  it('should change momentumInfo when scroll.scroller.scrollBehaviorY trigger momentum or end hook', () => {
    let momentumInfo = {
      destination: 0,
      rate: 15
    }
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40
    })
    scroll.scroller.scrollBehaviorY.hooks.trigger('momentum', momentumInfo)

    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4
    })

    scroll.scroller.scrollBehaviorY.currentPos = -20
    scroll.scroller.scrollBehaviorY.hooks.trigger('end', momentumInfo)
    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4,
      duration: 400
    })

    scroll.scroller.scrollBehaviorY.hooks.trigger('momentum', momentumInfo, 800)
    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4,
      duration: 400
    })
  })

  it('scroll.hooks.refresh ', () => {
    let newContent = document.createElement('p')
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      target: div,
      itemHeight: 40
    })
    wheel.options.selectedIndex = 1
    scroll.hooks.trigger(scroll.hooks.eventTypes.refresh, newContent)

    expect(scroll.scrollTo).toBeCalledWith(0, -40, 0, undefined)
  })

  it('scroll.scroller.animater.hooks.time ', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div]
    })
    const animater = scroll.scroller.animater
    animater.hooks.trigger(animater.hooks.eventTypes.time, 100)
    expect(div.style.transitionDuration).toBe('100ms')
  })

  it('scroll.scroller.animater.hooks.timeFunction ', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div]
    })
    const animater = scroll.scroller.animater
    animater.hooks.trigger(
      animater.hooks.eventTypes.timeFunction,
      'cubic-bezier(0.23, 1, 0.32, 1)'
    )
    expect(div.style.transitionTimingFunction).toBe(
      'cubic-bezier(0.23, 1, 0.32, 1)'
    )
  })

  it('scroll.scroller.animater.hooks.callStop', () => {
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div1, div2],
      itemHeight: 40,
      wheelItemsAllDisabled: false
    })
    scroll.y = -41
    scroll.maxScrollY = -80
    scroll.scroller.animater.hooks.trigger('callStop')
    expect(scroll.scrollTo).toBeCalledWith(0, -40, 0, undefined)
  })

  it('scroll.scroller.animater.translater.hooks.translate', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div],
      itemHeight: 40,
      wheelItemsAllDisabled: false
    })
    const translater = scroll.scroller.animater.translater
    translater.hooks.trigger(translater.hooks.eventTypes.translate, {
      x: 0,
      y: -20
    })
    expect(wheel.selectedIndex).toEqual(0)
  })

  it('scroll.scroller.hooks.minDistanceScroll ', () => {
    let div = document.createElement('div')
    addPropertiesToWheel(wheel, {
      items: [div]
    })
    const scroller = scroll.scroller
    scroller.animater.forceStopped = true
    scroller.hooks.trigger(scroller.hooks.eventTypes.minDistanceScroll)
    expect(scroller.animater.forceStopped).toBe(false)
  })

  it('scrollEnd event', () => {
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    addPropertiesToWheel(wheel, {
      itemHeight: 40,
      items: [div1, div2]
    })
    scroll.maxScrollY = -80
    scroll.scroller.animater.forceStopped = true
    // stopped from an animation,
    // prevent user's scrollEnd callback triggered twice
    const ret = scroll.trigger(scroll.eventTypes.scrollEnd, { y: 0 })
    expect(ret).toBe(true)

    wheel.isAdjustingPosition = true
    // update selectedIndex
    scroll.trigger(scroll.eventTypes.scrollEnd, { y: -41 })

    expect(wheel.getSelectedIndex()).toBe(1)
    expect(wheel.isAdjustingPosition).toBe(false)
  })

  it('wheel.restorePosition()', () => {
    addPropertiesToWheel(wheel, {
      itemHeight: 40
    })
    // simulate bs is scrolling
    scroll.pending = true
    wheel.restorePosition()
    expect(scroll.scroller.animater.clearTimer).toBeCalled()
    expect(scroll.scrollTo).toBeCalledWith(0, -0, 0, undefined)
  })

  it('should support disable wheel items', () => {
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    const scroller = scroll.scroller
    const position = { y: -41 }
    addPropertiesToWheel(wheel, {
      items: [div1, div2],
      itemHeight: 40,
      wheelItemsAllDisabled: false
    })
    scroll.y = -41
    scroll.maxScrollY = -80
    div2.className = 'wheel-disabled-item'
    scroller.hooks.trigger(scroller.hooks.eventTypes.scrollTo, position)
    expect(position.y).toBe(-0)

    div1.className = 'wheel-disabled-item'
    wheel.wheelItemsAllDisabled = true
    scroller.hooks.trigger(scroller.hooks.eventTypes.scrollTo, position)
    expect(position.y).toBe(-0)

    let div3 = document.createElement('div')
    let position3 = {
      y: -39
    }
    addPropertiesToWheel(wheel, {
      items: [div1, div2, div3],
      itemHeight: 40,
      wheelItemsAllDisabled: false
    })
    scroller.hooks.trigger(scroller.hooks.eventTypes.scrollTo, position3)
    expect(position3.y).toBe(-80)
  })
})
