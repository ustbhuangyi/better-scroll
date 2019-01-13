import EventEmitter from './base/EventEmitter'
import Options from './Options'
import Scroller from './scroller/Scroller'

import { warn } from './util'

export interface Plugin {
  install: (ctor: BScroll, options?: any[]) => void
  new (): void
}

interface PluginsMap {
  [name: string]: {
    new (bs: BScroll): void
  }
}

export default class BScroll extends EventEmitter {
  static readonly version: string = '2.0.0'
  static _installedPlugins?: Plugin[]
  static _pluginsMap: PluginsMap

  scroller: Scroller
  options: Options
  hooks: EventEmitter
  [key: string]: any

  static use(plugin: Plugin, ...options: any[]) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    options.unshift(this)
    plugin.install && plugin.install.apply(plugin, options as any)

    installedPlugins.push(plugin)
    return this
  }

  static plugin(
    name: string,
    ctor: {
      new (): void
    }
  ) {
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

    this.hooks.trigger(this.hooks.eventTypes.init)
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
    this.scroller.animater.resetPosition()
  }

  enable() {}

  disable() {}

  destroy() {}
}
