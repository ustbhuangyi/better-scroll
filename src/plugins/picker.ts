import BScroll from '../index'

export default class Picker<T> {
  scroll: BScroll
  constructor(public bs: BScroll) {
    this.init()
  }
  init() {
    console.log('拿到 scroll 了')
  }
}
