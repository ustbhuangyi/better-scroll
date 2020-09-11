import BScroll, { Behavior, Boundary } from '@better-scroll/core'
import {
  ease,
  EventEmitter,
  ApplyOrder,
  EaseItem,
} from '@better-scroll/shared-utils'
import propertiesConfig from './propertiesConfig'

type PositionX = number | 'left' | 'right' | 'center'
type PositionY = number | 'top' | 'bottom' | 'center'

declare module '@better-scroll/core' {
  interface CustomOptions {
    movable?: true
  }
  interface CustomAPI {
    movable: PluginAPI
  }
}

interface PluginAPI {
  putAt(x: PositionX, y: PositionY, time?: number, easing?: EaseItem): void
}

export default class Movable implements PluginAPI {
  static pluginName = 'movable'
  static applyOrder = ApplyOrder.Pre
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.handleBScroll()
    this.handleHooks()
  }

  private handleBScroll() {
    this.scroll.proxy(propertiesConfig)
  }

  private handleHooks() {
    this.hooksFn = []
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller

    const computeBoundary = (boundary: Boundary, behavior: Behavior) => {
      if (boundary.maxScrollPos > 0) {
        // content is smaller than wrapper
        boundary.minScrollPos = behavior.wrapperSize - behavior.contentSize
        boundary.maxScrollPos = 0
      }
    }

    this.registerHooks(
      scrollBehaviorX.hooks,
      scrollBehaviorX.hooks.eventTypes.ignoreHasScroll,
      () => true
    )
    this.registerHooks(
      scrollBehaviorX.hooks,
      scrollBehaviorX.hooks.eventTypes.computeBoundary,
      (boundary: Boundary) => {
        computeBoundary(boundary, scrollBehaviorX)
      }
    )

    this.registerHooks(
      scrollBehaviorY.hooks,
      scrollBehaviorY.hooks.eventTypes.ignoreHasScroll,
      () => true
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

  putAt(
    x: PositionX,
    y: PositionY,
    time = this.scroll.options.bounceTime,
    easing = ease.bounce
  ) {
    const position = this.resolvePostion(x, y)
    this.scroll.scrollTo(position.x, position.y, time, easing)
  }

  private resolvePostion(x: PositionX, y: PositionY): { x: number; y: number } {
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller
    const resolveFormula = {
      left() {
        return 0
      },
      top() {
        return 0
      },
      right() {
        return scrollBehaviorX.minScrollPos
      },
      bottom() {
        return scrollBehaviorY.minScrollPos
      },
      center(index: number) {
        const baseSize =
          index === 0
            ? scrollBehaviorX.minScrollPos
            : scrollBehaviorY.minScrollPos
        return baseSize / 2
      },
    }
    return {
      x: typeof x === 'number' ? x : resolveFormula[x](0),
      y: typeof y === 'number' ? y : resolveFormula[y](1),
    }
  }

  destroy() {
    this.hooksFn.forEach((item) => {
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
