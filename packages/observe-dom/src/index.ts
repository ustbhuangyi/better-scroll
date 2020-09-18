import BScroll from '@better-scroll/core'
import { getRect, EventEmitter } from '@better-scroll/shared-utils'

declare module '@better-scroll/core' {
  interface CustomOptions {
    observeDOM?: true
  }
}
export default class ObserveDOM {
  static pluginName = 'observeDOM'
  observer: MutationObserver
  private stopObserver: boolean = false
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    this.handleMutationObserver()
    this.handleHooks()
  }
  private handleMutationObserver() {
    if (typeof MutationObserver !== 'undefined') {
      let timer = 0
      this.observer = new MutationObserver((mutations) => {
        this.mutationObserverHandler(mutations, timer)
      })
      this.startObserve(this.observer)
    } else {
      this.checkDOMUpdate()
    }
  }
  private handleHooks() {
    this.hooksFn = []
    this.registerHooks(
      this.scroll.hooks,
      this.scroll.hooks.eventTypes.contentChanged,
      () => {
        this.stopObserve()
        // launch a new mutationObserver
        this.handleMutationObserver()
      }
    )
    this.registerHooks(
      this.scroll.hooks,
      this.scroll.hooks.eventTypes.enable,
      () => {
        if (this.stopObserver) {
          this.handleMutationObserver()
        }
      }
    )
    this.registerHooks(
      this.scroll.hooks,
      this.scroll.hooks.eventTypes.disable,
      () => {
        this.stopObserve()
      }
    )
    this.registerHooks(
      this.scroll.hooks,
      this.scroll.hooks.eventTypes.destroy,
      () => {
        this.destroy()
      }
    )
  }
  private mutationObserverHandler(mutations: MutationRecord[], timer: number) {
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
        if (mutation.target !== this.scroll.scroller.content) {
          deferredRefresh = true
          break
        }
      }
    }

    if (immediateRefresh) {
      this.scroll.refresh()
    } else if (deferredRefresh) {
      // attributes changes too often
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!this.shouldNotRefresh()) {
          this.scroll.refresh()
        }
      }, 60)
    }
  }

  private startObserve(observer: MutationObserver) {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    }
    observer.observe(this.scroll.scroller.content, config)
  }

  private shouldNotRefresh() {
    const { scroller } = this.scroll
    const { scrollBehaviorX, scrollBehaviorY } = scroller
    let outsideBoundaries =
      scrollBehaviorX.currentPos > scrollBehaviorX.minScrollPos ||
      scrollBehaviorX.currentPos < scrollBehaviorX.maxScrollPos ||
      scrollBehaviorY.currentPos > scrollBehaviorY.minScrollPos ||
      scrollBehaviorY.currentPos < scrollBehaviorY.maxScrollPos
    return scroller.animater.pending || outsideBoundaries
  }

  private checkDOMUpdate() {
    const content = this.scroll.scroller.content
    let contentRect = getRect(content)
    let oldWidth = contentRect.width
    let oldHeight = contentRect.height

    const check = () => {
      if (this.stopObserver) {
        return
      }
      contentRect = getRect(content)
      let newWidth = contentRect.width
      let newHeight = contentRect.height

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.scroll.refresh()
      }
      oldWidth = newWidth
      oldHeight = newHeight

      next()
    }

    const next = () => {
      setTimeout(() => {
        check()
      }, 1000)
    }

    next()
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  private stopObserve() {
    this.stopObserver = true
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  destroy() {
    this.stopObserve()
    this.hooksFn.forEach((item) => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }
}
