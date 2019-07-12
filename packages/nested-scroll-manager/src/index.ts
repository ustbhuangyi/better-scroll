import BScroll from '@better-scroll/core'

declare module '@better-scroll/core' {
  interface Options {
    nestedScrollManager: true
  }
}
type BScrollPairs = [BScroll, BScroll]
const conflicts: {
  [index: string]: Function
  duplateClick: (pairs: BScrollPairs) => void
  nestedScroll: (pairs: BScrollPairs) => void
} = {
  duplateClick([parentScroll, childScroll]) {
    // no need to make childScroll's click true
    if (parentScroll.options.click && childScroll.options.click) {
      childScroll.options.click = false
    }
  },
  nestedScroll([parentScroll, childScroll]) {
    childScroll
      .on('scroll', () => {
        parentScroll.disable()
      })
      .on('scrollEnd', () => {
        parentScroll.enable()
      })
  }
}
export default class NestedScrollManager {
  static pluginName = 'nestedScrollManager'
  static nestedScrollManager?: NestedScrollManager
  stores: BScroll[]
  constructor(scroll: BScroll) {
    const baseCtor = this.constructor as typeof NestedScrollManager

    // only need an unique NestedScrollManager instance
    let singleton = baseCtor.nestedScrollManager
    if (!singleton) {
      baseCtor.nestedScrollManager = this
      singleton = baseCtor.nestedScrollManager
      singleton.initStores()
    }

    singleton.appendBScroll(scroll)

    return singleton
  }

  private initStores(): void {
    this.stores = []
  }

  appendBScroll(scroll: BScroll): void {
    this.stores.push(scroll)
    this.handleContainRelationship()
    this.handleConflicts()
  }

  private handleContainRelationship(): void {
    // bs's length <= 1
    if (this.stores.length <= 1) return

    const stores = this.stores
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

  private handleConflicts() {
    const pairs = this.filterBScrolls()
    const conflictsType = ['duplateClick', 'nestedScroll']

    pairs.forEach(pair => {
      console.log(pair[0].__parentInfo, pair[1].__parentInfo)
      conflictsType.forEach(type => {
        conflicts[type](pair)
      })
    })
  }

  private filterBScrolls(): BScrollPairs[] {
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
