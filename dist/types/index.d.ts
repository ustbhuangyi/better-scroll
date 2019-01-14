import EventEmitter from './base/EventEmitter';
import Options from './Options';
import Scroller from './scroller/Scroller';
export interface Plugin {
    install: (ctor: BScroll, options?: any[]) => void;
    new (): void;
}
interface PluginsMap {
    [name: string]: {
        new (bs: BScroll): void;
    };
}
export default class BScroll extends EventEmitter {
    static readonly version: string;
    static _installedPlugins?: Plugin[];
    static _pluginsMap: PluginsMap;
    scroller: Scroller;
    options: Options;
    hooks: EventEmitter;
    [key: string]: any;
    static use(plugin: Plugin, ...options: any[]): typeof BScroll;
    static plugin(name: string, ctor: {
        new (): void;
    }): void;
    constructor(el: HTMLElement | string, options?: object);
    private init;
    private applyPlugins;
    private handleAutoBlur;
    refresh(): void;
    enable(): void;
    disable(): void;
    destroy(): void;
}
export {};
