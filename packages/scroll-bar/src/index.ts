import BScroll from '@better-scroll/core'
import Indicator, {
  IndicatorOptions,
  IndicatorDirection,
  OffsetType,
} from './indicator'
import { extend } from '@better-scroll/shared-utils'

export type ScrollbarOptions = Partial<ScrollbarConfig> | true

export interface ScrollbarConfig {
  fade: boolean
  interactive: boolean
  customElements: HTMLElement[]
  minSize: number
  scrollbarTrackClickable: boolean
  scrollbarTrackOffsetType: OffsetType
  scrollbarTrackOffsetTime: number
}
declare module '@better-scroll/core' {
  interface CustomOptions {
    scrollbar?: ScrollbarOptions
  }
}

export default class ScrollBar {
  static pluginName = 'scrollbar'
  options: ScrollbarConfig
  indicators: Indicator[]

  constructor(public scroll: BScroll) {
    this.handleOptions()
    this.createIndicators()
    this.handleHooks()
  }

  private handleHooks() {
    const scroll = this.scroll
    scroll.hooks.on(scroll.hooks.eventTypes.destroy, () => {
      for (let indicator of this.indicators) {
        indicator.destroy()
      }
    })
  }

  private handleOptions() {
    const userOptions = (this.scroll.options.scrollbar === true
      ? {}
      : this.scroll.options.scrollbar) as Partial<ScrollbarConfig>

    const defaultOptions: ScrollbarConfig = {
      fade: true,
      interactive: false,
      customElements: [],
      minSize: 8,
      scrollbarTrackClickable: false,
      scrollbarTrackOffsetType: OffsetType.Step,
      scrollbarTrackOffsetTime: 300,
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private createIndicators() {
    let indicatorOptions: IndicatorOptions
    const scroll: BScroll = this.scroll
    const indicators: Indicator[] = []
    const scrollDirectionConfigKeys = ['scrollX', 'scrollY']
    const indicatorDirections = [
      IndicatorDirection.Horizontal,
      IndicatorDirection.Vertical,
    ]
    const customScrollbarEls = this.options.customElements
    for (let i = 0; i < scrollDirectionConfigKeys.length; i++) {
      const key = scrollDirectionConfigKeys[i]
      // wanna scroll in specified direction
      if (scroll.options[key]) {
        const customElement = customScrollbarEls.shift()
        const direction = indicatorDirections[i]
        let isCustom = false
        let scrollbarWrapper = customElement
          ? customElement
          : this.createScrollbarElement(direction)
        // internal scrollbar
        if (scrollbarWrapper !== customElement) {
          scroll.wrapper.appendChild(scrollbarWrapper)
        } else {
          // custom scrollbar passed by users
          isCustom = true
        }
        indicatorOptions = {
          wrapper: scrollbarWrapper,
          direction,
          ...this.options,
          isCustom,
        }
        indicators.push(new Indicator(scroll, indicatorOptions))
      }
    }
    this.indicators = indicators
  }

  private createScrollbarElement(
    direction: IndicatorDirection,
    scrollbarTrackClickable = this.options.scrollbarTrackClickable
  ) {
    let scrollbarWrapperEl: HTMLDivElement = document.createElement('div')
    let scrollbarIndicatorEl: HTMLDivElement = document.createElement('div')

    scrollbarWrapperEl.style.cssText =
      'position:absolute;z-index:9999;overflow:hidden;'
    scrollbarIndicatorEl.style.cssText =
      'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;'

    scrollbarIndicatorEl.className = 'bscroll-indicator'
    if (direction === IndicatorDirection.Horizontal) {
      scrollbarWrapperEl.style.cssText +=
        'height:7px;left:2px;right:2px;bottom:0;'
      scrollbarIndicatorEl.style.height = '100%'
      scrollbarWrapperEl.className = 'bscroll-horizontal-scrollbar'
    } else {
      scrollbarWrapperEl.style.cssText +=
        'width:7px;bottom:2px;top:2px;right:1px;'
      scrollbarIndicatorEl.style.width = '100%'
      scrollbarWrapperEl.className = 'bscroll-vertical-scrollbar'
    }

    if (!scrollbarTrackClickable) {
      scrollbarWrapperEl.style.cssText += 'pointer-events:none;'
    }
    scrollbarWrapperEl.appendChild(scrollbarIndicatorEl)
    return scrollbarWrapperEl
  }
}
