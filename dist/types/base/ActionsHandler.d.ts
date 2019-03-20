import EventEmitter from './EventEmitter';
import EventRegister from './EventRegister';
declare type Exception = {
    tagName?: RegExp;
    className?: RegExp;
};
export interface Options {
    [key: string]: boolean | number | Exception;
    click: boolean;
    bindToWrapper: boolean;
    disableMouse: boolean;
    preventDefault: boolean;
    stopPropagation: boolean;
    preventDefaultException: Exception;
    momentumLimitDistance: number;
}
export default class ActionsHandler {
    wrapper: HTMLElement;
    options: Options;
    hooks: EventEmitter;
    initiated: number;
    pointX: number;
    pointY: number;
    startClickRegister: EventRegister;
    moveEndRegister: EventRegister;
    constructor(wrapper: HTMLElement, options: Options);
    private handleDOMEvents;
    private beforeHandler;
    setInitiated(type?: number): void;
    private start;
    private move;
    private end;
    private click;
    destroy(): void;
}
export {};
