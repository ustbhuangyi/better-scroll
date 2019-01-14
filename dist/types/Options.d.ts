export declare type tap = 'tap' | '';
export declare type bounceOptions = Partial<bounceConfig> | boolean;
export declare type pickerOptions = Partial<pickerConfig> | boolean;
export declare type slideOptions = Partial<slideConfig> | boolean;
export declare type scrollbarOptions = Partial<scrollbarConfig> | boolean;
export declare type pullDownRefreshOptions = Partial<pullDownRefreshConfig> | boolean;
export declare type pullUpLoadOptions = Partial<pullUpLoadConfig> | boolean;
export declare type mouseWheelOptions = Partial<mouseWheelConfig> | boolean;
export declare type zoomOptions = Partial<zoomConfig> | boolean;
export declare type infinityOptions = Partial<infinityConfig> | boolean;
export declare type dblclickOptions = Partial<dblclickConfig> | boolean;
export interface bounceConfig {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}
interface pickerConfig {
    selectedIndex: number;
    rotate: number;
    adjustTime: number;
    wheelWrapperClass: string;
    wheelItemClass: string;
}
interface slideConfig {
    loop: boolean;
    el: HTMLElement;
    threshold: number;
    stepX: number;
    stepY: number;
    speed: number;
    easing: {
        style: string;
        fn: (t: number) => number;
    };
    listenFlick: boolean;
}
interface scrollbarConfig {
    fade: boolean;
    interactive: boolean;
}
interface pullDownRefreshConfig {
    threshold: number;
    stop: number;
}
interface pullUpLoadConfig {
    threshold: number;
}
interface mouseWheelConfig {
    speed: number;
    invert: boolean;
    easeTime: number;
}
interface zoomConfig {
    start: number;
    min: number;
    max: number;
}
interface infinityConfig {
    render: (item: object, div: any) => void;
    createTombstone: () => HTMLElement;
    fetch: (count: number) => void;
}
interface dblclickConfig {
    delay: number;
}
export default class Options {
    [key: string]: any;
    startX: number;
    startY: number;
    scrollX: boolean;
    scrollY: boolean;
    freeScroll: boolean;
    directionLockThreshold: number;
    eventPassthrough: string;
    click: boolean;
    tap: tap;
    bounce: bounceOptions;
    bounceTime: number;
    momentum: boolean;
    momentumLimitTime: number;
    momentumLimitDistance: number;
    swipeTime: number;
    swipeBounceTime: number;
    deceleration: number;
    flickLimitTime: number;
    flickLimitDistance: number;
    resizePolling: number;
    probeType: number;
    stopPropagation: boolean;
    preventDefault: boolean;
    preventDefaultException: {
        tagName?: RegExp;
        className?: RegExp;
    };
    HWCompositing: boolean;
    useTransition: boolean;
    useTransform: boolean;
    bindToWrapper: boolean;
    disableMouse: boolean | '';
    observeDOM: boolean;
    autoBlur: boolean;
    translateZ: string;
    picker: pickerOptions;
    slide: slideOptions;
    scrollbar: scrollbarOptions;
    pullDownRefresh: pullDownRefreshOptions;
    pullUpLoad: pullUpLoadOptions;
    mouseWheel: mouseWheelOptions;
    zoom: zoomOptions;
    infinity: infinityOptions;
    dblclick: dblclickOptions;
    constructor();
    merge(options?: {
        [key: string]: any;
    }): this;
    process(): this;
}
export {};
