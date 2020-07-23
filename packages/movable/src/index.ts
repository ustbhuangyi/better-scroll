import BScroll, { Behavior, Boundary } from '@better-scroll/core'
import { ApplyOrder, EventEmitter } from '@better-scroll/shared-utils'

declare module '@better-scroll/core' {
  interface Options {
    movable?: boolean
  }
}

export default class Movable {
  static pluginName = 'movable'
  static applyOrder = ApplyOrder.Pre
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.hooksFn = []
    const scrollBehaviorX = this.scroll.scroller.scrollBehaviorX
    const scrollBehaviorY = this.scroll.scroller.scrollBehaviorY
    const computeBoundary = (boundary: Boundary, behavior: Behavior) => {
      if (!behavior.options.scrollable) return
      if (boundary.maxScrollPos > 0) {
        // content is smaller than wrapper
        boundary.minScrollPos = behavior.wrapperSize - behavior.contentSize
        boundary.maxScrollPos = 0
      }
    }
    const computeBoundaryHook = 'computeBoundary'
    this.registorHooks(
      scrollBehaviorX.hooks,
      computeBoundaryHook,
      (boundary: Boundary) => {
        computeBoundary(boundary, scrollBehaviorX)
      }
    )
    this.registorHooks(
      scrollBehaviorY.hooks,
      computeBoundaryHook,
      (boundary: Boundary) => {
        computeBoundary(boundary, scrollBehaviorY)
      }
    )
    this.registorHooks(this.scroll.hooks, 'destroy', () => {
      this.destroy()
    })

    // trigger refresh
    scroll.refresh()
  }
  destroy() {
    this.hooksFn.forEach(item => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }
  private registorHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }
}
