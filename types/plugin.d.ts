import BScroll from '../src/index'
export type PluginFunction = (ctor: BScroll, options?: any[]) => void;

export interface PluginObject {
  install: PluginFunction;
  [key: string]: any;
}
