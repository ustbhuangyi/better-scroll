import BScroll from '../../index';
import Indicator from './indicator';
export interface scrollbarConfig {
    fade: boolean;
    interactive: boolean;
}
export declare type scrollbarOptions = Partial<scrollbarConfig> | boolean;
declare module '../../Options' {
    interface Options {
        scrollbar?: scrollbarOptions;
    }
}
export default class ScrollBar {
    static pluginName: string;
    indicators: Array<Indicator>;
    constructor(bscroll: BScroll);
    private _init;
    private _insertToWrapper;
    destroy(): void;
}
