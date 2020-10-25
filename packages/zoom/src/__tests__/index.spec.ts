import BScroll from '@better-scroll/core'
import Zoom from '../index'
import { ease } from '@better-scroll/shared-utils'
import { createTouchEvent, createZoomElements } from './__utils__/util'
jest.mock('@better-scroll/core')
jest.mock('@better-scroll/core/src/animater/index')

describe('zoom plugin', () => {
  let scroll: BScroll

  beforeEach(() => {
    // create DOM
    const { wrapper } = createZoomElements()
    scroll = new BScroll(wrapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should proxy properties to BScroll instance', () => {
    new Zoom(scroll)

    expect(scroll.proxy).toBeCalled()
    expect(scroll.proxy).toHaveBeenLastCalledWith([
      {
        key: 'zoomTo',
        sourceKey: 'plugins.zoom.zoomTo',
      },
    ])
  })

  it('should register hooks to BScroll instance', () => {
    new Zoom(scroll)

    expect(scroll.registerType).toBeCalled()
    expect(scroll.registerType).toHaveBeenLastCalledWith([
      'beforeZoomStart',
      'zoomStart',
      'zooming',
      'zoomEnd',
    ])
    expect(scroll.eventTypes.beforeZoomStart).toEqual('beforeZoomStart')
    expect(scroll.eventTypes.zoomStart).toEqual('zoomStart')
  })

  it('should handle default options and user options', () => {
    // case 1
    scroll.options.zoom = true
    let zoom = new Zoom(scroll)
    expect(zoom.zoomOpt).toMatchObject({
      start: 1,
      min: 1,
      max: 4,
      initialOrigin: [0, 0],
      minimalZoomDistance: 5,
      bounceTime: 800,
    })

    // case 2
    scroll.options.zoom = {
      initialOrigin: ['center', 'center'],
      bounceTime: 300,
    }
    zoom = new Zoom(scroll)
    expect(zoom.zoomOpt).toMatchObject({
      start: 1,
      min: 1,
      max: 4,
      initialOrigin: ['center', 'center'],
      minimalZoomDistance: 5,
      bounceTime: 300,
    })
  })

  it('should try initialZoomTo when new zoom()', () => {
    // start is 1, no zoomTo
    new Zoom(scroll)
    expect(scroll.scroller.scrollTo).toBeCalledTimes(0)

    // start !== 1
    scroll.options.zoom = {
      start: 1.5,
      initialOrigin: [0, 0],
    }
    new Zoom(scroll)
    expect(scroll.scroller.scrollTo).toBeCalledTimes(1)
    expect(scroll.scroller.scrollTo).toHaveBeenLastCalledWith(
      0,
      0,
      0,
      ease.bounce,
      {
        start: {
          scale: 1,
        },
        end: {
          scale: 1.5,
        },
      }
    )

    // start should <= max
    scroll.options.zoom = {
      start: 3.5,
      max: 3,
      initialOrigin: [0, 0],
    }
    new Zoom(scroll)
    expect(scroll.scroller.scrollTo).toBeCalledTimes(2)
    expect(scroll.scroller.scrollTo).toHaveBeenLastCalledWith(
      0,
      0,
      0,
      ease.bounce,
      {
        start: {
          scale: 1,
        },
        end: {
          scale: 3, // equals max
        },
      }
    )
  })

  it("should set scaled element's transform origin", () => {
    new Zoom(scroll)
    expect(scroll.scroller.content.style['transform-origin' as any]).toBe('0 0')
  })

  it('should not response with one finger', () => {
    const zoom = new Zoom(scroll)
    const hooks = scroll.scroller.actions.hooks

    const zoomStartSpy = jest.spyOn(zoom, 'zoomStart')
    const zoomSpy = jest.spyOn(zoom, 'zoom')
    const zoomEndSpy = jest.spyOn(zoom, 'zoomEnd')

    const e = createTouchEvent({ pageX: 0, pageY: 0 })
    hooks.trigger(hooks.eventTypes.start, e)
    expect(zoomStartSpy).not.toHaveBeenCalled()

    hooks.trigger(hooks.eventTypes.beforeMove, e)
    expect(zoomSpy).not.toHaveBeenCalled()

    hooks.trigger(hooks.eventTypes.beforeEnd, e)
    expect(zoomEndSpy).not.toHaveBeenCalled()
  })

  it('should compute boundary of Behavior when zoom ends', () => {
    const zoom = new Zoom(scroll) as any

    // simulate two fingers
    zoom.numberOfFingers = 2
    // allow trigger beforeEnd hooks
    zoom.zoomed = true

    const e = createTouchEvent({ pageX: 0, pageY: 0 }, { pageX: 20, pageY: 20 })
    const actions = scroll.scroller.actions
    const behaviorX = scroll.scroller.scrollBehaviorX
    const behaviorY = scroll.scroller.scrollBehaviorY
    behaviorX.checkInBoundary = jest.fn().mockImplementation(() => {
      return { inBoundary: true }
    })
    behaviorY.checkInBoundary = jest.fn().mockImplementation(() => {
      return { inBoundary: true }
    })
    actions.hooks.trigger(actions.hooks.eventTypes.beforeEnd, e)

    expect(behaviorX.computeBoundary).toHaveBeenCalled()
    expect(behaviorY.computeBoundary).toHaveBeenCalled()

    // we should zoomed before call zoomEnd
    zoom.zoomed = false
    actions.hooks.trigger(actions.hooks.eventTypes.beforeEnd, e)
    expect(behaviorX.computeBoundary).toBeCalledTimes(1)
  })

  it('should fail when zooming distance < minimalZoomDistance', () => {
    scroll.options.zoom = {
      minimalZoomDistance: 10,
    }
    new Zoom(scroll)
    const actions = scroll.scroller.actions
    const mockZoomingFn = jest.fn()
    scroll.on(scroll.eventTypes.zooming, mockZoomingFn)
    // zoomStart
    const e = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 130, pageY: 130 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.start, e)
    // zoom
    const e2 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 135, pageY: 135 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.beforeMove, e2)
    expect(mockZoomingFn).toHaveBeenCalledTimes(0)
  })

  it('should have correct behavior when zooming out', () => {
    scroll.options.zoom = {
      max: 2,
    }
    const zoom = new Zoom(scroll)
    const actions = scroll.scroller.actions
    const translater = scroll.scroller.translater
    const mockZoomingFn = jest.fn()
    scroll.on(scroll.eventTypes.zooming, mockZoomingFn)

    // zoomStart
    const e = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 130, pageY: 130 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.start, e)
    // zoom
    const e2 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 150, pageY: 150 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.beforeMove, e2)

    // triggered zooming hooks
    expect(mockZoomingFn).toHaveBeenCalled()
    expect(mockZoomingFn).toHaveBeenCalledTimes(1)
    // beforeMove hooks use translater.translate, not scroller.scrollTo
    expect(scroll.scroller.translater.translate).toBeCalledWith({
      x: -16,
      y: -16,
      scale: 1.2,
    })
    expect(zoom.scale).toBe(1.2)
    // triggered beforeTranslate hooks
    const transformString: string[] = []
    const transformPoint = {
      scale: 1.2,
    }
    translater.hooks.trigger(
      translater.hooks.eventTypes.beforeTranslate,
      transformString,
      transformPoint
    )
    expect(transformString[0]).toBe('scale(1.2)')

    // keep zoom
    const e3 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 170, pageY: 170 }
    )
    actions.hooks.trigger('beforeMove', e3)
    // triggered zooming hooks
    expect(mockZoomingFn).toHaveBeenCalledTimes(2)

    expect(scroll.scroller.translater.translate).toHaveBeenLastCalledWith({
      x: -32,
      y: -32,
      scale: 1.4,
    })
    expect(zoom.scale).toBe(1.4)

    // keep zoom, allow zooming exceeds max
    const e4 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 240, pageY: 240 }
    )
    actions.hooks.trigger('beforeMove', e4)
    // triggered zooming hooks
    expect(mockZoomingFn).toHaveBeenCalledTimes(3)

    expect(scroll.scroller.translater.translate).toHaveBeenLastCalledWith({
      x: -85,
      y: -85,
      scale: 2 * 2 * Math.pow(0.5, 2 / 2.1),
    })
    expect(zoom.scale).toBeCloseTo(2.067)

    // zoom end, perform a rebound animation,back to max scale
    actions.hooks.trigger('beforeEnd')
    expect(zoom.scale).toBe(2)
    expect(scroll.scroller.scrollTo).toHaveBeenLastCalledWith(
      0,
      0,
      800,
      ease.bounce,
      {
        start: {
          scale: 2.0671155660140554,
        },
        end: {
          scale: 2,
        },
      }
    )
  })

  it('should have correct behavior when zooming in', () => {
    scroll.options.zoom = {
      min: 0.5,
    }
    const zoom = new Zoom(scroll)
    const actions = scroll.scroller.actions
    const translater = scroll.scroller.translater
    const mockZoomingFn = jest.fn()
    scroll.on(scroll.eventTypes.zooming, mockZoomingFn)

    // zoomStart
    const e = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 130, pageY: 130 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.start, e)
    // zoom
    const e2 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 110, pageY: 110 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.beforeMove, e2)

    // triggered zooming hooks
    expect(mockZoomingFn).toHaveBeenCalled()
    expect(mockZoomingFn).toHaveBeenCalledTimes(1)
    // beforeMove hooks use translater.translate, not scroller.scrollTo
    expect(scroll.scroller.translater.translate).toBeCalledWith({
      x: 16,
      y: 16,
      scale: 0.8,
    })
    expect(zoom.scale).toBe(0.8)
    // triggered beforeTranslate hooks
    const transformString: string[] = []
    const transformPoint = {
      scale: 0.8,
    }
    translater.hooks.trigger(
      translater.hooks.eventTypes.beforeTranslate,
      transformString,
      transformPoint
    )
    expect(transformString[0]).toBe('scale(0.8)')

    // keep zoom
    const e3 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 90, pageY: 90 }
    )
    actions.hooks.trigger('beforeMove', e3)
    // triggered zooming hooks
    expect(mockZoomingFn).toHaveBeenCalledTimes(2)

    expect(scroll.scroller.translater.translate).toHaveBeenLastCalledWith({
      x: 32,
      y: 32,
      scale: 0.6,
    })
    expect(zoom.scale).toBe(0.6)

    // keep zoom, allow zooming exceeds max
    const e4 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 40, pageY: 40 }
    )
    actions.hooks.trigger('beforeMove', e4)
    // triggered zooming hooks
    expect(mockZoomingFn).toHaveBeenCalledTimes(3)

    expect(scroll.scroller.translater.translate).toHaveBeenLastCalledWith({
      x: 57,
      y: 57,
      scale: 0.5 * 0.5 * Math.pow(2, 0.1 / 0.5),
    })
    expect(zoom.scale).toBeCloseTo(0.287)

    // zoom end, perform a rebound animation,back to max scale
    actions.hooks.trigger('beforeEnd')
    expect(zoom.scale).toBe(0.5)
    expect(scroll.scroller.scrollTo).toHaveBeenLastCalledWith(
      0,
      0,
      800,
      ease.bounce,
      {
        start: {
          scale: 0.2871745887492588,
        },
        end: {
          scale: 0.5,
        },
      }
    )
  })

  it('should have correct behavior for zoomTo', (done) => {
    scroll.options.zoom = {
      min: 0.5,
      max: 3,
      start: 1,
    }
    const zoom = new Zoom(scroll)
    const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller
    scrollBehaviorX.contentSize = 100
    scrollBehaviorY.contentSize = 100
    scrollBehaviorX.wrapperSize = 100
    scrollBehaviorY.wrapperSize = 100

    // [0, 0] as origin, scale to 2
    zoom.zoomTo(2, 0, 0)
    expect(scroll.scroller.scrollTo).toHaveBeenCalledWith(
      0,
      0,
      800,
      ease.bounce,
      {
        start: {
          scale: 1,
        },
        end: {
          scale: 2,
        },
      }
    )

    // ['center', 'center'] as origin, time is 300, scale to 1.5
    zoom.zoomTo(1.5, 'center', 'center', 300)
    expect(scroll.scroller.scrollTo).toHaveBeenCalledWith(
      0,
      0,
      300,
      ease.bounce,
      {
        start: {
          scale: 2,
        },
        end: {
          scale: 1.5,
        },
      }
    )

    // ['left', 'top'] as origin, time is 300, scale to 3
    zoom.zoomTo(3, 'left', 'top', 300)
    expect(scroll.scroller.scrollTo).toHaveBeenCalledWith(
      0,
      0,
      300,
      ease.bounce,
      {
        start: {
          scale: 1.5,
        },
        end: {
          scale: 3,
        },
      }
    )

    // ['right', 'bottom'] as origin, time is 300, scale to 3
    zoom.zoomTo(2, 'right', 'bottom', 300)
    expect(scroll.scroller.scrollTo).toHaveBeenCalledWith(
      0,
      0,
      300,
      ease.bounce,
      {
        start: {
          scale: 3,
        },
        end: {
          scale: 2,
        },
      }
    )
    // The purpose for improving test coverage
    setTimeout(() => {
      done()
    }, 320)
  })

  it('should support full hooks', () => {
    scroll.options.zoom = {
      min: 1,
      start: 1,
      max: 4,
    }
    new Zoom(scroll)
    const actions = scroll.scroller.actions
    const behaviorX = scroll.scroller.scrollBehaviorX
    const behaviorY = scroll.scroller.scrollBehaviorY
    behaviorX.checkInBoundary = jest.fn().mockImplementation(() => {
      return { inBoundary: true }
    })
    behaviorY.checkInBoundary = jest.fn().mockImplementation(() => {
      return { inBoundary: true }
    })

    const mockBeforeZoomStartFn = jest.fn()
    const mockZoomStartFn = jest.fn()
    const mockZoomingFn = jest.fn()
    const mockZoomEndFn = jest.fn()

    // tap hooks
    scroll.on(scroll.eventTypes.beforeZoomStart, mockBeforeZoomStartFn)
    scroll.on(scroll.eventTypes.zoomStart, mockZoomStartFn)
    scroll.on(scroll.eventTypes.zooming, mockZoomingFn)
    scroll.on(scroll.eventTypes.zoomEnd, mockZoomEndFn)

    // zoomStart
    const e1 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 130, pageY: 130 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.start, e1)
    // zooming
    const e2 = createTouchEvent(
      { pageX: 30, pageY: 30 },
      { pageX: 150, pageY: 150 }
    )
    actions.hooks.trigger(actions.hooks.eventTypes.beforeMove, e2)
    // zoomEnd
    actions.hooks.trigger(actions.hooks.eventTypes.beforeEnd)

    expect(mockBeforeZoomStartFn).toBeCalledTimes(1)
    expect(mockZoomStartFn).toBeCalledTimes(1)
    expect(mockZoomingFn).toBeCalledTimes(1)
    expect(mockZoomEndFn).toBeCalledTimes(1)
  })

  it('should destroy all events', () => {
    new Zoom(scroll)
    const {
      actions,
      scrollBehaviorX,
      scrollBehaviorY,
      translater,
    } = scroll.scroller
    scroll.hooks.trigger(scroll.hooks.eventTypes.destroy)
    expect(scrollBehaviorX.hooks.events['beforeComputeBoundary'].length).toBe(0)
    expect(scrollBehaviorY.hooks.events['beforeComputeBoundary'].length).toBe(0)
    expect(actions.hooks.events['start'].length).toBe(0)
    expect(actions.hooks.events['beforeMove'].length).toBe(0)
    expect(actions.hooks.events['beforeEnd'].length).toBe(0)
    expect(translater.hooks.events['beforeTranslate'].length).toBe(0)
  })

  it('should work well when content DOM has changed', () => {
    const zoom = new Zoom(scroll)
    const newContent = document.createElement('p')
    scroll.hooks.trigger(scroll.hooks.eventTypes.contentChanged, newContent)

    expect(zoom.scale).toBe(1)
    expect(newContent.style['transform-origin' as any]).toBe('0 0')
  })

  it('should prevent initial scroll when startScale not equals 1', () => {
    const { wrapper } = createZoomElements()
    scroll = new BScroll(wrapper, {
      zoom: {
        start: 2,
      },
    })
    new Zoom(scroll)
    const ret = scroll.hooks.trigger(
      scroll.hooks.eventTypes.beforeInitialScrollTo
    )

    expect(ret).toBeTruthy()
  })

  it('should calculate right size when scrollBehavior triggered beforeComputeBoundary hook', () => {
    const zoom = new Zoom(scroll)
    zoom.scale = 1.2
    const scrollBehaviorX = scroll.scroller.scrollBehaviorX
    const scrollBehaviorY = scroll.scroller.scrollBehaviorY
    scrollBehaviorX.hooks.trigger(
      scrollBehaviorX.hooks.eventTypes.beforeComputeBoundary
    )
    scrollBehaviorY.hooks.trigger(
      scrollBehaviorY.hooks.eventTypes.beforeComputeBoundary
    )

    expect(scrollBehaviorX.contentSize).toBe(360)
    expect(scrollBehaviorY.contentSize).toBe(360)
  })

  it('should dispatch scrollEnd event when two fingers make bs scroll', () => {
    new Zoom(scroll)
    let endScale

    scroll.scroller.actions.hooks.trigger(
      scroll.scroller.actions.hooks.eventTypes.start,
      {
        touches: [
          {
            pageX: 1,
            pageY: 1,
          },
          {
            pageX: 2,
            pageY: 2,
          },
        ],
      }
    )

    scroll.on(scroll.eventTypes.zoomEnd, ({ scale }: { scale: number }) => {
      endScale = scale
    })

    scroll.scroller.hooks.trigger(scroll.scroller.hooks.eventTypes.scrollEnd)

    expect(endScale).toBe(1)
  })
})
