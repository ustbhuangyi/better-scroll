import {
  expectType,
  expectError,
  expectAssignable,
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
  MouseWheelOptions
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
    scrollbar: true
  })
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectAssignable<boolean, BSOptions['scrollbar']>()
})

describe('pullUp plugin option type shoule be inferred correctly', () => {
  BScroll.use(PullUp)
  const bscroll = new BScroll('', {
    pullUpLoad: true
  })
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectAssignable<boolean, BSOptions['pullUpLoad']>()
})

describe('pullDown plugin option type shoule be inferred correctly', () => {
  BScroll.use(PullDown)
  const bscroll = new BScroll('', {
    pullDownRefresh: true
  })
  type BSOptions = DeepNonNullable<typeof bscroll.options>
  expectAssignable<boolean, BSOptions['pullDownRefresh']>()
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
  expectType<number, NonNullable<BSOptions['mouseWheel']['discreteTime']>>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['easeTime']>>()
  expectType<boolean, NonNullable<BSOptions['mouseWheel']['invert']>>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['speed']>>()
  expectType<number, NonNullable<BSOptions['mouseWheel']['throttleTime']>>()
})
