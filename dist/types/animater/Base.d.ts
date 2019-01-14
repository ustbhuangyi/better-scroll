import EventEmitter from '../base/EventEmitter';
import { Position, Transform } from '../translater';
import { EaseFn } from '../util';
export default class Base {
    element: HTMLElement;
    translater: Position | Transform;
    options: {
        bounceTime: number;
        probeType: number;
    };
    style: CSSStyleDeclaration;
    hooks: EventEmitter;
    timer: number;
    pending: boolean;
    minScrollX: number;
    maxScrollX: number;
    minScrollY: number;
    maxScrollY: number;
    hasHorizontalScroll: boolean;
    hasVerticalScroll: boolean;
    forceStopped?: boolean;
    _reflow?: number;
    [key: string]: any;
    constructor(element: HTMLElement, translater: Position | Transform, options: {
        bounceTime: number;
        probeType: number;
    });
    refresh(boundaryInfo: {
        minScrollX: number;
        maxScrollX: number;
        minScrollY: number;
        maxScrollY: number;
        hasHorizontalScroll: boolean;
        hasVerticalScroll: boolean;
        [key: string]: number | boolean;
    }): void;
    translate(x: number, y: number, scale: number): void;
    _resetPosition(time: number, easing: string | EaseFn): boolean;
    scrollTo(x: number, y: number, time: number, easing: string | EaseFn): void;
    protected callHooks(eventType: string, pos?: {
        x: number;
        y: number;
    }): void;
}
