import BScroll from '@better-scroll/core'
import Indicator, { IndicatorOption } from './indicator'

export const enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

// augmentation for Options
export type scrollbarOptions = Partial<ScrollbarConfig> | boolean

export interface ScrollbarConfig {
  fade: boolean
  interactive: boolean
}

declare module '@better-scroll/core' {
  interface Options {
    scrollbar?: scrollbarOptions
  }
}

export default class ScrollBar {
  static pluginName = 'scrollbar'
  public indicators: Array<Indicator> = []

  constructor(bscroll: BScroll) {
    if (bscroll.options.scrollbar) {
      this.indicators = this._initIndicators(bscroll)

      bscroll.on('destroy', this.destroy, this)
    }
  }

  private _initIndicators(bscroll: BScroll) {
    const { fade = true, interactive = false } = bscroll.options
      .scrollbar as ScrollbarConfig
    let indicatorOption: IndicatorOption

    let scrolls: { [key: string]: Direction } = {
      scrollX: Direction.Horizontal,
      scrollY: Direction.Vertical
    }
    const indicators: Indicator[] = []

    Object.keys(scrolls).forEach((key: string) => {
      const direction: Direction = scrolls[key]
      if (bscroll.options[key]) {
        indicatorOption = {
          wrapper: this._createIndicatorElement(direction),
          direction: direction,
          fade,
          interactive
        }
        bscroll.wrapper.appendChild(indicatorOption.wrapper)
        indicators.push(new Indicator(bscroll, indicatorOption))
      }
    })
    return indicators
  }

  private _createIndicatorElement(direction: Direction) {
    let scrollbarEl: HTMLDivElement = document.createElement('div')
    let indicatorEl: HTMLDivElement = document.createElement('div')

    scrollbarEl.style.cssText =
      'position:absolute;z-index:9999;pointerEvents:none'
    indicatorEl.style.cssText =
      'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;'

    indicatorEl.className = 'bscroll-indicator'

    if (direction === 'horizontal') {
      scrollbarEl.style.cssText += ';height:7px;left:2px;right:2px;bottom:0'
      indicatorEl.style.height = '100%'
      scrollbarEl.className = 'bscroll-horizontal-scrollbar'
    } else {
      scrollbarEl.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px'
      indicatorEl.style.width = '100%'
      scrollbarEl.className = 'bscroll-vertical-scrollbar'
    }

    scrollbarEl.style.cssText += ';overflow:hidden'
    scrollbarEl.appendChild(indicatorEl)

    return scrollbarEl
  }

  destroy(): void {
    for (let indicator of this.indicators) {
      indicator.destroy()
    }
  }
}
