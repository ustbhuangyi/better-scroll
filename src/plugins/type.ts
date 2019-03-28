import BScroll from '../index'
export function staticImplements<T>() {
  return (constructor: T) => {}
}
export interface PluginCtor {
  pluginName: string
  initOrder?: number
  new (scroll: BScroll): any
}
