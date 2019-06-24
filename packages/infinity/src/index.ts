import BScroll from '@better-scroll/core'

export type infinityOptions = Partial<InfinityOptions> | boolean
export interface InfinityOptions {
  fetch: (count: number) => Promise<any>
  render: () => HTMLElement
  createTombstone: () => HTMLElement
}

declare module '@better-scroll/core' {
  interface Options {
    infinity?: infinityOptions
  }
}

export default class Infinity {
  static pluginName = 'infinity'

  constructor(public bscroll: BScroll) {}
}
