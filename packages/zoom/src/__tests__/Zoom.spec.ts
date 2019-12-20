import BScroll from '@better-scroll/core'
import Zoom from '../index'
import { EventEmitter } from '@better-scroll/shared-utils'
import { createTouchEvent } from './__utils__/util'
import { bscrollZoom, replaceBscrollProperties } from './__utils__/bscroll'
jest.mock('@better-scroll/core')
jest.mock('@better-scroll/core/src/animater/index')

function createBScroll(
  hooks: EventEmitter,
  zoomOptions: {
    start: number
    min: number
    max: number
  }
) {
  const mockscrollTo = jest.fn()
  const { partOfbscroll, dom } = bscrollZoom(zoomOptions)
  const bscroll = new BScroll(dom) as any
  replaceBscrollProperties(bscroll, partOfbscroll)
  bscroll.hooks = hooks
  bscroll.scroller.hooks = hooks
  bscroll.scroller.translater.hooks = hooks
  bscroll.scroller.animater = {
    hooks: hooks
  }
  bscroll.scroller.actions = {
    hooks: hooks
  }
  bscroll.scroller.scrollTo = mockscrollTo
  return {
    bscroll,
    mockscrollTo
  }
}

describe('zoom plugin', () => {
  let hooks: EventEmitter
  beforeAll(() => {
    hooks = new EventEmitter([
      'start',
      'beforeMove',
      'beforeEnd',
      'beforeTranslate',
      'destroy',
      'zoomStart',
      'zoomEnd',
      'ignoreDisMoveForSamePos'
    ])
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {})
  it('should right be inited when new Zoom', () => {
    const { bscroll } = createBScroll(hooks, {
      start: 1,
      min: 1,
      max: 2
    })
    new Zoom(bscroll)
    expect(bscroll.proxy).toBeCalled()
    expect(bscroll.registerType).toBeCalledWith(['zoomStart', 'zoomEnd'])
    expect(bscroll.scroller.content.style['webkit-transform-origin']).toBe(
      '0 0'
    )
  })
  it('should destroy all events', () => {
    hooks.trigger('destroy')
    expect(hooks.events['start'].length).toBe(0)
    expect(hooks.events['beforeMove'].length).toBe(0)
    expect(hooks.events['beforeEnd'].length).toBe(0)
    expect(hooks.events['beforeTranslate'].length).toBe(0)
    expect(hooks.events['destroy'].length).toBe(0)
  })
  it('should not react when zooming with one finger', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      start: 1,
      min: 1,
      max: 2
    })
    const zoom = new Zoom(bscroll)
    const zoomStartSpy = jest.spyOn(zoom, 'zoomStart')
    const zoomSpy = jest.spyOn(zoom, 'zoom')
    const zoomEndSpy = jest.spyOn(zoom, 'zoomEnd')

    const e = createTouchEvent({ pageX: 0, pageY: 0 })
    hooks.trigger('start', e)
    expect(zoomStartSpy).not.toHaveBeenCalled()

    hooks.trigger('beforeMove', e)
    expect(zoomSpy).not.toHaveBeenCalled()

    hooks.trigger('beforeEnd', e)
    expect(zoomEndSpy).not.toHaveBeenCalled()

    const transformStyle: string[] = []
    hooks.trigger('beforeTranslate', transformStyle, {})
    expect(transformStyle[0]).toBe('scale(1)')
    hooks.trigger('destroy')
    zoomStartSpy.mockRestore()
    zoomSpy.mockRestore()
    zoomEndSpy.mockRestore()
  })
  it('should have correct behavior when zooming out', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      start: 1,
      min: 1,
      max: 2
    })
    bscroll.x = 0
    bscroll.y = 0
    bscroll.scroller.scrollBehaviorX.startPos = 0
    bscroll.scroller.scrollBehaviorY.startPos = 0
    bscroll.options.bounceTime = 800
    const zoom = new Zoom(bscroll)
    const e = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 130, pageY: 130 }
    )
    hooks.trigger('start', e)

    const e2 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 150, pageY: 150 }
    )
    hooks.trigger('beforeMove', e2)
    expect(mockscrollTo).toBeCalledWith(-16, -16, 0, undefined, {
      start: {
        scale: 1
      },
      end: {
        scale: 1.2
      }
    })
    const transformString: string[] = []
    const transformPoint = {
      scale: 1.2
    }
    hooks.trigger('beforeTranslate', transformString, transformPoint)
    expect(transformString[0]).toBe('scale(1.2)')
    // resetBoundary should be right
    expect(bscroll.scroller.scrollBehaviorX.hasScroll).toBe(true)
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBeCloseTo(-60)
    expect(bscroll.scroller.scrollBehaviorY.hasScroll).toBe(true)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBeCloseTo(-60)

    const e3 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 170, pageY: 170 }
    )
    hooks.trigger('beforeMove', e3)
    transformPoint.scale = 1.4
    hooks.trigger('beforeTranslate', transformString, transformPoint)

    expect(mockscrollTo).toHaveBeenLastCalledWith(-32, -32, 0, undefined, {
      start: {
        scale: 1.2
      },
      end: {
        scale: 1.4
      }
    })
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBeCloseTo(-120)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBeCloseTo(-120)

    // zoom out bigger then max
    const e4 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 240, pageY: 240 }
    )
    hooks.trigger('beforeMove', e4)

    expect(mockscrollTo).lastCalledWith(-86, -86, 0, undefined, {
      start: {
        scale: 1.4
      },
      end: {
        scale: 2 * 2 * Math.pow(0.5, 2 / 2.1)
      }
    })
    expect(zoom.scale).toBeCloseTo(2.067)
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBe(-321)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBe(-321)

    transformPoint.scale = 2.1
    hooks.trigger('beforeTranslate', transformString, transformPoint)

    // zoom end
    hooks.trigger('beforeEnd', e4)
    expect(zoom.scale).toBe(2)
    expect(mockscrollTo).toHaveBeenLastCalledWith(-80, -80, 800, undefined, {
      start: {
        scale: 2.1
      },
      end: {
        scale: 2
      }
    })
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBeCloseTo(-300)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBeCloseTo(-300)

    hooks.trigger('destroy')
  })
  it('should have correct behavior when zooming in', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      start: 1,
      min: 0.5,
      max: 2
    })
    bscroll.x = 0
    bscroll.y = 0
    bscroll.scroller.scrollBehaviorX.startPos = 0
    bscroll.scroller.scrollBehaviorY.startPos = 0
    bscroll.options.bounceTime = 800
    const zoom = new Zoom(bscroll)
    const e = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 130, pageY: 130 }
    )
    hooks.trigger('start', e)

    const e2 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 110, pageY: 110 }
    )
    hooks.trigger('beforeMove', e2)
    expect(mockscrollTo).toBeCalledWith(16, 16, 0, undefined, {
      start: {
        scale: 1
      },
      end: {
        scale: 0.8
      }
    })
    const transformString: string[] = []
    const transformPoint = {
      scale: 0.8
    }
    hooks.trigger('beforeTranslate', transformString, transformPoint)
    expect(transformString[0]).toBe('scale(0.8)')
    // resetBoundary should be right
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(16)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(16)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBe(0)

    // zoom in smaller then min
    const e3 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 70, pageY: 70 }
    )
    hooks.trigger('beforeMove', e3)

    expect(mockscrollTo).lastCalledWith(45, 45, 0, undefined, {
      start: {
        scale: 0.8
      },
      end: {
        scale: 0.5 * 0.5 * Math.pow(2.0, 0.4 / 0.5)
      }
    })
    expect(zoom.scale).toBeCloseTo(0.435)
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(45)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(45)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBe(0)

    transformPoint.scale = 0.4
    hooks.trigger('beforeTranslate', transformString, transformPoint)

    // zoom end
    hooks.trigger('beforeEnd', e3)
    expect(zoom.scale).toBe(0.5)
    expect(mockscrollTo).toHaveBeenLastCalledWith(0, 0, 800, undefined, {
      start: {
        scale: 0.4
      },
      end: {
        scale: 0.5
      }
    })
    expect(bscroll.scroller.scrollBehaviorX.hasScroll).toBe(false)
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBeCloseTo(0)
    expect(bscroll.scroller.scrollBehaviorY.hasScroll).toBe(false)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBeCloseTo(0)

    hooks.trigger('destroy')
  })

  it('should have correct behavior for zoomTo', () => {
    const { bscroll, mockscrollTo } = createBScroll(hooks, {
      start: 1,
      min: 0.5,
      max: 2
    })
    bscroll.x = 0
    bscroll.y = 0
    bscroll.scroller.scrollBehaviorX.startPos = 0
    bscroll.scroller.scrollBehaviorY.startPos = 0
    bscroll.options.bounceTime = 800
    const zoom = new Zoom(bscroll)
    zoom.zoomTo(1.5, 10, 20)

    expect(zoom.scale).toBe(1.5)
    expect(mockscrollTo).toHaveBeenLastCalledWith(-5, -10, 800, undefined, {
      start: {
        scale: 1
      },
      end: {
        scale: 1.5
      }
    })
    expect(bscroll.scroller.scrollBehaviorX.hasScroll).toBe(true)
    expect(bscroll.scroller.scrollBehaviorX.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorX.maxScrollPos).toBe(-150)
    expect(bscroll.scroller.scrollBehaviorY.hasScroll).toBe(true)
    expect(bscroll.scroller.scrollBehaviorY.minScrollPos).toBe(0)
    expect(bscroll.scroller.scrollBehaviorY.maxScrollPos).toBe(-150)

    const transformString: string[] = []
    const transformPoint = {
      scale: 1.5
    }
    hooks.trigger('beforeTranslate', transformString, transformPoint)

    // zoomTo bigger than max
    zoom.zoomTo(3, 10, 20)
    expect(zoom.scale).toBe(2)
    transformPoint.scale = 2
    hooks.trigger('beforeTranslate', transformString, transformPoint)

    // change origin
    zoom.zoomTo(2, 0, 0)
    expect(mockscrollTo).lastCalledWith(0, 0, 800, undefined, {
      start: {
        scale: 2
      },
      end: {
        scale: 2
      }
    })

    // zoomTo zoomIn
    zoom.zoomTo(0.8, 0, 0)
    expect(mockscrollTo).lastCalledWith(0, 0, 800, undefined, {
      start: {
        scale: 2
      },
      end: {
        scale: 0.8
      }
    })
  })
})
