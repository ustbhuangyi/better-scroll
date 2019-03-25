import BScroll from '../../index';
import Indicator from './indicator';
export declare type scrollbarOptions = Partial<ScrollbarConfig> | boolean;
export interface ScrollbarConfig {
    fade: boolean;
    interactive: boolean;
}
declare module '../../Options' {
    interface Options {
        scrollbar?: scrollbarOptions;
    }
}
export default class ScrollBar {
    static pluginName: string;
    indicators: Array<Indicator>;
    constructor(bscroll: BScroll);
    private _initIndicators;
    private _createIndicatorElement;
    private _insertIndicatorsTo;
    destroy(): void;
}
