import BScroll from '../../index'
import { getRect } from '../../util/dom'
import { staticImplements, PluginCtor } from '../type'

@staticImplements<PluginCtor>()
export default class ObserveDOM {
  static pluginName = 'observeDOM'
  private observer: MutationObserver
  private stopObserver: boolean
  constructor(public scroll: BScroll) {
    this.stopObserver = false
    this.init()
    this.scroll.hooks.on('enable', () => {
      if (this.stopObserver) {
        this.init()
      }
    })
    this.scroll.hooks.on('disable', () => {
      this.destroy()
    })
  }
  init() {
    if (typeof MutationObserver !== 'undefined') {
      let timer = 0
      this.observer = new MutationObserver(mutations => {
        this.handler(mutations, timer)
      })
      this.startObserve(this.observer)
    } else {
      this.checkDOMUpdate()
    }
  }
  destroy() {
    this.stopObserver = true
    if (this.observer) {
      this.observer.disconnect()
    }
  }
  private handler(mutations: MutationRecord[], timer: number) {
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
    const scrollIns = this.scroll
    let outsideBoundaries =
      scrollIns.x > scrollIns.minScrollX ||
      scrollIns.x < scrollIns.maxScrollX ||
      scrollIns.y > scrollIns.minScrollY ||
      scrollIns.y < scrollIns.maxScrollY

    return scrollIns.pending || outsideBoundaries
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
}
