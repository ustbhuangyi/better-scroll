import BScroll from '../../index';
import EventEmitter from '../../base/EventEmitter';
interface ZoomConfig {
    start: number;
    min: number;
    max: number;
}
declare module '../../Options' {
    interface Options {
        zoom?: ZoomConfig;
    }
}
interface Point {
    x: number;
    y: number;
}
export default class Zoom {
    scroll: BScroll;
    static pluginName: string;
    origin: Point;
    scale: number;
    hooks: EventEmitter;
    private zoomOpt;
    private startDistance;
    private startScale;
    private wrapper;
    private scaleElement;
    private scaleElementInitSize;
    private initScrollBoundary;
    private zooming;
    private lastTransformScale;
    private hooksFn;
    constructor(scroll: BScroll);
    init(): void;
    zoomTo(scale: number, x: number, y: number): void;
    zoomStart(e: TouchEvent): void;
    zoom(e: TouchEvent): void;
    private getFingerDistance;
    zoomEnd(): void;
    destroy(): void;
    private _zoomTo;
    private resetBoundaries;
    private getNewPos;
    private scaleCure;
    private fixInScaleLimit;
    private registorHooks;
}
export {};
