import BScroll from '@better-scroll/core'
import Indicator from './indicator'
import { IndicatorOptions } from './types'
import { assert } from '@better-scroll/shared-utils'

declare module '@better-scroll/core' {
  interface CustomOptions {
    indicators?: IndicatorOptions[]
  }
}

export default class Indicators {
  static pluginName = 'indicators'
  options: IndicatorOptions[] = []
  indicators: Indicator[] = []
  constructor(public scroll: BScroll) {
    this.handleOptions()
    this.handleHooks()
  }

  private handleOptions() {
    const UserIndicatorsOptions = this.scroll.options.indicators!
    assert(
      Array.isArray(UserIndicatorsOptions),
      `'indicators' must be an array.`
    )
    for (const indicatorOptions of UserIndicatorsOptions) {
      assert(
        !!indicatorOptions.relationElement,
        `'relationElement' must be a HTMLElement.`
      )
      this.createIndicators(indicatorOptions)
    }
  }

  private createIndicators(options: IndicatorOptions) {
    this.indicators.push(new Indicator(this.scroll, options))
  }

  private handleHooks() {
    const scrollHooks = this.scroll.hooks
    scrollHooks.on(scrollHooks.eventTypes.destroy, () => {
      for (const indicator of this.indicators) {
        indicator.destroy()
      }
      this.indicators = []
    })
  }
}
