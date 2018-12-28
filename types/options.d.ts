// type
type bounceOptions = Partial<bounceConfig> | boolean
type wheelOptions = Partial<wheelConfig> | boolean
type snapOptions = Partial<snapConfig> | boolean
type scrollbarOptions = Partial<scrollbarConfig> | boolean
type pullDownRefreshOptions = Partial<pullDownRefreshConfig> | boolean
type pullUpLoadOptions = Partial<pullUpLoadConfig> | boolean
type mouseWheelOptions = Partial<mouseWheelConfig> | boolean
type zoomOptions = Partial<zoomConfig> | boolean
type infinityOptions = Partial<infinityConfig> | boolean
type dblclickOptions = Partial<dblclickConfig> | boolean


// enum
export enum ProbeType {
  NO_SCROLL,
  NOT_REAL_TIME_SCROll,
  REAL_TIME_SCROLL,
  REAL_TIME_MOMENTUM_SCROLL
}

// interface
interface bounceConfig {
  top?: boolean,
  bottom?: boolean,
  left?: boolean,
  right?: boolean
}

interface wheelConfig {
  selectedIndex: number,
  rotate: number,
  adjustTime: number
  wheelWrapperClass: string,
  wheelItemClass: string
}

interface snapConfig {
  loop: boolean,
  el: HTMLElement,
  threshold: number,
  stepX: number,
  stepY: number,
  speed: number,
  easing: {
    style: string,
    fn: (t: number) => number
  },
  listenFlick: boolean
}

interface scrollbarConfig {
  fade: boolean,
  interactive: boolean
}

interface pullDownRefreshConfig {
  threshold: number,
  stop: number
}

interface pullUpLoadConfig {
  threshold: number
}

interface mouseWheelConfig {
  speed: number,
  invert: boolean,
  easeTime: number
}

interface zoomConfig {
  start: number,
  min: number,
  max: number
}

interface infinityConfig {
  render: (item: object, div: any) => void,
  createTombstone: () => HTMLElement,
  fetch: (count: number) => void
}

interface dblclickConfig {
  delay: number
}

export interface BScrollOptions {
  startX: number,
  startY: number,
  scrollX: boolean,
  scrollY: boolean,
  freeScroll: boolean,
  directionLockThreshold: number,
  eventPassthrough: string,
  click: boolean,
  tap: boolean,
  bounce: bounceOptions,
  bounceTime: number,
  momentum: boolean,
  momentumLimitTime: number,
  momentumLimitDistance: number,
  swipeTime: number,
  swipeBounceTime: number,
  deceleration: number,
  flickLimitTime: number,
  flickLimitDistance: number,
  resizePolling: number,
  probeType: ProbeType,
  preventDefault: boolean,
  preventDefaultException: {
    tagName: RegExp
  },
  HWCompositing: boolean,
  useTransition: boolean,
  useTransform: boolean,
  bindToWrapper: boolean,
  disableMouse: boolean,
  disableTouch: boolean,
  observeDOM: boolean,
  autoBlur: boolean,
  stopPropagation: boolean,
  wheel: wheelOptions,
  snap: snapOptions,
  scrollbar: scrollbarOptions,
  pullDownRefresh: pullDownRefreshOptions,
  pullUpLoad: pullUpLoadOptions,
  mouseWheel: mouseWheelOptions,
  zoom: zoomOptions,
  infinity: infinityOptions,
  dblclick: dblclickOptions
}
