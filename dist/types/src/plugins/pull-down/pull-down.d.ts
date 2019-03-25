import BScroll from '../../index';
export declare type pullDownRefreshOptions = Partial<pullDownRefreshConfig> | boolean;
export interface pullDownRefreshConfig {
    threshold: number;
    stop: number;
}
declare module '../../Options' {
    interface Options {
        pullDownRefresh?: pullDownRefreshOptions;
    }
}
export default class PullDown {
    scroll: BScroll;
    static pluginName: string;
    pulling: boolean;
    constructor(scroll: BScroll);
    private _init;
    private tapIntohooks;
    private _checkPullDown;
    finish(): void;
    open(config?: pullDownRefreshOptions): void;
    close(): void;
    autoPull(): void;
}
