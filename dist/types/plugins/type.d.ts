import BScroll from '../index';
export declare function staticImplements<T>(): (constructor: T) => void;
export interface PluginCtor {
    pluginName: string;
    new (scroll: BScroll): any;
}
