import { PluginObject, PluginFunction } from '../types/plugin'

import EventEmitter from './EventEmitter'
import Options from './Options'
import ActionsHandler from './ActionsHandler'
import Scroller from './scroller/Scroller'

import { warn } from './util/debug'
import { isUndef } from './util/lang'

import { style, offset, getRect } from './util/dom'

export interface Plugin {
  install: (ctor: BScroll, options?: any[]) => void
  new (): void
}

export default class BScroll extends EventEmitter {
  static readonly Version: string = '2.0.0'
  static _installedPlugins?: Plugin[]
  static _plugins: plugin

  wrapper: HTMLElement | null
  scrollElement: HTMLElement
  scrollElementStyle: CSSStyleDeclaration
  x: number
  y: number
  directionX: number
  directionY: number
  options: Options
  translateZ: string
  lastScale: number
  scale: number
  enabled: boolean
  wrapperWidth: number
  wrapperHeight: number
  scrollerWidth: number
  scrollerHeight: number
  relativeX: number
  relativeY: number
  minScrollX: number
  maxScrollX: number
  minScrollY: number
  maxScrollY: number
  hasHorizontalScroll: boolean
  hasVerticalScroll: boolean
  isAnimating: boolean
  isInTransition: boolean
  stopFromTransition: boolean
  actionsHandler: ActionsHandler
  scroller: Scroller
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
    if (!this._plugins) {
      this._plugins = {}
    }
    if (this._plugins[name]) {
      warn(
        `This plugin has been registered, maybe you need change plugin's name`
      )
    }
    this._plugins[name] = ctor
  }

  constructor(el: HTMLElement | string, options: object) {
    super()
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
    this.init()
  }

  private init() {
    const { autoBlur, startX, startY } = this.options

    this.x = 0
    this.y = 0

    this.setScale(1)

    this.actionsHandler = new ActionsHandler(this)
    this.scroller = new Scroller(this)

    this.applyPlugins()

    if (autoBlur) {
      this.handleAutoBlur()
    }

    this.refresh()

    this.enable()

    this.scrollTo(startX, startY)
  }

  setScale(scale: number) {
    this.lastScale = isUndef(this.scale) ? scale : this.scale
    this.scale = scale
  }

  private applyPlugins() {
    const options = this.options
    const _plugins = (<typeof BScroll>this.constructor)._plugins || {}
    let ctor
    for (let pluginName in _plugins) {
      ctor = _plugins[pluginName]
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
    const wrapper = this.wrapper as HTMLElement
    const isWrapperStatic =
      window.getComputedStyle(wrapper, null).position === 'static'
    let wrapperRect = getRect(wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let scrollerRect = getRect(this.scrollElement)
    this.scrollElementWidth = Math.round(scrollerRect.width * this.scale)
    this.scrollElementHeight = Math.round(scrollerRect.height * this.scale)

    this.relativeX = scrollerRect.left
    this.relativeY = scrollerRect.top

    if (isWrapperStatic) {
      this.relativeX -= wrapperRect.left
      this.relativeY -= wrapperRect.top
    }

    this.minScrollX = 0
    this.minScrollY = 0

    this.hasHorizontalScroll =
      this.options.scrollX && this.maxScrollX < this.minScrollX
    this.hasVerticalScroll =
      this.options.scrollY && this.maxScrollY < this.minScrollY

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = this.minScrollX
      this.scrollElementWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = this.minScrollY
      this.scrollElementHeight = this.wrapperHeight
    }

    this.endTime = 0
    this.directionX = 0
    this.directionY = 0
    this.wrapperOffset = offset(this.wrapper)

    this.trigger('refresh')

    !this.scaled && this.resetPosition()
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  destroy() {}
}
