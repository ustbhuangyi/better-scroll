import ActionsHandler, { Options as ActionsHandlerOptions } from '../base/ActionsHandler';
import EventEmitter from '../base/EventEmitter';
import { Transform, Position } from '../translater';
import { Animation, Transition } from '../animater';
import BScrollOptions from '../Options';
import { EaseFn } from '../util';
export default class Scroller {
    wrapper: HTMLElement;
    element: HTMLElement;
    actionsHandler: ActionsHandler;
    translater: Position | Transform;
    animater: Animation | Transition;
    hooks: EventEmitter;
    options: BScrollOptions;
    enabled: boolean;
    startX: number;
    startY: number;
    absStartX: number;
    absStartY: number;
    pointX: number;
    pointY: number;
    moved: boolean;
    wrapperWidth: number;
    wrapperHeight: number;
    elementWidth: number;
    elementHeight: number;
    relativeX: number;
    relativeY: number;
    minScrollX: number;
    maxScrollX: number;
    minScrollY: number;
    maxScrollY: number;
    hasHorizontalScroll: boolean;
    hasVerticalScroll: boolean;
    directionX: number;
    directionY: number;
    movingDirectionX: number;
    movingDirectionY: number;
    directionLocked: string | number;
    wrapperOffset: {
        left: number;
        top: number;
    };
    resizeTimeout: number;
    startTime: number;
    endTime: number;
    constructor(wrapper: HTMLElement, options: BScrollOptions);
    createActionsHandlerOpt(): ActionsHandlerOptions;
    refresh(): void;
    private addDOMEvents;
    private removeDOMEvents;
    private handleDOMEvents;
    private handleEvent;
    private resize;
    private transitionEnd;
    private checkClick;
    scrollBy(deltaX: number, deltaY: number, time?: number, easing?: {
        style: string;
        fn: EaseFn;
    }): void;
    scrollTo(x: number, y: number, time?: number, easing?: {
        style: string;
        fn: EaseFn;
    }): void;
    scrollToElement(el: HTMLElement | string, time: number, offsetX: number | boolean, offsetY: number | boolean, easing: {
        style: string;
        fn: EaseFn;
    }): void;
    resetPosition(time?: number, easing?: {
        style: string;
        fn: EaseFn;
    }): boolean;
}
