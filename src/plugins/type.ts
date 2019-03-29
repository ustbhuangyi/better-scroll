import BScroll from '../index'
import { EnforceOrder } from '@/enums/enforce-order'

export function staticImplements<T>() {
  return (constructor: T) => {}
}
export interface PluginCtor {
  pluginName: string
  enforce?: EnforceOrder
  new (scroll: BScroll): any
}
