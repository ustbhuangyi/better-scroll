import BScroll, { MountedBScrollHTMLElement } from '@better-scroll/core'
import {
  Direction,
  EventEmitter,
  extend,
  warn,
  findIndex,
} from '@better-scroll/shared-utils'
import BScrollFamily from './BScrollFamily'
import propertiesConfig from './propertiesConfig'

export const DEFAUL_GROUP_ID = 'INTERNAL_NESTED_SCROLL'

export type NestedScrollGroupId = string | number

export interface NestedScrollConfig {
  groupId: NestedScrollGroupId
}

export type NestedScrollOptions = NestedScrollConfig | true

declare module '@better-scroll/core' {
  interface CustomOptions {
    nestedScroll?: NestedScrollOptions
  }
  interface CustomAPI {
    nestedScroll: PluginAPI
  }
}

interface PluginAPI {
  purgeNestedScroll(groupId: NestedScrollGroupId): void
}

interface NestedScrollInstancesMap {
  [key: string]: NestedScroll
  [index: number]: NestedScroll
}

const hasScroll = (scroll: BScroll) => {
  return {
    hasHorizontalScroll: scroll.hasHorizontalScroll,
    hasVerticalScroll: scroll.hasVerticalScroll,
  }
}

const syncTouchstartData = (scroll: BScroll) => {
  const { hasHorizontalScroll, hasVerticalScroll } = hasScroll(scroll)
  const { actions, scrollBehaviorX, scrollBehaviorY } = scroll.scroller

  actions.startTime = +new Date()

  if (hasVerticalScroll) {
    scrollBehaviorY.startPos = scrollBehaviorY.currentPos
  } else if (hasHorizontalScroll) {
    scrollBehaviorX.startPos = scrollBehaviorX.currentPos
  }
}

const isOutOfBoundary = (scroll: BScroll): boolean => {
  const { hasHorizontalScroll, hasVerticalScroll } = hasScroll(scroll)
  const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller
  let ret = false

  const outOfLeftBoundary =
    scroll.x >= scroll.minScrollX &&
    scrollBehaviorX.movingDirection === Direction.Negative
  const outOfRightBoundary =
    scroll.x <= scroll.maxScrollX &&
    scrollBehaviorX.movingDirection === Direction.Positive
  const outOfTopBoundary =
    scroll.y >= scroll.minScrollY &&
    scrollBehaviorY.movingDirection === Direction.Negative
  const outOfBottomBoundary =
    scroll.y <= scroll.maxScrollY &&
    scrollBehaviorY.movingDirection === Direction.Positive

  if (hasVerticalScroll) {
    ret = outOfTopBoundary || outOfBottomBoundary
  } else if (hasHorizontalScroll) {
    ret = outOfLeftBoundary || outOfRightBoundary
  }
  return ret
}

export default class NestedScroll implements PluginAPI {
  static pluginName = 'nestedScroll'
  static instancesMap: NestedScrollInstancesMap = {}
  store: BScrollFamily[]
  options: NestedScrollConfig
  private hooksFn: Array<[EventEmitter, string, Function]>
  constructor(scroll: BScroll) {
    const groupId = this.handleOptions(scroll)
    let instance = NestedScroll.instancesMap[groupId]
    if (!instance) {
      instance = NestedScroll.instancesMap[groupId] = this
      instance.store = []
      instance.hooksFn = []
    }

    instance.init(scroll)

    return instance
  }

  static getAllNestedScrolls(): NestedScroll[] {
    const instancesMap = NestedScroll.instancesMap
    return Object.keys(instancesMap).map((key) => instancesMap[key])
  }

  static purgeAllNestedScrolls() {
    const nestedScrolls = NestedScroll.getAllNestedScrolls()
    nestedScrolls.forEach((ns) => ns.purgeNestedScroll())
  }

  private handleOptions(scroll: BScroll): number | string {
    const userOptions = (scroll.options.nestedScroll === true
      ? {}
      : scroll.options.nestedScroll) as NestedScrollConfig
    const defaultOptions: NestedScrollConfig = {
      groupId: DEFAUL_GROUP_ID,
    }
    this.options = extend(defaultOptions, userOptions)

    const groupIdType = typeof this.options.groupId
    if (groupIdType !== 'string' && groupIdType !== 'number') {
      warn('groupId must be string or number for NestedScroll plugin')
    }

    return this.options.groupId
  }

  private init(scroll: BScroll) {
    scroll.proxy(propertiesConfig)
    this.addBScroll(scroll)
    this.buildBScrollGraph()
    this.analyzeBScrollGraph()
    this.handleHooks(scroll)
  }

