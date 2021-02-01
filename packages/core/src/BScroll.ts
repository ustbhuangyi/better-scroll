import { BScrollInstance, propertiesConfig } from './Instance'
import { Options, DefOptions, OptionsConstructor } from './Options'
import Scroller from './scroller/Scroller'
import {
  getElement,
  warn,
  isUndef,
  propertiesProxy,
  ApplyOrder,
  EventEmitter
} from '@better-scroll/shared-utils'
import { bubbling } from './utils/bubbling'
import { UnionToIntersection } from './utils/typesHelper'

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

type ElementParam = HTMLElement | string

export interface MountedBScrollHTMLElement extends HTMLElement {
  isBScrollContainer?: boolean
}

export class BScrollConstructor<O = {}> extends EventEmitter {
  static plugins: PluginItem[] = []
  static pluginsMap: PluginsMap = {}
  scroller: Scroller
  options: OptionsConstructor
  hooks: EventEmitter
  plugins: { [name: string]: any }
  wrapper: HTMLElement
  content: HTMLElement;
  [key: string]: any

  static use(ctor: PluginCtor) {
    const name = ctor.pluginName
    const installed = BScrollConstructor.plugins.some(
      plugin => ctor === plugin.ctor
    )
    if (installed) return BScrollConstructor
    if (isUndef(name)) {
      warn(
        `Plugin Class must specify plugin's name in static property by 'pluginName' field.`
      )
      return BScrollConstructor
    }
    BScrollConstructor.pluginsMap[name] = true
    BScrollConstructor.plugins.push({
      name,
      applyOrder: ctor.applyOrder,
      ctor
    })
    return BScrollConstructor
  }

  constructor(el: ElementParam, options?: Options & O) {
    super([
      'refresh',
      'contentChanged',
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

    this.plugins = {}
    this.options = new OptionsConstructor().merge(options).process()

    if (!this.setContent(wrapper).valid) {
      return
    }

    this.hooks = new EventEmitter([
      'refresh',
      'enable',
      'disable',
      'destroy',
      'beforeInitialScrollTo',
      'contentChanged'
    ])
    this.init(wrapper)
  }

  setContent(wrapper: MountedBScrollHTMLElement) {
    let contentChanged = false
    let valid = true
    const content = wrapper.children[
      this.options.specifiedIndexAsContent
    ] as HTMLElement
    if (!content) {
      warn(
        'The wrapper need at least one child element to be content element to scroll.'
      )
      valid = false
    } else {
      contentChanged = this.content !== content
      if (contentChanged) {
        this.content = content
      }
    }
    return {
      valid,
      contentChanged
    }
  }

  private init(wrapper: MountedBScrollHTMLElement) {
    this.wrapper = wrapper

    // mark wrapper to recognize bs instance by DOM attribute
    wrapper.isBScrollContainer = true
    this.scroller = new Scroller(wrapper, this.content, this.options)
    this.scroller.hooks.on(this.scroller.hooks.eventTypes.resize, () => {
      this.refresh()
    })

    this.eventBubbling()
    this.handleAutoBlur()
    this.enable()

    this.proxy(propertiesConfig)
    this.applyPlugins()

    // maybe boundary has changed, should refresh
    this.refreshWithoutReset(this.content)
    const { startX, startY } = this.options
    const position = {
      x: startX,
      y: startY
    }
    // maybe plugins want to control scroll position
    if (
      this.hooks.trigger(this.hooks.eventTypes.beforeInitialScrollTo, position)
    ) {
      return
    }
    this.scroller.scrollTo(position.x, position.y)
  }

  private applyPlugins() {
    const options = this.options
    BScrollConstructor.plugins
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
        const ctor = item.ctor
        if (options[item.name] && typeof ctor === 'function') {
          this.plugins[item.name] = new ctor(this)
        }
      })
  }

  private handleAutoBlur() {
    /* istanbul ignore if  */
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
      this.eventTypes.beforeScrollStart,
      this.eventTypes.scrollStart,
      this.eventTypes.scroll,
      this.eventTypes.scrollEnd,
      this.eventTypes.scrollCancel,
      this.eventTypes.touchEnd,
      this.eventTypes.flick
    ])
  }

  private refreshWithoutReset(content: HTMLElement) {
    this.scroller.refresh(content)
    this.hooks.trigger(this.hooks.eventTypes.refresh, content)
    this.trigger(this.eventTypes.refresh, content)
  }

  proxy(propertiesConfig: PropertyConfig[]) {
    propertiesConfig.forEach(({ key, sourceKey }) => {
      propertiesProxy(this, sourceKey, key)
    })
  }
  refresh() {
    const { contentChanged, valid } = this.setContent(this.wrapper)
    if (valid) {
      const content = this.content
      this.refreshWithoutReset(content)
      if (contentChanged) {
        this.hooks.trigger(this.hooks.eventTypes.contentChanged, content)
        this.trigger(this.eventTypes.contentChanged, content)
      }
      this.scroller.resetPosition()
    }
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

export interface BScrollConstructor extends BScrollInstance {}

export interface CustomAPI {
  [key: string]: {}
}

type ExtractAPI<O> = {
  [K in keyof O]: K extends string
    ? DefOptions[K] extends undefined
      ? CustomAPI[K]
      : never
    : never
}[keyof O]

export function createBScroll<O = {}>(
  el: ElementParam,
  options?: Options & O
): BScrollConstructor & UnionToIntersection<ExtractAPI<O>> {
  const bs = new BScrollConstructor(el, options)
  return (bs as unknown) as BScrollConstructor &
    UnionToIntersection<ExtractAPI<O>>
}

createBScroll.use = BScrollConstructor.use
createBScroll.plugins = BScrollConstructor.plugins
createBScroll.pluginsMap = BScrollConstructor.pluginsMap

type createBScroll = typeof createBScroll
export interface BScrollFactory extends createBScroll {
  new <O = {}>(el: ElementParam, options?: Options & O): BScrollConstructor &
    UnionToIntersection<ExtractAPI<O>>
}

export type BScroll<O = Options> = BScrollConstructor<O> &
  UnionToIntersection<ExtractAPI<O>>

export const BScroll = (createBScroll as unknown) as BScrollFactory
