import { PluginObject, PluginFunction } from '../types/plugin'
import { EventEmitter } from './scroll/event-emitter'

import { warn } from './util/debug'

// Type Guards
export function isPluginObject(
  plugin: PluginObject | PluginFunction
): plugin is PluginObject {
  return typeof (plugin as PluginObject).install === 'function'
}

export default class BScroll extends EventEmitter {
  static readonly Version: string = '2.0.0'
  static _installedPlugins?: (Object | Function)[]
  static _plugins: {
    [name: string]: any
  }

  wrapper: HTMLElement
  scroller?: HTMLElement
  scrollerStyle?: object

  constructor(el: HTMLElement | string, options: object) {
    super()
    this.wrapper = (typeof el === 'string'
      ? document.querySelector(el)
      : el) as HTMLElement

    if (!this.wrapper) {
      warn('Can not resolve the wrapper DOM.')
      return
    }
    this.scroller = this.wrapper.children[0] as HTMLElement
    if (!this.scroller) {
      warn('The wrapper need at least one child element to be scroller.')
      return
    }
    // cache style for better performance
    this.scrollerStyle = this.scroller.style

    this._init(el as HTMLElement, options)
  }

  static use(plugin: PluginObject | PluginFunction, ...options: any[]) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    options.unshift(this)
    if (isPluginObject(plugin)) {
      plugin.install.apply(plugin, options as any)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, options as any)
    }
    installedPlugins.push(plugin)
    return this
  }

  static plugin<T>(name: string, ctor: T): void {
    if (!this._plugins) {
      this._plugins = []
    }
    if (this._plugins[name]) {
      warn(
        "This plugin has been registered, maybe you need change plugin's name"
      )
    }
    this._plugins[name] = ctor
  }

  _init(el: HTMLElement, options: object) {}
}