  private handleHooks(scroll: BScroll) {
    this.registerHooks(scroll.hooks, scroll.hooks.eventTypes.destroy, () => {
      this.deleteScroll(scroll)
    })
  }

  deleteScroll(scroll: BScroll) {
    const wrapper = scroll.wrapper as MountedBScrollHTMLElement
    wrapper.isBScrollContainer = undefined
    const store = this.store
    const hooksFn = this.hooksFn
    const i = findIndex(store, (bscrollFamily) => {
      return bscrollFamily.selfScroll === scroll
    })
    if (i > -1) {
      const bscrollFamily = store[i]
      bscrollFamily.purge()
      store.splice(i, 1)
    }
    const k = findIndex(hooksFn, ([hooks, eventType, handler]) => {
      return hooks === scroll.hooks
    })
    if (k > -1) {
      const [hooks, eventType, handler] = hooksFn[k]
      hooks.off(eventType, handler)
      hooksFn.splice(k, 1)
    }
  }

  addBScroll(scroll: BScroll) {
    this.store.push(BScrollFamily.create(scroll))
  }

  private buildBScrollGraph() {
    const store = this.store

    let bf1: BScrollFamily
    let bf2: BScrollFamily
    let wrapper1: MountedBScrollHTMLElement
    let wrapper2: MountedBScrollHTMLElement
    let len = this.store.length

    // build graph relationship
    for (let i = 0; i < len; i++) {
      bf1 = store[i]
      wrapper1 = bf1.selfScroll.wrapper
      for (let j = 0; j < len; j++) {
        bf2 = store[j]
        wrapper2 = bf2.selfScroll.wrapper

        // same bs
        if (bf1 === bf2) continue

        if (!wrapper1.contains(wrapper2)) continue

        // bs1 contains bs2
        if (!bf1.hasDescendants(bf2)) {
          bf1.addDescendant(bf2)
        }

        if (!bf2.hasAncestors(bf1)) {
          bf2.addAncestor(bf1)
        }
      }
    }
  }

  private analyzeBScrollGraph() {
    this.store.forEach((bscrollFamily) => {
      if (bscrollFamily.analyzed) {
        return
      }

      const { ancestors, descendants } = bscrollFamily

      const beforeScrollStartHandler = () => {
        const stopHandler = (instance: BScroll) => {
          if (instance.pending) {
            instance.stop()
            instance.resetPosition()
          }
        }
        ancestors.forEach(({ selfScroll }) => {
          stopHandler(selfScroll)
          selfScroll.disable()
          syncTouchstartData(selfScroll)
        })

        descendants.forEach(({ selfScroll }) => {
          stopHandler(selfScroll)
        })
      }

      const touchEndHandler = () => {
        enableScrollHander(ancestors)
        enableScrollHander(descendants)
      }

      const enableScrollHander = (scrolls: BScrollFamily[]) => {
        scrolls.forEach(({ selfScroll }) => {
          selfScroll.enable()
        })
      }

      const currentScroll = bscrollFamily.selfScroll

      const scrollStartHandler = () => {
        // only top scroll can perform a bounce effect
        const isTopScroll = ancestors.length === 0
        if (!isTopScroll && isOutOfBoundary(currentScroll)) {
          currentScroll.disable()
          enableScrollHander(ancestors)
        }
      }

      bscrollFamily.registerHooks(
        currentScroll,
        currentScroll.eventTypes.beforeScrollStart,
        beforeScrollStartHandler
      )
      bscrollFamily.registerHooks(
        currentScroll,
        currentScroll.eventTypes.touchEnd,
        touchEndHandler
      )
      bscrollFamily.registerHooks(
        currentScroll,
        currentScroll.eventTypes.scrollStart,
        scrollStartHandler
      )
      const selfActionsHooks = currentScroll.scroller.actions.hooks
      bscrollFamily.registerHooks(
        selfActionsHooks,
        selfActionsHooks.eventTypes.contentNotMoved,
        () => {
          enableScrollHander(ancestors)
        }
      )

      bscrollFamily.setAnalyzed(true)
    })
  }

  private registerHooks(hooks: EventEmitter, name: string, handler: Function) {
    hooks.on(name, handler, this)
    this.hooksFn.push([hooks, name, handler])
  }

  purgeNestedScroll() {
    const groupId = this.options.groupId
    this.store.forEach((bscrollFamily) => {
      bscrollFamily.purge()
    })
    this.store = []

    this.hooksFn.forEach(([hooks, eventType, handler]) => {
      hooks.off(eventType, handler)
    })
    this.hooksFn = []

    delete NestedScroll.instancesMap[groupId]
  }
}
