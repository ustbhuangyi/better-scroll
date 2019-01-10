import { PluginObject, PluginFunction } from '../types/plugin'

import EventEmitter from './base/EventEmitter'
import Options from './Options'
import ActionsHandler from './base/ActionsHandler'

import { style, offset, getRect, warn } from './util'

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

  wrapper: HTMLElement | null
  scrollElement: HTMLElement
  options: Options
  enabled: boolean
  actionsHandler: ActionsHandler
  hooks: EventEmitter
  wrapperOffset: {
    left: number
    top: number
  }
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

  constructor(el: HTMLElement | string, options: object) {
    super(['refresh'])
    this.wrapper = typeof el === 'string' ? document.querySelector(el) : el

    if (!this.wrapper) {
      warn('Can not resolve the wrapper DOM.')
      return
    }
    this.scrollElement = this.wrapper.children[0] as HTMLElement
    if (!this.scrollElement) {
      warn('The wrapper need at least one child element to be scroller.')
      return
    }
    this.options = new Options().merge(options).process()
    this.hooks = new EventEmitter([
      'init',
      'refresh'
    ])
    this.init()
  }

  private init() {
    new ActionsHandler(this.wrapper)

    this.hooks.trigger(this.hooks.eventTypes.init)
    this.applyPlugins()

    if (this.options.autoBlur) {
      this.handleAutoBlur()
    }

    this.refresh()
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
    this.on('scrollStart', () => {
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
    this.hooks.trigger(this.hooks.eventTypes.refresh, this)
    this.trigger(this.eventTypes.refresh)
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  destroy() {}
}
