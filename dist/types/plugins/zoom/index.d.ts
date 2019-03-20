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
    constructor(scroll: BScroll);
    init(): void;
    zoomTo(scale: number, x: number, y: number): void;
    private zoomStart;
    private zoom;
    private getFingerDistance;
    private zoomEnd;
    private _zoomTo;
    private resetBoundaries;
    private getNewPos;
    private scaleCure;
    private fixInScaleLimit;
}
export {};
