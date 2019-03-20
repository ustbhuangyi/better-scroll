import BScroll from '../../index';
import { EaseItem } from '../../util/ease';
import { Page, Position } from './SlidePage';
export declare type slideOptions = Partial<SlideConfig> | boolean | undefined;
export interface SlideConfig {
    loop: boolean;
    el: HTMLElement | string;
    threshold: number;
    stepX: number;
    stepY: number;
    speed: number;
    easing: {
        style: string;
        fn: (t: number) => number;
    };
    listenFlick: boolean;
    disableSetWidth: boolean;
}
declare module '../../Options' {
    interface Options {
        slide?: slideOptions;
    }
}
export default class Slide {
    scroll: BScroll;
    private page;
    private slideOpt;
    private thresholdX;
    private thresholdY;
    static pluginName: string;
    private hooksFn;
    constructor(scroll: BScroll);
    init(): void;
    next(time?: number, easing?: EaseItem): void;
    prev(time?: number, easing?: EaseItem): void;
    goToPage(x: number, y: number, time?: number, easing?: EaseItem): void;
    getCurrentPage(): Page;
    nearestPage(x: number, y: number): Page & Position;
    destroy(): void;
    private initSlideState;
    private initThreshold;
    private cloneSlideEleForLoop;
    private resetLoop;
    private setSlideWidth;
    private goTo;
    private flickHandler;
    private getAnimateTime;
    private modifyScrollMetaHandler;
    private registorHooks;
}
