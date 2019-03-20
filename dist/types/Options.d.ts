export declare type tap = 'tap' | '';
export declare type bounceOptions = Partial<bounceConfig> | boolean;
export declare type mouseWheelOptions = Partial<mouseWheelConfig> | boolean;
export declare type infinityOptions = Partial<infinityConfig> | boolean;
export declare type dblclickOptions = Partial<DblclickConfig> | boolean;
export interface bounceConfig {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}
interface mouseWheelConfig {
    speed: number;
    invert: boolean;
    easeTime: number;
}
interface infinityConfig {
    render: (item: object, div: any) => void;
    createTombstone: () => HTMLElement;
    fetch: (count: number) => void;
}
interface DblclickConfig {
    delay: number;
}
export declare class Options {
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
    bindToWrapper: boolean;
    disableMouse: boolean | '';
    observeDOM: boolean;
    autoBlur: boolean;
    translateZ: string;
    mouseWheel: mouseWheelOptions;
    infinity: infinityOptions;
    dblclick: dblclickOptions;
    constructor();
    merge(options?: {
        [key: string]: any;
    }): this;
    process(): this;
}
export {};
