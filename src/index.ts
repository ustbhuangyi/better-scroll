import EventEmitter from './base/EventEmitter'
import Options from './Options'
import Scroller from './scroller/Scroller'

import { warn } from './util'
interface PluginsMap<T> {
  [name: string]: PluginCtor<T>
}

interface PluginCtor<T> {
  new (bs: BScroll): T
}
export default class BScroll extends EventEmitter {
  static readonly version: string = '2.0.0'
  static _pluginsMap?: PluginsMap<any>

  scroller: Scroller
  options: Options
  hooks: EventEmitter
  [key: string]: any

  static plugin<T>(name: string, ctor: PluginCtor<T>) {
    if (!this._pluginsMap) {
      this._pluginsMap = {}
    }
    if (this._pluginsMap[name]) {
      warn(
        `This plugin has been registered, maybe you need change plugin's name`
      )
    }
    this._pluginsMap[name] = ctor
  }

  constructor(el: HTMLElement | string, options?: object) {
    super(['refresh', 'scrollStart'])
    const wrapper = (typeof el === 'string'
      ? document.querySelector(el)
      : el) as HTMLElement

    if (!wrapper) {
      warn('Can not resolve the wrapper DOM.')
      return
    }
    const scrollElement = wrapper.children[0]
    if (!scrollElement) {
      warn('The wrapper need at least one child element to be scroller.')
      return
    }
    this.options = new Options().merge(options).process()
    this.hooks = new EventEmitter(['init'])
    this.init(wrapper)
  }

  private init(wrapper: HTMLElement) {
    this.scroller = new Scroller(wrapper as HTMLElement, this.options)

    this.applyPlugins()

    if (this.options.autoBlur) {
      this.handleAutoBlur()
    }

    this.refresh()

    if (!this.options.slide) {
      this.scroller.scrollTo(this.options.startX, this.options.startY)
    }
    this.enable()
  }

  private applyPlugins() {
    const options = this.options
    const _pluginsMap = (<typeof BScroll>this.constructor)._pluginsMap || {}
    let ctor
    for (let pluginName in _pluginsMap) {
      ctor = _pluginsMap[pluginName]
      if (options[pluginName]) {
        typeof ctor === 'function' && new ctor(this)
      }
    }
  }

  private handleAutoBlur() {
    this.on(this.eventTypes.scrollStart, () => {
      let activeElement = document.activeElement as HTMLElement
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA')
      ) {
        activeElement.blur()
      }
    })
  }
  refresh() {
    this.scroller.refresh()
    this.trigger(this.eventTypes.refresh)
    this.scroller.resetPosition()
  }

  enable() {
    this.scroller.enabled = true
  }

  disable() {
    this.scroller.enabled = false
  }

  destroy() {}
}
