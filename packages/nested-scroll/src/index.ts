import BScroll from '@better-scroll/core'

declare module '@better-scroll/core' {
  interface Options {
    nestedScroll: true
  }
}
type BScrollPairs = [BScroll, BScroll]

const compatibleFeatures: {
  [index: string]: Function
  duplicateClick: (pairs: BScrollPairs) => void
  nestedScroll: (pairs: BScrollPairs) => void
} = {
  duplicateClick([parentScroll, childScroll]) {
    // no need to make childScroll's click true
    if (parentScroll.options.click && childScroll.options.click) {
      childScroll.options.click = false
    }
  },
  nestedScroll(scrollsPair: BScrollPairs) {
    const [parentScroll, childScroll] = scrollsPair

    const parentScrollX = parentScroll.options.scrollX
    const parentScrollY = parentScroll.options.scrollY
    const childScrollX = childScroll.options.scrollX
    const childScrollY = childScroll.options.scrollY
    // vertical nested in vertical scroll and horizontal nested in horizontal
    // otherwise, no need to handle.
    if (parentScrollX === childScrollX || parentScrollY === childScrollY) {
      scrollsPair.forEach((scroll, index) => {
        const oppositeScroll = scrollsPair[(index + 1) % 2]

        scroll.on('beforeScrollStart', () => {
          if (oppositeScroll.pending) {
            oppositeScroll.stop()
            oppositeScroll.resetPosition()
          }
          setupData(oppositeScroll)
          oppositeScroll.disable()
        })

        scroll.on('touchEnd', () => {
          oppositeScroll.enable()
        })
      })

      childScroll.on('scrollStart', () => {
        if (checkBeyondBoundary(childScroll)) {
          childScroll.disable()
          parentScroll.enable()
        }
      })
    }
  }
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
    this.appendBScroll(scroll)
    this.handleContainRelationship()
    this.handleCompatible()
  }

  private addHooks(scroll: BScroll): void {
    scroll.on('destroy', () => {
      this.teardown(scroll)
    })
  }

  private teardown(scroll: BScroll): void {
    this.removeBScroll(scroll)
    this.handleContainRelationship()
    this.handleCompatible()
  }

  appendBScroll(scroll: BScroll): void {
    this.stores.push(scroll)
  }

  removeBScroll(scroll: BScroll): void {
    const index = this.stores.indexOf(scroll)
    if (index === -1) return

    scroll.wrapper.isBScroll = null
    this.stores.splice(index, 1)
  }

  private handleContainRelationship(): void {
    // bs's length <= 1
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
            depth: calculateDepths(outerBSWrapper, innerBSWrapper)
          }
        } else {
          // has parentInfo already!
          // just judge the "true" parent by depth
          // we regard the latest node as parent, not the furthest
          const currentDepths = calculateDepths(outerBSWrapper, innerBSWrapper)
          const prevDepths = outerBS.__parentInfo.depth
          // refresh currentBS as parentScroll
          if (prevDepths > currentDepths) {
            outerBS.__parentInfo = {
              parent: innerBS,
              depth: currentDepths
            }
          }
        }
      }
    }
  }

  private handleCompatible() {
    const pairs = this.availableBScrolls()
    const keys = ['duplicateClick', 'nestedScroll']

    pairs.forEach(pair => {
      keys.forEach(key => {
        compatibleFeatures[key](pair)
      })
    })
  }

  private availableBScrolls(): BScrollPairs[] {
    let ret: BScrollPairs[] = []
    ret = this.stores
      .filter(bs => !!bs.__parentInfo)
      .map(bs => [bs.__parentInfo.parent, bs])
    return ret
  }
}

function calculateDepths(
  childNode: HTMLElement,
  parentNode: HTMLElement
): number {
  let depth = 0
  let parent = childNode.parentNode
  while (parent && parent !== parentNode) {
    depth++
    parent = parent.parentNode
  }
  return depth
}

function checkBeyondBoundary(scroll: BScroll): Boolean {
  const { hasHorizontalScroll, hasVerticalScroll } = hasScroll(scroll)
  const { scrollBehaviorX, scrollBehaviorY } = scroll.scroller

  const hasReachLeft =
    scroll.x >= scroll.minScrollX && scrollBehaviorX.movingDirection === -1
  const hasReachRight =
    scroll.x <= scroll.maxScrollX && scrollBehaviorX.movingDirection === 1
  const hasReachTop =
    scroll.y >= scroll.minScrollY && scrollBehaviorY.movingDirection === -1
  const hasReachBottom =
    scroll.y <= scroll.maxScrollY && scrollBehaviorY.movingDirection === 1

  if (hasVerticalScroll) {
    return hasReachTop || hasReachBottom
  } else if (hasHorizontalScroll) {
    return hasReachLeft || hasReachRight
  }
  return false
}

function setupData(scroll: BScroll): void {
  const { hasHorizontalScroll, hasVerticalScroll } = hasScroll(scroll)
  const { actions, scrollBehaviorX, scrollBehaviorY } = scroll.scroller
  actions.startTime = +new Date()

  if (hasVerticalScroll) {
    scrollBehaviorY.startPos = scrollBehaviorY.currentPos
  } else if (hasHorizontalScroll) {
    scrollBehaviorX.startPos = scrollBehaviorX.currentPos
  }
}

function hasScroll(scroll: BScroll) {
  return {
    hasHorizontalScroll: scroll.scroller.scrollBehaviorX.hasScroll,
    hasVerticalScroll: scroll.scroller.scrollBehaviorY.hasScroll
  }
}
