import EventEmitter from './EventEmitter';
import { TouchEvent } from '../util';
export interface Options {
    [key: string]: any;
    bindToWrapper: boolean;
    click: boolean;
    disableMouse: boolean;
    preventDefault: boolean;
    stopPropagation: boolean;
    preventDefaultException: {
        tagName?: RegExp;
        className?: RegExp;
    };
}
export default class ActionsHandler {
    wrapper: HTMLElement;
    options: Options;
    hooks: EventEmitter;
    initiated: number | boolean;
    pointX: number;
    pointY: number;
    constructor(wrapper: HTMLElement, options: Options);
    private addDOMEvents;
    private removeDOMEvents;
    private handleDOMEvents;
    private handleEvent;
    private start;
    private move;
    end(e: TouchEvent): void;
    private setPointPosition;
}
