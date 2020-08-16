import {
  expectType,
  expectError,
  expectAssignable,
  expectFuncArguments,
  expectFuncReturnValue,
  ArgumentsCheck,
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
  Config,
  MouseWheelOptions,
  scrollbarOptions,
  ScrollbarConfig,
  PullUpLoadOptions,
  PullUpLoadConfig,
  PullDownRefreshOptions,
  PullDownRefreshConfig
} from './index'
import { DeepNonNullable, FilterType, FilterUndef, FilterBoolean } from './util'
import { EaseItem } from '@better-scroll/shared-utils/src'
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

describe('zoom plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Zoom)
  const bscroll = createBScroll('', {
    zoom: {
      max: 1,
      min: 1,
      start: 1
    }
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<ZoomConfig>, BSOptions['zoom']>()
  expectType<number, FilterUndef<BSOptions['zoom']['max']>>()
  expectType<number, FilterUndef<BSOptions['zoom']['min']>>()
  expectType<number, FilterUndef<BSOptions['zoom']['start']>>()
  // API
  type ZoomToAPI = typeof bscroll.zoomTo
  type OriginX = number | 'left' | 'right' | 'center'
  type OriginY = number | 'top' | 'bottom' | 'center'
  expectFuncArguments<
    [number, OriginX, OriginY, (number | undefined)?],
    ZoomToAPI
  >()
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
      wheelDisabledItemClass: 'wheelDisabledItemClass'
    }
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<WheelConfig>, BSOptions['wheel']>()
  expectType<number, FilterUndef<BSOptions['wheel']['rotate']>>()
  expectType<number, FilterUndef<BSOptions['wheel']['adjustTime']>>()
  expectType<
    string,
    FilterUndef<BSOptions['wheel']['wheelDisabledItemClass']>
  >()
  expectType<string, FilterUndef<BSOptions['wheel']['wheelItemClass']>>()
  expectType<string, FilterUndef<BSOptions['wheel']['wheelWrapperClass']>>()
  //API
  type WhellToAPI = typeof bscroll.wheelTo
  type GetSelectedIndexAPI = typeof bscroll.getSelectedIndex
  expectFuncArguments<
    [(number | undefined)?, (number | undefined)?, (EaseItem | undefined)?],
    WhellToAPI
  >()
  expectFuncReturnValue<number, GetSelectedIndexAPI>()
})

describe('slider plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Slide)
  const bscroll = createBScroll('', {
    slide: {
      loop: true
    }
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  type EaseType = {
    style: string
    fn: (t: number) => number
  }
  expectType<Partial<Config>, FilterBoolean<BSOptions['slide']>>()
  expectType<boolean, FilterType<BSOptions['slide'], Partial<Config>>>()
  expectType<boolean, FilterUndef<FilterBoolean<BSOptions['slide']>['loop']>>()
  expectType<
    HTMLElement | string,
    FilterUndef<FilterBoolean<BSOptions['slide']>['el']>
  >()
  expectType<
    number,
    FilterUndef<FilterBoolean<BSOptions['slide']>['threshold']>
  >()
  expectType<number, FilterUndef<FilterBoolean<BSOptions['slide']>['stepX']>>()
  expectType<number, FilterUndef<FilterBoolean<BSOptions['slide']>['stepY']>>()
  expectType<number, FilterUndef<FilterBoolean<BSOptions['slide']>['speed']>>()
  expectType<
    EaseType,
    FilterUndef<FilterBoolean<BSOptions['slide']>['easing']>
  >()
  expectType<
    boolean,
    FilterUndef<FilterBoolean<BSOptions['slide']>['listenFlick']>
  >()
  expectType<
    boolean,
    FilterUndef<FilterBoolean<BSOptions['slide']>['disableSetWidth']>
  >()
  expectType<
    boolean,
    FilterUndef<FilterBoolean<BSOptions['slide']>['disableSetHeight']>
  >()
  // API
  type BS = typeof bscroll
  type Page = {
    pageX: number
    pageY: number
  }
  expectFuncArguments<
    [(number | undefined)?, (EaseItem | undefined)?],
    BS['next']
  >()
  expectFuncArguments<
    [(number | undefined)?, (EaseItem | undefined)?],
    BS['prev']
  >()
  expectFuncArguments<
    [number, number, (number | undefined)?, (EaseItem | undefined)?],
    BS['goToPage']
  >()
  expectFuncReturnValue<Page, BS['getCurrentPage']>()
})

describe('scrollBar plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(ScrollBar)
  const bscroll = new BScroll('', {
    scrollbar: {
      fade: true,
      interactive: true
    }
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
    pullUpLoad: true
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
  expectFuncArguments<
    [(boolean | Partial<PullUpLoadConfig> | undefined)?],
    BS['openPullUp']
  >()
  expectFuncArguments<[], BS['closePullUp']>()
})

describe('pullDown plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(PullDown)
  const bscroll = new BScroll('', {
    pullDownRefresh: {
      threshold: 1,
      stop: 1
    }
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<PullDownRefreshOptions, BSOptions['pullDownRefresh']>()
  expectType<
    boolean,
    FilterType<BSOptions['pullDownRefresh'], Partial<PullDownRefreshConfig>>
  >()
  expectType<
    Partial<PullDownRefreshConfig>,
    FilterBoolean<BSOptions['pullDownRefresh']>
  >()
  expectType<
    number,
    FilterUndef<FilterBoolean<BSOptions['pullDownRefresh']>['stop']>
  >()
  expectType<
    number,
    FilterUndef<FilterBoolean<BSOptions['pullDownRefresh']>['threshold']>
  >()
  // API
  type BS = typeof bscroll
  expectFuncArguments<[], BS['finishPullDown']>()
  expectFuncArguments<
    [(boolean | Partial<PullDownRefreshConfig> | undefined)?],
    BS['openPullDown']
  >()
  expectFuncArguments<[], BS['closePullDown']>()
  expectFuncArguments<[], BS['autoPullDownRefresh']>()
})

describe('observeDom plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(ObserveDom)
  const bscroll = new BScroll('', {
    observeDOM: true
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<boolean, BSOptions['observeDOM']>()
})

describe('nestedScroll plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(NestedScroll)
  const bscroll = new BScroll('', {
    nestedScroll: true
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<true, BSOptions['nestedScroll']>()
})

describe('mouseWhell plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(MouseWheel)
  const bscroll = new BScroll('', {
    mouseWheel: {
      speed: 1,
      invert: true,
      easeTime: 1,
      throttle: 1,
      debounce: 1
    }
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<MouseWheelOptions>, BSOptions['mouseWheel']>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['discreteTime']>>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['easeTime']>>()
  expectType<boolean, FilterUndef<BSOptions['mouseWheel']['invert']>>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['speed']>>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['throttleTime']>>()
})

describe('movable plugin options and api type shoule be inferred correctly', () => {
  BScroll.use(Movable)
  const bscroll = new BScroll('', {
    movable: true
  })
  // Options
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<boolean, FilterUndef<BSOptions['movable']>>()
})
