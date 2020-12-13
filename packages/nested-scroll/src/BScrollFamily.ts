import BScroll from '@better-scroll/core'
import { EventEmitter } from '@better-scroll/shared-utils'

export default class BScrollFamily {
  static create(scroll: BScroll) {
    return new BScrollFamily(scroll)
  }
  ancestors: BScrollFamily[] = []
  descendants: BScrollFamily[] = []
  hooksManager: [EventEmitter, string, Function][] = []
  selfScroll: BScroll
  analyzed: boolean = false
  constructor(scroll: BScroll) {
    this.selfScroll = scroll
  }

  hasAncestors(bscrollFamily: BScrollFamily) {
    return this.ancestors.indexOf(bscrollFamily) > -1
  }

  hasDescendants(bscrollFamily: BScrollFamily) {
    return this.descendants.indexOf(bscrollFamily) > -1
  }

  addAncestor(bscrollFamily: BScrollFamily) {
    this.ancestors.push(bscrollFamily)
  }

  addDescendant(bscrollFamily: BScrollFamily) {
    this.descendants.push(bscrollFamily)
  }

  removeAncestor(bscrollFamily: BScrollFamily) {
    const ancestors = this.ancestors
    if (ancestors.length) {
      const index = ancestors.indexOf(bscrollFamily)
      if (index > -1) {
        return ancestors.splice(index, 1)
      }
    }
  }

  removeDescendant(bscrollFamily: BScrollFamily) {
    const descendants = this.descendants
    if (descendants.length) {
      const index = descendants.indexOf(bscrollFamily)
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
    this.ancestors.forEach((bscrollFamily) => {
      bscrollFamily.removeDescendant(this)
    })
    this.descendants.forEach((bscrollFamily) => {
      bscrollFamily.removeAncestor(this)
    })

    // remove all hook handlers
    this.hooksManager.forEach(([hooks, eventType, handler]) => {
      hooks.off(eventType, handler)
    })
    this.hooksManager = []
  }
}
