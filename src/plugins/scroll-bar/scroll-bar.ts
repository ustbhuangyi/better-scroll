import BScroll from '../../index'
import { Options } from '../../Options'
import Indicator, { IndicatorOption } from './indicator'
import { Direction } from './const'

// augmentation for Options
export interface scrollbarConfig {
  fade: boolean
  interactive: boolean
}

export type scrollbarOptions = Partial<scrollbarConfig> | boolean

declare module '../../Options' {
  interface Options {
    scrollbar?: scrollbarOptions
  }
}

function createScrollbar(direction: Direction) {
  let scrollbar: HTMLDivElement = document.createElement('div')
  let indicator: HTMLDivElement = document.createElement('div')

  scrollbar.style.cssText = 'position:absolute;z-index:9999;pointerEvents:none'
  indicator.style.cssText =
    'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;'

  indicator.className = 'this.bscroll-indicator'

  if (direction === 'horizontal') {
    scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0'
    indicator.style.height = '100%'
    scrollbar.className = 'this.bscroll-horizontal-scrollbar'
  } else {
    scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px'
    indicator.style.width = '100%'
    scrollbar.className = 'this.bscroll-vertical-scrollbar'
  }

  scrollbar.style.cssText += ';overflow:hidden'
  scrollbar.appendChild(indicator)

  return scrollbar
}

export default class ScrollBar {
  static pluginName = 'scrollbar'
  public indicators: Array<Indicator> = []

  constructor(bscroll: BScroll) {
    if (bscroll.options.scrollbar) {
      this._init(bscroll)
    }
  }

  private _init(bscroll: BScroll): void {
    const { fade = true, interactive = false } = bscroll.options
      .scrollbar as scrollbarConfig
    let indicatorOption: IndicatorOption

    let scrolls = {
      scrollX: Direction.Horizontal,
      scrollY: Direction.Vertical
    }

    for (let [scroll, direction] of Object.entries(scrolls)) {
      if (bscroll.options[scroll]) {
        indicatorOption = {
          el: createScrollbar(direction),
          direction: direction,
          fade,
          interactive
        }
        this.indicators.push(new Indicator(bscroll, indicatorOption))
      }
    }

    this._insertToWrapper(bscroll.wrapper)

    bscroll.on('destroy', () => {
      this.destroy()
    })
  }

  private _insertToWrapper(wrapper: HTMLElement): void {
    for (let indicator of this.indicators) {
      wrapper.appendChild(indicator.wrapper)
    }
  }

  destroy(): void {
    for (let indicator of this.indicators) {
      indicator.destroy()
    }
  }
}
