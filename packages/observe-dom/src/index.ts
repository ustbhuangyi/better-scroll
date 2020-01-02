import BScroll from '@better-scroll/core'
import { getRect, EventEmitter } from '@better-scroll/shared-utils'

declare module '@better-scroll/core' {
  interface Options {
    observeDOM?: boolean
  }
}
export default class ObserveDOM {
  static pluginName = 'observeDOM'
  private observer: MutationObserver
  private stopObserver: boolean
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.stopObserver = false
    this.hooksFn = []
    this.init()
    this.registorHooks(this.scroll.hooks, 'enable', () => {
      if (this.stopObserver) {
        this.init()
      }
    })
    this.registorHooks(this.scroll.hooks, 'disable', () => {
      this.stopObserve()
    })
    this.registorHooks(this.scroll.hooks, 'destroy', () => {
      this.destroy()
    })
  }
  init() {
    if (typeof MutationObserver !== 'undefined') {
      let timer = 0
      this.observer = new MutationObserver(mutations => {
        this.mutationObserverHandler(mutations, timer)
      })
      this.startObserve(this.observer)
    } else {
      this.checkDOMUpdate()
    }
  }
  destroy() {
    this.stopObserve()
    this.hooksFn.forEach(item => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
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
      subtree: true
    }
    observer.observe(this.scroll.scroller.content, config)
  }
  private shouldNotRefresh() {
    const scroller = this.scroll.scroller
    const scrollBehaviorX = scroller.scrollBehaviorX
    const scrollBehaviorY = scroller.scrollBehaviorY
    let outsideBoundaries =
      scrollBehaviorX.currentPos > scrollBehaviorX.minScrollPos ||
      scrollBehaviorX.currentPos < scrollBehaviorX.maxScrollPos ||
      scrollBehaviorY.currentPos > scrollBehaviorY.minScrollPos ||
      scrollBehaviorY.currentPos < scrollBehaviorY.maxScrollPos

    return scroller.animater.pending || outsideBoundaries
  }
  private checkDOMUpdate() {
    const me = this
    const scrollIns = this.scroll
    const scrollerEl = scrollIns.scroller.content
    let scrollerRect = getRect(scrollerEl)
    let oldWidth = scrollerRect.width
    let oldHeight = scrollerRect.height

    function check() {
      if (me.stopObserver) {
        return
      }
      scrollerRect = getRect(scrollerEl)
      let newWidth = scrollerRect.width
      let newHeight = scrollerRect.height

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        scrollIns.refresh()
      }
      oldWidth = newWidth
      oldHeight = newHeight

      next()
    }

    function next() {
      setTimeout(() => {
        check()
      }, 1000)
    }

    next()
  }
  private registorHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }
  private stopObserve() {
    this.stopObserver = true
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
