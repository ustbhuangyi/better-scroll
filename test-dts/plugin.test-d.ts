import {
  expectType,
  expectError,
  expectAssignable,
  expectFuncArguments,
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

describe('zoom plugin option type shoule be inferred correctly', () => {
  BScroll.use(Zoom)
  const bscroll = createBScroll('', {
    zoom: {
      max: 1,
      min: 1,
      start: 1
    }
  })
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<ZoomConfig>, BSOptions['zoom']>()
  expectType<number, FilterUndef<BSOptions['zoom']['max']>>()
  expectType<number, FilterUndef<BSOptions['zoom']['min']>>()
  expectType<number, FilterUndef<BSOptions['zoom']['start']>>()
})

describe('whell plugin option type shoule be inferred correctly', () => {
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
})

describe('slider plugin option type shoule be inferred correctly', () => {
  BScroll.use(Slide)
  const bscroll = createBScroll('', {
    slide: {
      loop: true
    }
  })
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
})

describe('scrollBar plugin option type shoule be inferred correctly', () => {
  BScroll.use(ScrollBar)
  const bscroll = new BScroll('', {
    scrollbar: {
      fade: true,
      interactive: true
    }
  })
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
})

describe('pullUp plugin option type shoule be inferred correctly', () => {
  BScroll.use(PullUp)
  const bscroll = new BScroll('', {
    pullUpLoad: true
  })
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
})

describe('pullDown plugin option type shoule be inferred correctly', () => {
  BScroll.use(PullDown)
  const bscroll = new BScroll('', {
    pullDownRefresh: {
      threshold: 1,
      stop: 1
    }
  })
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
})

describe('observeDom plugin option type shoule be inferred correctly', () => {
  BScroll.use(ObserveDom)
  const bscroll = new BScroll('', {
    observeDOM: true
  })
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<boolean, BSOptions['observeDOM']>()
})

describe('nestedScroll plugin option type shoule be inferred correctly', () => {
  BScroll.use(NestedScroll)
  const bscroll = new BScroll('', {
    nestedScroll: true
  })
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<true, BSOptions['nestedScroll']>()
})

describe('mouseWhell plugin option type shoule be inferred correctly', () => {
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

  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectType<Partial<MouseWheelOptions>, BSOptions['mouseWheel']>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['discreteTime']>>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['easeTime']>>()
  expectType<boolean, FilterUndef<BSOptions['mouseWheel']['invert']>>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['speed']>>()
  expectType<number, FilterUndef<BSOptions['mouseWheel']['throttleTime']>>()
})
