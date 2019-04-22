import EventEmitter from './base/EventEmitter'
import { Options } from './Options'
import Scroller from './scroller/Scroller'
import { getElement, warn, isUndef, propertiesProxy, bubbling } from './util'
import { propertiesConfig } from './propertiesConfig'
import { PluginCtor } from './plugins/type'
import { EnforceOrder } from './enums/enforce-order'

interface PluginItem {
  name: string
  enforce?: EnforceOrder.Pre | EnforceOrder.Post
  ctor: PluginCtor
}
interface PluginSet {
  [key: string]: boolean
}
interface PropertyConfig {
  key: string
  sourceKey: string
}

export default class BScroll extends EventEmitter {
  static readonly version: string = '2.0.0'
  static usePluginArray: PluginItem[] = []
  static usePluginSet: PluginSet = {}
  scroller: Scroller
  options: Options
  hooks: EventEmitter
  plugins: { [name: string]: any }
  wrapper: HTMLElement
  [key: string]: any

  static use(ctor: PluginCtor) {
    const name = ctor.pluginName

    if (isUndef(name)) {
      warn(
        `Plugin Class must specify plugin's name in static property by 'pluginName' field.`
      )
      return
    }
    if (BScroll.usePluginSet[name]) {
      warn(
        `This plugin has been registered, maybe you need change plugin's name`
      )
      return
    }
    BScroll.usePluginSet[name] = true
    BScroll.usePluginArray.push({
      name,
      enforce: ctor.enforce,
      ctor: ctor
    })
  }

  constructor(el: HTMLElement | string, options?: Partial<Options>) {
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
      'destroy'
    ])
    const wrapper = getElement(el)

    if (!wrapper) {
      warn('Can not resolve the wrapper DOM.')
      return
    }
    const content = wrapper.children[0]
    if (!content) {
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
    this.wrapper = wrapper
    this.scroller = new Scroller(wrapper as HTMLElement, this.options)

    this.eventBubbling()
    this.handleAutoBlur()

    this.innerRefresh()

    this.scroller.scrollTo(this.options.startX, this.options.startY)
    this.enable()

    this.proxy(propertiesConfig)

    this.applyPlugins()
  }

  private applyPlugins() {
    const options = this.options
    BScroll.usePluginArray
      .sort((a, b) => {
        const enforeOrderMap = {
          [EnforceOrder.Pre]: -1,
          [EnforceOrder.Post]: 1
        }
        const aOrder = a.enforce ? enforeOrderMap[a.enforce] : 0
        const bOrder = b.enforce ? enforeOrderMap[b.enforce] : 0
        return aOrder - bOrder
      })
      .forEach((item: PluginItem) => {
        let ctor = item.ctor
        if (options[item.name] && typeof ctor === 'function') {
          this.plugins[item.name] = new ctor(this)
        }
      })
  }

  private handleAutoBlur() {
    if (this.options.autoBlur) {
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
  }

  private innerRefresh() {
    this.scroller.refresh()
    this.hooks.trigger(this.hooks.eventTypes.refresh)
    this.trigger(this.eventTypes.refresh)
  }

  proxy(propertiesConfig: PropertyConfig[]) {
    propertiesConfig.forEach(({ key, sourceKey }) => {
      propertiesProxy(this, sourceKey, key)
    })
  }
  refresh() {
    this.innerRefresh()
    this.scroller.resetPosition()
  }

  enable() {
    this.scroller.enable()
    this.hooks.trigger(this.hooks.eventTypes.enable)
    this.trigger(this.eventTypes.enable)
  }

  disable() {
    this.scroller.disable()
    this.hooks.trigger(this.hooks.eventTypes.disable)
    this.trigger(this.eventTypes.disable)
  }

  destroy() {
    this.scroller.destroy()
    this.hooks.trigger(this.hooks.eventTypes.destroy)
    this.trigger(this.eventTypes.destroy)
  }
  eventRegister(names: string[]) {
    this.registerType(names)
  }
}
