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

const forceScrollStopHandler = (scrolls: BScroll[]) => {
  scrolls.forEach((scroll) => {
    if (scroll.pending) {
      scroll.stop()
      scroll.resetPosition()
    }
  })
}

const enableScrollHander = (scrolls: BScroll[]) => {
  scrolls.forEach((scroll) => {
    scroll.enable()
  })
}

const disableScrollHander = (scrolls: BScroll[], currentScroll: BScroll) => {
  scrolls.forEach((scroll) => {
    if (
      scroll.hasHorizontalScroll === currentScroll.hasHorizontalScroll ||
      scroll.hasVerticalScroll === currentScroll.hasVerticalScroll
    ) {
      scroll.disable()
    }
  })
}

const syncTouchstartData = (scrolls: BScroll[]) => {
  scrolls.forEach((scroll) => {
    const { actions, scrollBehaviorX, scrollBehaviorY } = scroll.scroller

    // prevent click triggering many times
    actions.fingerMoved = true
    actions.contentMoved = false

    actions.directionLockAction.reset()

    scrollBehaviorX.start()
    scrollBehaviorY.start()

    scrollBehaviorX.resetStartPos()
    scrollBehaviorY.resetStartPos()

    actions.startTime = +new Date()
  })
}

const isOutOfBoundary = (scroll: BScroll): boolean => {
  const {
    hasHorizontalScroll,
    hasVerticalScroll,
    x,
    y,
    minScrollX,
    maxScrollX,
    minScrollY,
    maxScrollY,
    movingDirectionX,
    movingDirectionY,
  } = scroll
  let ret = false

  const outOfLeftBoundary =
    x >= minScrollX && movingDirectionX === Direction.Negative
  const outOfRightBoundary =
    x <= maxScrollX && movingDirectionX === Direction.Positive
  const outOfTopBoundary =
    y >= minScrollY && movingDirectionY === Direction.Negative
  const outOfBottomBoundary =
    y <= maxScrollY && movingDirectionY === Direction.Positive

  if (hasVerticalScroll) {
    ret = outOfTopBoundary || outOfBottomBoundary
  } else if (hasHorizontalScroll) {
    ret = outOfLeftBoundary || outOfRightBoundary
  }

  return ret
}

const isResettingPosition = (scroll: BScroll): boolean => {
  const {
    hasHorizontalScroll,
    hasVerticalScroll,
    x,
    y,
    minScrollX,
    maxScrollX,
    minScrollY,
    maxScrollY,
  } = scroll
  let ret = false

  const outOfLeftBoundary = x > minScrollX
  const outOfRightBoundary = x < maxScrollX
  const outOfTopBoundary = y > minScrollY
  const outOfBottomBoundary = y < maxScrollY

  if (hasVerticalScroll) {
    ret = outOfTopBoundary || outOfBottomBoundary
  } else if (hasHorizontalScroll) {
    ret = outOfLeftBoundary || outOfRightBoundary
  }

  return ret
}

const resetPositionHandler = (scroll: BScroll) => {
  scroll.scroller.reflow()
  scroll.resetPosition(0 /* Immediately */)
}

const calculateDistance = (
  childNode: HTMLElement,
  parentNode: HTMLElement
): number => {
  let distance = 0
  let parent = childNode.parentNode
  while (parent && parent !== parentNode) {
    distance++
    parent = parent.parentNode
  }
  return distance
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
    this.ensureEventInvokeSequence()
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
    const k = findIndex(hooksFn, ([hooks]) => {
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

    // build graph
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
        const distance = calculateDistance(wrapper2, wrapper1)
        if (!bf1.hasDescendants(bf2)) {
          bf1.addDescendant(bf2, distance)
        }

        if (!bf2.hasAncestors(bf1)) {
          bf2.addAncestor(bf1, distance)
        }
      }
    }
  }

  private analyzeBScrollGraph() {
    this.store.forEach((bscrollFamily) => {
      if (bscrollFamily.analyzed) {
        return
      }

      const {
        ancestors,
        descendants,
        selfScroll: currentScroll,
      } = bscrollFamily

      const beforeScrollStartHandler = () => {
        // always get the latest scroll
        const ancestorScrolls = ancestors.map(
          ([bscrollFamily]) => bscrollFamily.selfScroll
        )
        const descendantScrolls = descendants.map(
          ([bscrollFamily]) => bscrollFamily.selfScroll
        )
        forceScrollStopHandler([...ancestorScrolls, ...descendantScrolls])

        if (isResettingPosition(currentScroll)) {
          resetPositionHandler(currentScroll)
        }
        syncTouchstartData(ancestorScrolls)
        disableScrollHander(ancestorScrolls, currentScroll)
      }

      const touchEndHandler = () => {
        const ancestorScrolls = ancestors.map(
          ([bscrollFamily]) => bscrollFamily.selfScroll
        )
        const descendantScrolls = descendants.map(
          ([bscrollFamily]) => bscrollFamily.selfScroll
        )
        enableScrollHander([...ancestorScrolls, ...descendantScrolls])
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

      const selfActionsHooks = currentScroll.scroller.actions.hooks
      bscrollFamily.registerHooks(
        selfActionsHooks,
        selfActionsHooks.eventTypes.detectMovingDirection,
        () => {
          const ancestorScrolls = ancestors.map(
            ([bscrollFamily]) => bscrollFamily.selfScroll
          )
          const parentScroll = ancestorScrolls[0]
          const otherAncestorScrolls = ancestorScrolls.slice(1)
          const contentMoved = currentScroll.scroller.actions.contentMoved
          const isTopScroll = ancestorScrolls.length === 0
          if (contentMoved) {
            disableScrollHander(ancestorScrolls, currentScroll)
          } else if (!isTopScroll) {
            if (isOutOfBoundary(currentScroll)) {
              disableScrollHander([currentScroll], currentScroll)
              if (parentScroll) {
                enableScrollHander([parentScroll])
              }
              disableScrollHander(otherAncestorScrolls, currentScroll)
              return true
            }
          }
        }
      )
      bscrollFamily.setAnalyzed(true)
    })
  }
  // make sure touchmove|touchend invoke from child to parent
  private ensureEventInvokeSequence() {
    const copied = this.store.slice()
    const sequencedScroll = copied.sort((a, b) => {
      return a.descendants.length - b.descendants.length
    })
    sequencedScroll.forEach((bscrollFamily) => {
      const scroll = bscrollFamily.selfScroll
      scroll.scroller.actionsHandler.rebindDOMEvents()
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
