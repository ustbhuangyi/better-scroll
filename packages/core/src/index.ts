import { Options } from './Options'
import Scroller, { MountedBScrollHTMLElement } from './scroller/Scroller'
import {
  getElement,
  warn,
  isUndef,
  propertiesProxy,
  ApplyOrder,
  EventEmitter
} from '@better-scroll/shared-utils'
import { bubbling } from './utils/bubbling'
import { propertiesConfig } from './propertiesConfig'

interface PluginCtor {
  pluginName: string
  applyOrder?: ApplyOrder
  new (scroll: BScroll): any
}

interface PluginItem {
  name: string
  applyOrder?: ApplyOrder.Pre | ApplyOrder.Post
  ctor: PluginCtor
}
interface PluginsMap {
  [key: string]: boolean
}
interface PropertyConfig {
  key: string
  sourceKey: string
}

export default class BScroll extends EventEmitter {
  static plugins: PluginItem[] = []
  static pluginsMap: PluginsMap = {}
  scroller: Scroller
  options: Options
  hooks: EventEmitter
  plugins: { [name: string]: any }
  wrapper: HTMLElement
  [key: string]: any

  static use(ctor: PluginCtor) {
    const name = ctor.pluginName
    const installed = this.plugins.some(plugin => ctor === plugin.ctor)
    if (installed) return this
    if (isUndef(name)) {
      warn(
        `Plugin Class must specify plugin's name in static property by 'pluginName' field.`
      )
      return this
    }
    if (this.pluginsMap[name]) {
      warn(
        `This plugin has been registered, maybe you need change plugin's name`
      )
      return this
    }
    this.pluginsMap[name] = true
    this.plugins.push({
      name,
      applyOrder: ctor.applyOrder,
      ctor
    })
    return this
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
      'scrollCancel',
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

    // mark wrapper to recognize bs instance by DOM attribute
    ;(wrapper as any).isBScrollContainer = true
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
    ;(this.constructor as typeof BScroll).plugins
      .sort((a, b) => {
        const applyOrderMap = {
          [ApplyOrder.Pre]: -1,
          [ApplyOrder.Post]: 1
        }
        const aOrder = a.applyOrder ? applyOrderMap[a.applyOrder] : 0
        const bOrder = b.applyOrder ? applyOrderMap[b.applyOrder] : 0
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
      this.on(this.eventTypes.beforeScrollStart, () => {
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
      'scrollCancel',
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
    this.hooks.trigger(this.hooks.eventTypes.destroy)
    this.trigger(this.eventTypes.destroy)
    this.scroller.destroy()
  }
  eventRegister(names: string[]) {
    this.registerType(names)
  }
}

export { Options, MountedBScrollHTMLElement }
export { TranslaterPoint } from './translater'
export { default as Behavior } from './scroller/Behavior'
