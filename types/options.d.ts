// type
export type tap = 'tap' | ''
export type bounceOptions = Partial<bounceConfig> | boolean
export type pickerOptions = Partial<pickerConfig> | boolean
export type slideOptions = Partial<slideConfig> | boolean
export type scrollbarOptions = Partial<scrollbarConfig> | boolean
export type pullDownRefreshOptions = Partial<pullDownRefreshConfig> | boolean
export type pullUpLoadOptions = Partial<pullUpLoadConfig> | boolean
export type mouseWheelOptions = Partial<mouseWheelConfig> | boolean
export type zoomOptions = Partial<zoomConfig> | boolean
export type infinityOptions = Partial<infinityConfig> | boolean
export type dblclickOptions = Partial<dblclickConfig> | boolean


// enum
export enum ProbeType {
  NO_SCROLL,
  NOT_REAL_TIME_SCROll,
  REAL_TIME_SCROLL,
  REAL_TIME_MOMENTUM_SCROLL
}

// interface
interface bounceConfig {
  top: boolean,
  bottom: boolean,
  left: boolean,
  right: boolean
}

interface pickerConfig {
  selectedIndex: number,
  rotate: number,
  adjustTime: number
  wheelWrapperClass: string,
  wheelItemClass: string
}

interface slideConfig {
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
