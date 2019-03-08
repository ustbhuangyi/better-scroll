import EventEmitter from './base/EventEmitter'
import Options from './Options'
import Scroller from './scroller/Scroller'
import { warn, isUndef, propertiesProxy, bubbling } from './util'
import { propertiesConfig } from './propertiesConfig'
import { PluginCtor } from './plugins/type'

interface PluginsCtorMap {
  [name: string]: PluginCtor
}

interface PropertyConfig {
  key: string
  sourceKey: string
}

export default class BScroll extends EventEmitter {
  static readonly version: string = '2.0.0'
  static pluginsCtorMap: PluginsCtorMap = {}

  scroller: Scroller
  options: Options
  hooks: EventEmitter
  plugins: { [name: string]: any }
  [key: string]: any

  static use(ctor: PluginCtor) {
    const name = ctor.pluginName

    if (isUndef(name)) {
      warn(
        `Plugin Class must specify plugin's name in static property by 'name' field.`
      )
    }
    if (this.pluginsCtorMap[name]) {
      warn(
        `This plugin has been registered, maybe you need change plugin's name`
      )
    }
    this.pluginsCtorMap[name] = ctor
  }

  constructor(el: HTMLElement | string, options?: object) {
    super([
      'refresh',
      'enable',
      'disable',
      'beforeScrollStart',
      'scrollStart',
      'scroll',
      'scrollEnd',
      'touchEnd',
      'flick',
      'refresh',
      'destroy'
    ])
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
    this.plugins = {}
    this.options = new Options().merge(options).process()
    this.hooks = new EventEmitter([
      'init',
      'refresh',
      'enable',
      'disable',
      'destroy'
    ])
    this.init(wrapper)
  }

  private init(wrapper: HTMLElement) {
    this.scroller = new Scroller(wrapper as HTMLElement, this.options)
    this.eventBubbling()
    if (this.options.autoBlur) {
      this.handleAutoBlur()
    }

    this.refresh()

    this.scroller.scrollTo(this.options.startX, this.options.startY)

    this.enable()

    this.proxy(propertiesConfig)

    this.applyPlugins()
  }

  private applyPlugins() {
    const options = this.options
    const pluginsCtorMap = (<typeof BScroll>this.constructor).pluginsCtorMap
    let ctor
    for (let pluginName in pluginsCtorMap) {
      ctor = pluginsCtorMap[pluginName]
      if (options[pluginName] && typeof ctor === 'function') {
        this.plugins[pluginName] = new ctor(this)
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

  private eventBubbling() {
    bubbling(this.scroller.hooks, this, [
      'beforeScrollStart',
      'scrollStart',
      'scroll',
      'scrollEnd',
      'touchEnd',
      'flick'
    ])
    bubbling(this.hooks, this, ['destroy', 'enable', 'disable', 'refresh'])
  }

  proxy(propertiesConfig: PropertyConfig[]) {
    propertiesConfig.forEach(({ key, sourceKey }) => {
      propertiesProxy(this, sourceKey, key)
    })
  }
  refresh() {
    this.scroller.refresh()
    this.hooks.trigger(this.eventTypes.refresh)
    this.scroller.resetPosition()
  }

  enable() {
    this.scroller.enabled = true
    this.hooks.trigger(this.hooks.eventTypes.enable)
  }

  disable() {
    this.scroller.enabled = false
    this.hooks.trigger(this.hooks.eventTypes.disable)
  }

  destroy() {
    this.hooks.trigger(this.hooks.eventTypes.destroy)
    // TODO destroy
  }
  eventRegister(names: string[]) {
    this.registerType(names)
  }
}
