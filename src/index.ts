import { PluginObject, PluginFunction } from '../types/plugin'

import EventEmitter from './scroll/event-emitter'
import BScrollOptions from './scroll/options'

import { warn } from './util/debug'
import { extend, isUndef } from './util/lang'

import {
  hasTouch,
  style,
  offset,
  addEvent,
  getRect,
  preventDefaultException
} from './util/dom'

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

  wrapper: HTMLElement | null
  scroller?: HTMLElement
  scrollerStyle?: object
  x?: number
  y?: number
  directionX?: number
  directionY?: number
  options?: BScrollOptions
  translateZ?: string
  lastScale?: number
  scale?: number
  enabled?: boolean
  [key: string]: any

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

  constructor(el: HTMLElement | string, options: object) {
    super()
    this.wrapper = typeof el === 'string' ? document.querySelector(el) : el

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
    this.options = new BScrollOptions().merge(options).process()
    this.init()
  }

  private init() {
    this.x = 0
    this.y = 0
    this.directionX = 0
    this.directionY = 0

    this.setScale(1)

    this.addDOMEvents()

    this.applyPlugins()

    this.watchTransition()

    if (this.options.observeDOM) {
      this.initDOMObserver()
    }

    if (this.options.autoBlur) {
      this.handleAutoBlur()
    }

    this.refresh()

    if (!this.options.snap) {
      this.scrollTo(this.options.startX, this.options.startY)
    }

    this.enable()
  }
  setScale(scale: number) {
    this.lastScale = isUndef(this.scale) ? scale : this.scale
    this.scale = scale
  }
  private addDOMEvents() {
    let eventOperation = addEvent
    this.handleDOMEvents(eventOperation)
  }
  private handleDOMEvents(eventOperation: Function) {
    const _options = this.options as any
    let target = _options.bindToWrapper ? this.wrapper : window
    eventOperation(window, 'orientationchange', this)
    eventOperation(window, 'resize', this)

    if (_options.click) {
      eventOperation(this.wrapper, 'click', this, true)
    }

    if (!_options.disableMouse) {
      eventOperation(this.wrapper, 'mousedown', this)
      eventOperation(target, 'mousemove', this)
      eventOperation(target, 'mousecancel', this)
      eventOperation(target, 'mouseup', this)
    }

    if (hasTouch && !_options.disableTouch) {
      eventOperation(this.wrapper, 'touchstart', this)
      eventOperation(target, 'touchmove', this)
      eventOperation(target, 'touchcancel', this)
      eventOperation(target, 'touchend', this)
    }

    eventOperation(this.scroller, style.transitionEnd, this)
  }
  private applyPlugins() {
    const _options = this.options as any
    const _plugins = (<typeof BScroll>this.constructor)._plugins || []
    for (let i = 0; i < _plugins.length; i++) {
      const [name, ctor] = _plugins[i]
      if (_options[name]) {
        typeof ctor === 'function' && new ctor(this)
      }
    }
  }
  private initDOMObserver() {
    if (typeof MutationObserver !== 'undefined') {
      let timer: any
      let observer = new MutationObserver(mutations => {
        // don't do any refresh during the transition, or outside of the boundaries
        if (this.shouldNotRefresh()) {
          return
        }
        let immediateRefresh = false
        let deferredRefresh = false
        for (let i = 0; i < mutations.length; i++) {
          const mutation = mutations[i]
          if (mutation.type !== 'attributes') {
            immediateRefresh = true
            break
          } else {
            if (mutation.target !== this.scroller) {
              deferredRefresh = true
              break
            }
          }
        }
        if (immediateRefresh) {
          this.refresh()
        } else if (deferredRefresh) {
          // attributes changes too often
          clearTimeout(timer)
          timer = setTimeout(() => {
            if (!this.shouldNotRefresh()) {
              this.refresh()
            }
          }, 60)
        }
      })
      const config = {
        attributes: true,
        childList: true,
        subtree: true
      }
      observer.observe(this.scroller as Node, config)

      this.on('destroy', () => {
        observer.disconnect()
      })
    } else {
      this.checkDOMUpdate()
    }
  }
  private shouldNotRefresh() {
    let outsideBoundaries =
      this.x > this.minScrollX ||
      this.x < this.maxScrollX ||
      this.y > this.minScrollY ||
      this.y < this.maxScrollY
    return this.isInTransition || this.stopFromTransition || outsideBoundaries
  }
  private checkDOMUpdate() {
    let scrollerRect = getRect(this.scroller)
    let oldWidth = scrollerRect.width
    let oldHeight = scrollerRect.height

    function check(this: BScroll) {
      if (this.destroyed) {
        return
      }
      scrollerRect = getRect(this.scroller)
      let newWidth = scrollerRect.width
      let newHeight = scrollerRect.height

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.refresh()
      }
      oldWidth = newWidth
      oldHeight = newHeight

      next.call(this)
    }

    function next(this: BScroll) {
      setTimeout(() => {
        check.call(this)
      }, 1000)
    }

    next.call(this)
  }
  private watchTransition() {}
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
  handleEvent(e: Event) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e)
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoomStart(e)
        }
        break
      case 'touchmove':
      case 'mousemove':
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          this._zoom(e)
        } else {
          this._move(e)
        }
        break
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        if (this.scaled) {
          this._zoomEnd(e)
        } else {
          this._end(e)
        }
        break
      case 'orientationchange':
      case 'resize':
        this._resize()
        break
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e)
        break
      case 'click':
        if (this.enabled && !e._constructed) {
          if (
            !preventDefaultException(
              e.target,
              this.options.preventDefaultException
            )
          ) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
      case 'wheel':
      case 'DOMMouseScroll':
      case 'mousewheel':
        this._onMouseWheel(e)
        break
    }
  }
  refresh() {
    const isWrapperStatic =
      window.getComputedStyle(this.wrapper, null).position === 'static'
    let wrapperRect = getRect(this.wrapper)
    this.wrapperWidth = wrapperRect.width
    this.wrapperHeight = wrapperRect.height

    let scrollerRect = getRect(this.scroller)
    this.scrollerWidth = Math.round(scrollerRect.width * this.scale)
    this.scrollerHeight = Math.round(scrollerRect.height * this.scale)

    this.relativeX = scrollerRect.left
    this.relativeY = scrollerRect.top

    if (isWrapperStatic) {
      this.relativeX -= wrapperRect.left
      this.relativeY -= wrapperRect.top
    }

    this.minScrollX = 0
    this.minScrollY = 0

    const wheel = this.options.wheel
    if (wheel) {
      this.items = this.scroller.children
      this.options.itemHeight = this.itemHeight = this.items.length
        ? this.scrollerHeight / this.items.length
        : 0
      if (this.selectedIndex === undefined) {
        this.selectedIndex = wheel.selectedIndex || 0
      }
      this.options.startY = -this.selectedIndex * this.itemHeight
      this.maxScrollX = 0
      this.maxScrollY = -this.itemHeight * (this.items.length - 1)
    } else {
      this.maxScrollX = this.wrapperWidth - this.scrollerWidth
      if (!this.options.infinity) {
        this.maxScrollY = this.wrapperHeight - this.scrollerHeight
      }
      if (this.maxScrollX < 0) {
        this.maxScrollX -= this.relativeX
        this.minScrollX = -this.relativeX
      } else if (this.scale > 1) {
        this.maxScrollX = this.maxScrollX / 2 - this.relativeX
        this.minScrollX = this.maxScrollX
      }
      if (this.maxScrollY < 0) {
        this.maxScrollY -= this.relativeY
        this.minScrollY = -this.relativeY
      } else if (this.scale > 1) {
        this.maxScrollY = this.maxScrollY / 2 - this.relativeY
        this.minScrollY = this.maxScrollY
      }
    }

    this.hasHorizontalScroll =
      this.options.scrollX && this.maxScrollX < this.minScrollX
    this.hasVerticalScroll =
      this.options.scrollY && this.maxScrollY < this.minScrollY

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = this.minScrollX
      this.scrollerWidth = this.wrapperWidth
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = this.minScrollY
      this.scrollerHeight = this.wrapperHeight
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
}
