import BScroll from '@better-scroll/core'

declare module '@better-scroll/core' {
  interface Options {
    nestedScrollManager: true
  }
}

export default class NestedScrollManager {
  static pluginName = 'nestedScrollManager'
  static stores: BScroll[] = []
  base: typeof NestedScrollManager
  constructor(public scroll: BScroll) {
    // keep the referrence of Constructor
    this.base = this.constructor as typeof NestedScrollManager

    this.appendBScroll(this.scroll)
    this.handleContainable()
  }

  appendBScroll(scroll: BScroll) {
    this.base.stores.push(scroll)
  }

  handleContainable() {}
}
