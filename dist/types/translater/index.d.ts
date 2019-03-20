import EventEmitter from '../base/EventEmitter';
export interface TranslaterPoint {
    x: number;
    y: number;
    [key: string]: number;
}
export default class Translater {
    content: HTMLElement;
    style: CSSStyleDeclaration;
    hooks: EventEmitter;
    constructor(content: HTMLElement);
    getComputedPosition(): {
        x: number;
        y: number;
    };
    translate(point: TranslaterPoint): void;
}
