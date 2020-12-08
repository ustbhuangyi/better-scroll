import BScroll, { MountedBScrollHTMLElement } from '@better-scroll/core'
import { Direction } from '@better-scroll/shared-utils'

declare module '@better-scroll/core' {
  interface CustomOptions {
    nestedScroll?: true
  }
}

type BScrollPairs = [BScroll, BScroll]

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

const calculateDepths = (
  childNode: HTMLElement,
  parentNode: HTMLElement
): number => {
  let depth = 0
  let parent = childNode.parentNode
  while (parent && parent !== parentNode) {
    depth++
    parent = parent.parentNode
  }
  return depth
}

const isOutOfBoundary = (scroll: BScroll): boolean => {
  const { hasHorizontalScroll, hasVerticalScroll } = hasScroll(scroll)
  const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller

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
    return outOfTopBoundary || outOfBottomBoundary
  } else if (hasHorizontalScroll) {
    return outOfLeftBoundary || outOfRightBoundary
  }
  return false
}

export default class NestedScroll {
  static pluginName = 'nestedScroll'
  static nestedScroll?: NestedScroll
  stores: BScroll[]
  constructor(scroll: BScroll) {
    let singleton = NestedScroll.nestedScroll

    if (!(singleton instanceof NestedScroll)) {
      singleton = NestedScroll.nestedScroll = this
      singleton.stores = []
    }

    singleton.setup(scroll)
    singleton.addHooks(scroll)

    return singleton
  }

  private setup(scroll: BScroll): void {
    this.addBScroll(scroll)
    this.buildContainRelationship()
    this.consortNestedScrolls()
  }

  private addHooks(scroll: BScroll): void {
    scroll.on('destroy', () => {
      this.teardown(scroll)
    })
  }

  private teardown(scroll: BScroll) {
    this.removeBScroll(scroll)
    this.buildContainRelationship()
    this.consortNestedScrolls()
  }

  addBScroll(scroll: BScroll) {
    this.stores.push(scroll)
  }

  removeBScroll(scroll: BScroll): void {
    const stores = this.stores
    const index = stores.indexOf(scroll)
    if (index === -1) {
      return
    }
    const wrapper = scroll.wrapper as MountedBScrollHTMLElement
    wrapper.isBScrollContainer = undefined
    stores.splice(index, 1)
  }

  private buildContainRelationship(): void {
    const stores = this.stores
    if (stores.length <= 1) {
      // there is only a childBScroll left.
      if (stores[0] && stores[0].__parentInfo) {
        stores[0].__parentInfo = undefined
      }
      return
    }

    let outerBS
    let outerBSWrapper
    let innerBS
    let innerBSWrapper

    // Need two layers of "For loop" to calculate parent-child relationship
    for (let i = 0; i < stores.length; i++) {
      outerBS = stores[i]
      outerBSWrapper = outerBS.wrapper
      for (let j = 0; j < stores.length; j++) {
        innerBS = stores[j]
        innerBSWrapper = innerBS.wrapper

        // same bs
        if (outerBS === innerBS) continue

        // now start calculating
        if (!innerBSWrapper.contains(outerBSWrapper)) continue

        // now innerBS contains outerBS
        // no parentInfo yet
        if (!outerBS.__parentInfo) {
          outerBS.__parentInfo = {
            parent: innerBS,
            depth: calculateDepths(outerBSWrapper, innerBSWrapper),
          }
        } else {
          // has parentInfo already!
          // just judge the real parent by depth
          // we regard the latest node as parent, not the furthest
          const currentDepths = calculateDepths(outerBSWrapper, innerBSWrapper)
          const prevDepths = outerBS.__parentInfo.depth
          // refresh currentBS as parentScroll
          if (prevDepths > currentDepths) {
            outerBS.__parentInfo = {
              parent: innerBS,
              depth: currentDepths,
            }
          }
        }
      }
    }
  }

  private consortNestedScrolls() {
    const pairs = this.getBScrollPairs()

    pairs.forEach((scrollsPair: BScrollPairs) => {
      const [parentScroll, childScroll] = scrollsPair

      const parentScrollX = parentScroll.options.scrollX
      const parentScrollY = parentScroll.options.scrollY
      const childScrollX = childScroll.options.scrollX
      const childScrollY = childScroll.options.scrollY
      // vertical nested in vertical
      // horizontal nested in horizontal
      // otherwise, no need to handle.
      if (parentScrollX === childScrollX || parentScrollY === childScrollY) {
        scrollsPair.forEach((scroll, index) => {
          const oppositeScroll = scrollsPair[(index + 1) % 2]

          scroll.on(scroll.eventTypes.beforeScrollStart, () => {
            if (oppositeScroll.pending) {
              oppositeScroll.stop()
              oppositeScroll.resetPosition()
            }
            syncTouchstartData(oppositeScroll)
            oppositeScroll.disable()
          })

          scroll.on(scroll.eventTypes.touchEnd, () => {
            oppositeScroll.enable()
          })
        })

        const childActionsHooks = childScroll.scroller.actions.hooks
        childActionsHooks.on(
          childActionsHooks.eventTypes.contentNotMoved,
          () => {
            parentScroll.enable()
          }
        )
        childScroll.on(childScroll.eventTypes.scrollStart, () => {
          if (isOutOfBoundary(childScroll)) {
            childScroll.disable()
            parentScroll.enable()
          }
        })
      }
    })
  }

  private getBScrollPairs(): BScrollPairs[] {
    let ret: BScrollPairs[] = []
    ret = this.stores
      .filter((bs) => !!bs.__parentInfo)
      .map((bs) => [bs.__parentInfo.parent, bs])
    return ret
  }
}
