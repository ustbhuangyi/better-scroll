import BScroll from '../../index';
import { Direction } from './const';
import EventHandler from './eventHandler';
import { TranslaterPoint } from '../../translater';
export interface IndicatorOption {
    el: HTMLElement;
    direction: Direction;
    fade: boolean;
    interactive: boolean;
}
interface KeysMap {
    hasScroll: 'hasVerticalScroll' | 'hasHorizontalScroll';
    size: 'height' | 'width';
    wrapperSize: 'clientHeight' | 'clientWidth';
    scrollerSize: 'scrollerHeight' | 'scrollerWidth';
    maxScroll: 'maxScrollY' | 'maxScrollX';
    pos: 'y' | 'x';
    pointPos: 'pageX' | 'pageY';
    translate: 'translateY' | 'translateX';
    position: 'top' | 'left';
}
export default class Indicator {
    bscroll: BScroll;
    options: IndicatorOption;
    wrapper: HTMLElement;
    wrapperStyle: CSSStyleDeclaration;
    el: HTMLElement;
    elStyle: CSSStyleDeclaration;
    initialSize: number;
    direction: Direction;
    visible: number;
    sizeRatio: number;
    maxPos: number;
    curPos: number;
    keysMap: KeysMap;
    eventHandler: EventHandler;
    constructor(bscroll: BScroll, options: IndicatorOption);
    _getKeysMap(): KeysMap;
    refresh(): void;
    private _shouldShow;
    private _calculate;
    fade(visible?: boolean, hold?: boolean): void;
    updatePosition(endPoint: TranslaterPoint): void;
    setTransitionTime(time?: number): void;
    setTransitionTimingFunction(easing: string): void;
    private _startHandler;
    private _moveHandler;
    private _calDesPos;
    private _endHandler;
    destroy(): void;
}
export {};
