import EventEmitter from '../base/EventEmitter';
import { EaseFn, safeCSSStyleDeclaration } from '../util';
import Translater, { TranslaterPoint } from '../translater';
export declare type Displacement = [number, number];
export default abstract class Base {
    element: HTMLElement;
    translater: Translater;
    options: {
        probeType: number;
    };
    style: safeCSSStyleDeclaration;
    hooks: EventEmitter;
    timer: number;
    pending: boolean;
    forceStopped: boolean;
    [key: string]: any;
    constructor(element: HTMLElement, translater: Translater, options: {
        probeType: number;
    });
    translate(endPoint: TranslaterPoint): void;
    setPending(pending: boolean): void;
    setForceStopped(forceStopped: boolean): void;
    abstract move(startPoint: TranslaterPoint, endPoint: TranslaterPoint, time: number, easing: string | EaseFn): void;
    abstract stop(): void;
}
