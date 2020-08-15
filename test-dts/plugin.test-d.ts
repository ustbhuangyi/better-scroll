import {
  expectType,
  expectError,
  expectAssignable,
  BScroll,
  Zoom,
  Wheel,
  Slide,
  ScrollBar,
  PullUp,
  PullDown,
  ObserveDom,
  NestedScroll,
  MouseWheel,
  ZoomConfig,
  WheelConfig,
  Config,
  MouseWheelOptions
} from './index'
import { DeepNonNullable } from './util'
import { SlideOptions } from '@better-scroll/slide/src'

describe('BScroll.use should be used normally', () => {
  // @ts-expect-error
  expectError(BScroll.use())
  // @ts-expect-error
  expectError(BScroll.use({}))
  // @ts-expect-error
  expectError(BScroll.use({ pluginName: 'pluginName' }))
  // @ts-expect-error
  expectError(BScroll.use(function() {}))
  // @ts-expect-error
  expectError(BScroll.use(class Plugin {}))
  expectError(
    BScroll.use(
      class Plugin {
        static pluginName = 'pluginName'
      }
    )
  )
})

describe('plugins option type shoule be inferred correctly', () => {
  const div = document.createElement('div')
  BScroll.use(Zoom)
  BScroll.use(Wheel)
  BScroll.use(Slide)
  BScroll.use(ScrollBar)
  BScroll.use(PullUp)
  BScroll.use(PullDown)
  BScroll.use(ObserveDom)
  BScroll.use(NestedScroll)
  BScroll.use(MouseWheel)
  const bscroll = new BScroll(div, {
    zoom: {
      max: 1,
      min: 1,
      start: 1
    },
    wheel: {
      selectedIndex: 1,
      rotate: 1,
      adjustTime: 1,
      wheelWrapperClass: 'wheelWrapperClass',
      wheelItemClass: 'wheelItemClass',
      wheelDisabledItemClass: 'wheelDisabledItemClass'
    },
    slide: {
      loop: true
    },
    scrollbar: true,
    pullUpLoad: true,
    pullDownRefresh: true,
    observeDOM: true,
    nestedScroll: true,
    mouseWheel: {
      speed: 1,
      invert: true,
      easeTime: 1,
      throttle: 1,
      debounce: 1
    }
  })
  bscroll.options.slide
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  // zoom
  expectType<ZoomConfig, BSOptions['zoom']>()
  expectType<number, NonNullable<BSOptions['zoom']['max']>>()
  expectType<number, NonNullable<BSOptions['zoom']['min']>>()
  expectType<number, NonNullable<BSOptions['zoom']['start']>>()
  // whell
  expectType<WheelConfig, BSOptions['wheel']>()
  expectType<number, NonNullable<BSOptions['wheel']['rotate']>>()
  expectType<number, NonNullable<BSOptions['wheel']['adjustTime']>>()
  expectType<
    string,
    NonNullable<BSOptions['wheel']['wheelDisabledItemClass']>
  >()
  expectType<string, NonNullable<BSOptions['wheel']['wheelItemClass']>>()
  expectType<string, NonNullable<BSOptions['wheel']['wheelWrapperClass']>>()
  // slider
  // type NonBoolean<T> = T extends
  expectType<SlideOptions, BSOptions['slide']>()
  //scrollBar
  expectAssignable<boolean, BSOptions['scrollbar']>()
  //pullUp
  expectAssignable<boolean, BSOptions['pullUpLoad']>()
  //pullDown
  expectAssignable<boolean, BSOptions['pullDownRefresh']>()
  //observeDOM
  expectType<boolean, BSOptions['observeDOM']>()
  //nestedScroll
  expectType<true, BSOptions['nestedScroll']>()
  // mouseWheel
  expectType<MouseWheelOptions, BSOptions['mouseWheel']>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['debounce']>>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['easeTime']>>()
  expectType<boolean, NonNullable<BSOptions['mouseWheel']['invert']>>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['speed']>>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['throttle']>>()
})
