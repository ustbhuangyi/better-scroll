import BScroll from '../index'
import { staticImplements, PluginCtor } from './type'

@staticImplements<PluginCtor>()
export default class Picker {
  static pluginName = 'picker'
  constructor(public scroll: BScroll) {
    this.init()
  }
  init() {
    console.log('拿到 scroll 了')
  }
}
