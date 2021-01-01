import BScroll from '@better-scroll/core'
import { EventEmitter, findIndex } from '@better-scroll/shared-utils'

// second element is used to discribe the distance between two bs instance's wrapper DOM
export type BScrollFamilyTuple = [BScrollFamily, number]

export default class BScrollFamily {
  static create(scroll: BScroll) {
    return new BScrollFamily(scroll)
  }
  ancestors: BScrollFamilyTuple[] = []
  descendants: BScrollFamilyTuple[] = []
  hooksManager: [EventEmitter, string, Function][] = []
  selfScroll: BScroll
  analyzed: boolean = false
  constructor(scroll: BScroll) {
    this.selfScroll = scroll
  }

  hasAncestors(bscrollFamily: BScrollFamily) {
    const index = findIndex(this.ancestors, ([item]) => {
      return item === bscrollFamily
    })
    return index > -1
  }

  hasDescendants(bscrollFamily: BScrollFamily) {
    const index = findIndex(this.descendants, ([item]) => {
      return item === bscrollFamily
    })
    return index > -1
  }

  addAncestor(bscrollFamily: BScrollFamily, distance: number) {
    const ancestors = this.ancestors
    ancestors.push([bscrollFamily, distance])
    // by ascend
    ancestors.sort((a, b) => {
      return a[1] - b[1]
    })
  }

  addDescendant(bscrollFamily: BScrollFamily, distance: number) {
    const descendants = this.descendants
    descendants.push([bscrollFamily, distance])
    // by ascend
    descendants.sort((a, b) => {
      return a[1] - b[1]
    })
  }

  removeAncestor(bscrollFamily: BScrollFamily) {
    const ancestors = this.ancestors
    if (ancestors.length) {
      const index = findIndex(this.ancestors, ([item]) => {
        return item === bscrollFamily
      })
      if (index > -1) {
        return ancestors.splice(index, 1)
      }
    }
  }

  removeDescendant(bscrollFamily: BScrollFamily) {
    const descendants = this.descendants
    if (descendants.length) {
      const index = findIndex(this.descendants, ([item]) => {
        return item === bscrollFamily
      })
      if (index > -1) {
        return descendants.splice(index, 1)
      }
    }
  }

  registerHooks(hook: EventEmitter, eventType: string, handler: Function) {
    hook.on(eventType, handler)
    this.hooksManager.push([hook, eventType, handler])
  }

  setAnalyzed(flag = false) {
    this.analyzed = flag
  }

  purge() {
    // remove self from graph
    this.ancestors.forEach(([bscrollFamily]) => {
      bscrollFamily.removeDescendant(this)
    })
    this.descendants.forEach(([bscrollFamily]) => {
      bscrollFamily.removeAncestor(this)
    })

    // remove all hook handlers
    this.hooksManager.forEach(([hooks, eventType, handler]) => {
      hooks.off(eventType, handler)
    })
    this.hooksManager = []
  }
}
