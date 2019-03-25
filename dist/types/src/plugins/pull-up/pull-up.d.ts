import BScroll from '../../index';
export declare type pullUpLoadOptions = Partial<pullUpLoadConfig> | boolean;
export interface pullUpLoadConfig {
    threshold: number;
}
declare module '../../Options' {
    interface Options {
        pullUpLoad?: pullUpLoadOptions;
    }
}
export default class PullUp {
    scroll: BScroll;
    watching: boolean;
    static pluginName: string;
    constructor(scroll: BScroll);
    private _init;
    private _watch;
    private _checkToEnd;
    finish(): void;
    open(config?: pullUpLoadOptions): void;
    close(): void;
}
