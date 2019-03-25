import BScroll from '../../index';
import { Direction } from './const';
import EventHandler from './eventHandler';
import { TranslaterPoint } from '../../translater';
export interface IndicatorOption {
    wrapper: HTMLElement;
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
interface KeyValues {
    maxPos: number;
    sizeRatio: number;
    initialSize: number;
}
export default class Indicator {
    bscroll: BScroll;
    options: IndicatorOption;
    wrapper: HTMLElement;
    wrapperStyle: CSSStyleDeclaration;
    el: HTMLElement;
    elStyle: CSSStyleDeclaration;
    direction: Direction;
    visible: number;
    keyVals: KeyValues;
    curPos: number;
    keysMap: KeysMap;
    eventHandler: EventHandler;
    constructor(bscroll: BScroll, options: IndicatorOption);
    _getKeysMap(): KeysMap;
    fade(visible?: boolean): void;
    refresh(): void;
    private _setShowBy;
    private _refreshKeyValues;
    updatePosAndSize(endPoint: TranslaterPoint): void;
    private _refreshPosAndSizeValue;
    private _refreshPosAndSizeStyle;
    setTransitionTime(time?: number): void;
    setTransitionTimingFunction(easing: string): void;
    private _startHandler;
    private _moveHandler;
    private _calScrollDesPos;
    private _endHandler;
    destroy(): void;
}
export {};
