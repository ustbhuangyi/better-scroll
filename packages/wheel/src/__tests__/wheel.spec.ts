import BScroll from '@better-scroll/core'
import Wheel from '../index'
jest.mock('@better-scroll/core')

describe('wheel plugin tests', () => {
  let bscroll: BScroll
  let wheel: Wheel

  beforeEach(() => {
    // create DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    bscroll = new BScroll(wrapper, { wheel: {} })
    wheel = new Wheel(bscroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should proxy properties to BScroll instance', () => {
    expect(bscroll.proxy).toBeCalled()
    expect(bscroll.proxy).toHaveBeenLastCalledWith([
      {
        key: 'wheelTo',
        sourceKey: 'plugins.wheel.wheelTo'
      },
      {
        key: 'getSelectedIndex',
        sourceKey: 'plugins.wheel.getSelectedIndex'
      }
    ])
  })

  it('should normalize options', () => {
    expect(wheel.selectedIndex).toBe(0)
    expect(wheel.options.wheelWrapperClass).toBe('wheel-scroll')
    expect(wheel.options.wheelItemClass).toBe('wheel-item')
    expect(wheel.options.wheelDisabledItemClass).toBe('wheel-disabled-item')
  })

  it('should trigger bscroll.scrollTo when invoking wheelTo method', () => {
    wheel.wheelTo(0)

    expect(bscroll.scrollTo).toBeCalled()
    expect(bscroll.scrollTo).toHaveBeenLastCalledWith(
      0,
      -0,
      0,
      undefined,
      undefined
    )
  })

  it('should return seletedIndex when invoking getSelectedIndex', () => {
    expect(wheel.getSelectedIndex()).toBe(0)
  })

  it('should refresh when bscroll refreshed', () => {
    let originWheelRefresh = wheel.refresh.bind(wheel)
    wheel.refresh = jest.fn().mockImplementation(() => {
      originWheelRefresh()
    })
    bscroll.trigger('refresh')
    expect(wheel.refresh).toBeCalled()
    expect(wheel.selectedIndex).toBe(0)
  })

  it('should invoke wheelTo when bscroll.scroller trigger checkClick hook', () => {
    let div = document.createElement('div')
    wheel.items = [div] as any
    wheel.target = div

    wheel.wheelTo = jest.fn()
    bscroll.scroller.hooks.trigger('checkClick')
    expect(wheel.wheelTo).toBeCalled()
    expect(wheel.wheelTo).toHaveBeenCalledWith(0, 400, expect.anything())
  })

  it('should invoke findNearestValidWheel when bscroll.scroller trigger scrollTo hook', () => {
    let div = document.createElement('div')
    let endPoint = { x: 0, y: -20 }
    wheel.items = [div] as any
    wheel.target = div
    wheel.itemHeight = 40

    bscroll.scroller.hooks.trigger('scrollTo', endPoint)
    expect(endPoint.y).toBe(-0)
  })

  it('should change position when bscroll.scroller trigger scrollToElement hook', () => {
    let wrapperDiv = document.createElement('div')
    let wheelItemDiv = document.createElement('div')
    wheel.items = [wrapperDiv] as any
    wheel.itemHeight = 40
    let pos = {
      top: -20,
      left: 0
    }
    wheelItemDiv.className = 'wheel-item'
    bscroll.scroller.hooks.trigger('scrollToElement', wheelItemDiv, pos)

    expect(pos).toEqual({
      top: -0,
      left: 0
    })
  })

  it('should change target when bscroll.scroller.actionsHandler trigger beforeStart hook', () => {
    let e = {} as any
    let div = document.createElement('div')
    e.target = div
    bscroll.scroller.actionsHandler.hooks.trigger('beforeStart', e)

    expect(wheel.target).toEqual(div)
  })

  it('should change momentumInfo when bscroll.scroller.scrollBehaviorY trigger momentum or end hook', () => {
    let momentumInfo = {
      destination: 0,
      rate: 15
    }
    let div = document.createElement('div')
    wheel.items = [div] as any
    wheel.target = div
    wheel.itemHeight = 40
    bscroll.scroller.scrollBehaviorY.hooks.trigger('momentum', momentumInfo)

    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4
    })

    bscroll.scroller.scrollBehaviorY.currentPos = -20
    bscroll.scroller.scrollBehaviorY.hooks.trigger('end', momentumInfo)
    expect(momentumInfo).toEqual({
      destination: -0,
      rate: 4,
      duration: 400
    })
  })

  it('should change target when bscroll.scroller.animater trigger beforeForceStop hook', () => {
    let div = document.createElement('div')
    wheel.items = [div] as any
    wheel.itemHeight = 40
    wheel.wheelItemsAllDisabled = false
    bscroll.scroller.animater.hooks.trigger('beforeForceStop', { x: 0, y: -20 })
    expect(wheel.target).toEqual(div)
  })

  it('should change selectedIndex when bscroll.scroller.animater.translater trigger translate hook', () => {
    let div = document.createElement('div')
    wheel.items = [div] as any
    wheel.itemHeight = 40
    wheel.wheelItemsAllDisabled = false

    bscroll.scroller.animater.translater.hooks.trigger('translate', {
      x: 0,
      y: -20
    })
    expect(wheel.selectedIndex).toEqual(0)
  })
})
