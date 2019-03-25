import EventEmitter from './base/EventEmitter';
import { Options } from './Options';
import Scroller from './scroller/Scroller';
import { PluginCtor } from './plugins/type';
interface PluginsCtorMap {
    [name: string]: PluginCtor;
}
interface PropertyConfig {
    key: string;
    sourceKey: string;
}
export default class BScroll extends EventEmitter {
    static readonly version: string;
    static pluginsCtorMap: PluginsCtorMap;
    scroller: Scroller;
    options: Options;
    hooks: EventEmitter;
    plugins: {
        [name: string]: any;
    };
    wrapper: HTMLElement;
    [key: string]: any;
    static use(ctor: PluginCtor): void;
    constructor(el: HTMLElement | string, options?: Partial<Options>);
    private init;
    private applyPlugins;
    private handleAutoBlur;
    private eventBubbling;
    proxy(propertiesConfig: PropertyConfig[]): void;
    refresh(): void;
    enable(): void;
    disable(): void;
    destroy(): void;
    eventRegister(names: string[]): void;
}
export {};
