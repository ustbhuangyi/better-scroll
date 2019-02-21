import BScroll from '../index'
export function staticImplements<T>() {
  return (constructor: T) => {}
}
export interface PluginCtor {
  pluginName: string
  new (bs: BScroll): any
}
