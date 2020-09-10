import BScroll, { Behavior, Boundary } from '@better-scroll/core'
import { EventEmitter, extend } from '@better-scroll/shared-utils'

export type MovableOptions = Partial<MovableConfig> | true

type InitialPositionX = number | 'left' | 'right' | 'center'
type InitialPositionY = number | 'top' | 'bottom' | 'center'

export interface MovableConfig {
  initialPosition: [InitialPositionX, InitialPositionY]
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    movable?: MovableOptions
  }
}

export default class Movable {
  static pluginName = 'movable'
  options: MovableConfig
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(public scroll: BScroll) {
    this.handleOptions()

    this.handleHooks()
  }

  private handleOptions() {
    const userOptions = (this.scroll.options.movable === true
      ? {}
      : this.scroll.options.movable) as Partial<MovableConfig>
    const defaultOptions: MovableConfig = {
      initialPosition: [0, 0],
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleHooks() {
    this.hooksFn = []
    const { scrollBehaviorX, scrollBehaviorY } = this.scroll.scroller

    this.registerHooks(
      this.scroll.hooks,
      this.scroll.hooks.eventTypes.beforeInitialScrollTo,
      (position: { x: number; y: number }) => {
        const initialPosition = this.options.initialPosition
        const { x, y } = this.resolveInitialPostion(
          initialPosition[0],
          initialPosition[1]
        )
        position.x = x
        position.y = y
      }
    )

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

  resolveInitialPostion(x: InitialPositionX, y: InitialPositionY) {
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
