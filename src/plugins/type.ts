import BScroll from '../index'
export function staticImplements<T>() {
  return (constructor: T) => {}
}
export interface PluginCtor {
  pluginName: string
  new (scroll: BScroll): any
}
