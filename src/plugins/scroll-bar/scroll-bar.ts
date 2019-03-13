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
  private indicators: Array<Indicator> = []

  constructor(public bscroll: BScroll) {
    if (bscroll.options.scrollbar) {
      this._init()
    }
  }

  private _init(): void {
    const { fade = true, interactive = false } = this.bscroll.options
      .scrollbar as scrollbarConfig
    let indicatorOption: IndicatorOption

    if (this.bscroll.options.scrollX) {
      indicatorOption = {
        el: createScrollbar(Direction.Horizontal),
        direction: Direction.Horizontal,
        fade,
        interactive
      }
      this._insert(indicatorOption.el)

      this.bscroll.indicators.push(new Indicator(this.bscroll, indicatorOption))
    }

    if (this.bscroll.options.scrollY) {
      indicatorOption = {
        el: createScrollbar(Direction.Vertical),
        direction: Direction.Vertical,
        fade,
        interactive
      }
      this._insert(indicatorOption.el)
      this.bscroll.indicators.push(new Indicator(this.bscroll, indicatorOption))
    }

    this.bscroll.on('destroy', () => {
      this._remove()
    })
  }

  private _insert(el: HTMLElement): void {
    this.bscroll.wrapper.appendChild(el)
  }

  private _remove(): void {
    for (let i = 0; i < this.indicators.length; i++) {
      this.indicators[i].destroy()
    }
  }
}
