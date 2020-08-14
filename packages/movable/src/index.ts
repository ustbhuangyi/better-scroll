import BScroll, { Behavior, Boundary } from '@better-scroll/core'
import { ApplyOrder, EventEmitter } from '@better-scroll/shared-utils'

declare module '@better-scroll/core' {
  interface CustomOptions {
    movable?: boolean
  }
}

export default class Movable {
  static pluginName = 'movable'
  static applyOrder = ApplyOrder.Pre
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.handleHooks()
  }

  private handleHooks() {
    this.hooksFn = []
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const computeBoundary = (boundary: Boundary, behavior: Behavior) => {
      if (!behavior.options.scrollable) return
      if (boundary.maxScrollPos > 0) {
        // content is smaller than wrapper
        boundary.minScrollPos = behavior.wrapperSize - behavior.contentSize
        boundary.maxScrollPos = 0
      }
    }

    this.registerHooks(
      scrollBehaviorX.hooks,
      scrollBehaviorX.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        computeBoundary(boundary, scrollBehaviorX)
      }
    )
    this.registerHooks(
      scrollBehaviorY.hooks,
      scrollBehaviorY.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        computeBoundary(boundary, scrollBehaviorY)
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

  destroy() {
    this.hooksFn.forEach(item => {
      const hooks = item[0]
      const hooksName = item[1]
      const handlerFn = item[2]
      hooks.off(hooksName, handlerFn)
    })
    this.hooksFn.length = 0
  }
  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }
}
