import BScroll from '../index'

export default class Picker {
  scroll: typeof BScroll

  constructor(scroll: typeof BScroll) {
    this.scroll = scroll
    this.init()
  }
  init() {
    console.log('拿到 scroll 了')
  }
  static install(ctor: typeof BScroll) {
    ctor.plugin('picker', Picker)
  }
}
