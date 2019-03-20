import ActionsHandler from '../base/ActionsHandler';
import EventEmitter from '../base/EventEmitter';
import EventRegister from '../base/EventRegister';
import Translater, { TranslaterPoint } from '../translater';
import { Animater } from '../animater';
import { Options as BScrollOptions } from '../Options';
import Behavior from './Behavior';
import ScrollerActions from './Actions';
import { EaseFn } from '../util';
export default class Scroller {
    wrapper: HTMLElement;
    content: HTMLElement;
    actionsHandler: ActionsHandler;
    translater: Translater;
    animater: Animater;
    scrollBehaviorX: Behavior;
    scrollBehaviorY: Behavior;
    actions: ScrollerActions;
    hooks: EventEmitter;
    resizeRegister: EventRegister;
    transitionEndRegister: EventRegister;
    options: BScrollOptions;
    wrapperOffset: {
        left: number;
        top: number;
    };
    resizeTimeout: number;
    lastClickTime: number | null;
    constructor(wrapper: HTMLElement, options: BScrollOptions);
    private init;
    private bindTranslater;
    private bindAnimater;
    private bindActions;
    private checkFlick;
    private momentum;
    private checkClick;
    private resize;
    private transitionEnd;
    refresh(): void;
    scrollBy(deltaX: number, deltaY: number, time?: number, easing?: import("../util").EaseItem): void;
    scrollTo(x: number, y: number, time?: number, easing?: import("../util").EaseItem, extraTransform?: {
        start: {};
        end: {};
    }, forceScroll?: boolean): void;
    scrollToElement(el: HTMLElement | string, time: number, offsetX: number | boolean, offsetY: number | boolean, easing: {
        style: string;
        fn: EaseFn;
    }): void;
    resetPosition(time?: number, easing?: import("../util").EaseItem): boolean;
    updatePositions(pos: TranslaterPoint): void;
    getCurrentPos(): TranslaterPoint;
    enable(): void;
    disable(): void;
}
