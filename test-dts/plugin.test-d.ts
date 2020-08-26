import {
  expectType,
  expectError,
  expectFuncArguments,
  expectFuncReturnValue,
  BScroll,
  createBScroll,
  Zoom,
  Wheel,
  Slide,
  ScrollBar,
  PullUp,
  PullDown,
  ObserveDom,
  NestedScroll,
  MouseWheel,
  Movable,
  ZoomConfig,
  WheelConfig,
  SlideConfig,
  MouseWheelOptions,
  scrollbarOptions,
  ScrollbarConfig,
  PullUpLoadOptions,
  PullUpLoadConfig,
  PullDownRefreshOptions,
  PullDownRefreshConfig,
} from './index'
import {
  DeepNonNullable,
  FilterType,
  FilterUndef,
  FilterBoolean,
  ExcludeTrue,
} from './util'
import { EaseItem } from '@better-scroll/shared-utils/src'
describe('BScroll.use should be used normally', () => {
  // @ts-expect-error
  expectError(BScroll.use())
  // @ts-expect-error
  expectError(BScroll.use({}))
  // @ts-expect-error
  expectError(BScroll.use({ pluginName: 'pluginName' }))
  // @ts-expect-error
  expectError(BScroll.use(function () {}))
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

describe('zoom plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Zoom)
  const bscroll = createBScroll('', {
    zoom: {
      max: 1,
      min: 1,
      start: 1,
      initialOrigin: ['left', 'top'],
      minimalZoomDistance: 5,
      bounceTime: 800,
    },
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<ZoomConfig> | true, BSOptions['zoom']>()
  expectType<number, FilterUndef<ExcludeTrue<BSOptions['zoom']>['max']>>()
  expectType<number, FilterUndef<ExcludeTrue<BSOptions['zoom']>['min']>>()
  expectType<number, FilterUndef<ExcludeTrue<BSOptions['zoom']>['start']>>()
  expectType<
    [OriginX, OriginY],
    FilterUndef<ExcludeTrue<BSOptions['zoom']>['initialOrigin']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['zoom']>['minimalZoomDistance']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['zoom']>['bounceTime']>
  >()
  // API
  type ZoomToAPI = typeof bscroll.zoomTo
  type OriginX = number | 'left' | 'right' | 'center'
  type OriginY = number | 'top' | 'bottom' | 'center'
  expectFuncArguments<[number, OriginX, OriginY, number?], ZoomToAPI>()
})

describe('whell plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Wheel)
  const bscroll = new BScroll('', {
    wheel: {
      selectedIndex: 1,
      rotate: 1,
      adjustTime: 1,
      wheelWrapperClass: 'wheelWrapperClass',
      wheelItemClass: 'wheelItemClass',
      wheelDisabledItemClass: 'wheelDisabledItemClass',
    },
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<WheelConfig> | true, BSOptions['wheel']>()
  expectType<number, FilterUndef<ExcludeTrue<BSOptions['wheel']>['rotate']>>()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['wheel']>['adjustTime']>
  >()
  expectType<
    string,
    FilterUndef<ExcludeTrue<BSOptions['wheel']>['wheelWrapperClass']>
  >()
  expectType<
    string,
    FilterUndef<ExcludeTrue<BSOptions['wheel']>['wheelItemClass']>
  >()
  expectType<
    string,
    FilterUndef<ExcludeTrue<BSOptions['wheel']>['wheelDisabledItemClass']>
  >()
  // API
  type WhellToAPI = typeof bscroll.wheelTo
  type GetSelectedIndexAPI = typeof bscroll.getSelectedIndex
  expectFuncArguments<[number?, number?, EaseItem?], WhellToAPI>()
  expectFuncReturnValue<number, GetSelectedIndexAPI>()
})

describe('slider plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Slide)
  const bscroll = createBScroll('', {
    slide: {
      loop: true,
    },
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  type EaseType = {
    style: string
    fn: (t: number) => number
  }
  expectType<Partial<SlideConfig>, FilterBoolean<BSOptions['slide']>>()
  expectType<boolean, FilterType<BSOptions['slide'], Partial<SlideConfig>>>()
  expectType<boolean, FilterUndef<FilterBoolean<BSOptions['slide']>['loop']>>()
  expectType<
    number,
    FilterUndef<FilterBoolean<BSOptions['slide']>['threshold']>
  >()
  expectType<number, FilterUndef<FilterBoolean<BSOptions['slide']>['speed']>>()
  expectType<
    EaseType,
    FilterUndef<FilterBoolean<BSOptions['slide']>['easing']>
  >()
  expectType<
    boolean,
    FilterUndef<FilterBoolean<BSOptions['slide']>['listenFlick']>
  >()
  // API
  type BS = typeof bscroll
  type Page = {
    pageX: number
    pageY: number
  }
  expectFuncArguments<[number?, EaseItem?], BS['next']>()
  expectFuncArguments<[number?, EaseItem?], BS['prev']>()
  expectFuncArguments<[number, number, number?, EaseItem?], BS['goToPage']>()
  expectFuncReturnValue<Page, BS['getCurrentPage']>()
})

describe('scrollBar plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(ScrollBar)
  const bscroll = new BScroll('', {
    scrollbar: {
      fade: true,
      interactive: true,
    },
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<scrollbarOptions, BSOptions['scrollbar']>()
  expectType<
    boolean,
    FilterType<BSOptions['scrollbar'], Partial<ScrollbarConfig>>
  >()
  expectType<Partial<ScrollbarConfig>, FilterBoolean<BSOptions['scrollbar']>>()
  expectType<
    boolean,
    FilterUndef<FilterBoolean<BSOptions['scrollbar']>['fade']>
  >()
  expectType<
    boolean,
    FilterUndef<FilterBoolean<BSOptions['scrollbar']>['interactive']>
  >()
  // API
})

describe('pullUp plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(PullUp)
  const bscroll = new BScroll('', {
    pullUpLoad: true,
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<PullUpLoadOptions, BSOptions['pullUpLoad']>()
  expectType<
    boolean,
    FilterType<BSOptions['pullUpLoad'], Partial<PullUpLoadConfig>>
  >()
  expectType<
    number,
    FilterUndef<FilterBoolean<BSOptions['pullUpLoad']>['threshold']>
  >()
  // API
  type BS = typeof bscroll
  expectFuncArguments<[], BS['finishPullUp']>()
  expectFuncArguments<[(true | Partial<PullUpLoadConfig>)?], BS['openPullUp']>()
  expectFuncArguments<[], BS['closePullUp']>()
})

describe('pullDown plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(PullDown)
  const bscroll = new BScroll('', {
    pullDownRefresh: {
      threshold: 1,
      stop: 1,
    },
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<PullDownRefreshOptions | true, BSOptions['pullDownRefresh']>()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['pullDownRefresh']>['threshold']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['pullDownRefresh']>['stop']>
  >()
  // API
  type BS = typeof bscroll
  expectFuncArguments<[], BS['finishPullDown']>()
  expectFuncArguments<
    [(true | Partial<PullDownRefreshConfig>)?],
    BS['openPullDown']
  >()
  expectFuncArguments<[], BS['closePullDown']>()
  expectFuncArguments<[], BS['autoPullDownRefresh']>()
})

describe('observeDom plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(ObserveDom)
  const bscroll = new BScroll('', {
    observeDOM: true,
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<boolean, BSOptions['observeDOM']>()
})

describe('nestedScroll plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(NestedScroll)
  const bscroll = new BScroll('', {
    nestedScroll: true,
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<true, BSOptions['nestedScroll']>()
})

describe('mouseWheel plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(MouseWheel)
  const bscroll = new BScroll('', {
    mouseWheel: {
      speed: 1,
      invert: true,
      easeTime: 1,
      discreteTime: 1,
      throttleTime: 1,
      dampingFactor: 0.1,
    },
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<MouseWheelOptions> | true, BSOptions['mouseWheel']>()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['mouseWheel']>['speed']>
  >()
  expectType<
    boolean,
    FilterUndef<ExcludeTrue<BSOptions['mouseWheel']>['invert']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['mouseWheel']>['easeTime']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['mouseWheel']>['discreteTime']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['mouseWheel']>['throttleTime']>
  >()
  expectType<
    number,
    FilterUndef<ExcludeTrue<BSOptions['mouseWheel']>['dampingFactor']>
  >()
})

describe('movable plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Movable)
  const bscroll = new BScroll('', {
    movable: true,
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<boolean, FilterUndef<BSOptions['movable']>>()
})
