import BScroll from '../index'

export default class Picker {
  static pluginName = 'picker'
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    console.log('拿到 scroll 了')
  }
}
