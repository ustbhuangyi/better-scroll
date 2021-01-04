import BScroll from '@better-scroll/core'
import { EventRegister, extend } from '@better-scroll/shared-utils'

export type ObserveImageOptions = Partial<ObserveImageConfig> | true

export interface ObserveImageConfig {
  debounceTime: number
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    observeImage?: ObserveImageOptions
  }
}

const isImageTag = (el: HTMLElement) => {
  return el.tagName.toLowerCase() === 'img'
}

export default class ObserveImage {
  static pluginName = 'observeImage'
  imageLoadEventRegister: EventRegister
  imageErrorEventRegister: EventRegister
  refreshTimer: number = 0
  options: ObserveImageConfig
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    this.handleOptions(this.scroll.options.observeImage)
    this.bindEventsToWrapper()
  }

  private handleOptions(userOptions: ObserveImageOptions = {}) {
    userOptions = (userOptions === true ? {} : userOptions) as Partial<
      ObserveImageConfig
    >
    const defaultOptions: ObserveImageConfig = {
      debounceTime: 100, // ms
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private bindEventsToWrapper() {
    const wrapper = this.scroll.scroller.wrapper
    this.imageLoadEventRegister = new EventRegister(wrapper, [
      {
        name: 'load',
        handler: this.load.bind(this),
        capture: true,
      },
    ])
    this.imageErrorEventRegister = new EventRegister(wrapper, [
      {
        name: 'error',
        handler: this.load.bind(this),
        capture: true,
      },
    ])
  }

  private load(e: Event) {
    const target = e.target as HTMLElement
    const debounceTime = this.options.debounceTime
    if (target && isImageTag(target)) {
      if (debounceTime === 0) {
        this.scroll.refresh()
      } else {
        clearTimeout(this.refreshTimer)
        this.refreshTimer = window.setTimeout(() => {
          this.scroll.refresh()
        }, this.options.debounceTime)
      }
    }
  }
}
