import EventEmitter from '../base/EventEmitter';
export declare type Bounces = [boolean, boolean];
export declare type Rect = {
    size: string;
    position: string;
};
export interface Options {
    scrollable: boolean;
    momentum: boolean;
    momentumLimitTime: number;
    momentumLimitDistance: number;
    deceleration: number;
    swipeBounceTime: number;
    swipeTime: number;
    bounces: Bounces;
    rect: Rect;
    [key: string]: number | boolean | Bounces | Rect;
}
export default class Behavior {
    wrapper: HTMLElement;
    options: Options;
    content: HTMLElement;
    currentPos: number;
    startPos: number;
    absStartPos: number;
    dist: number;
    minScrollPos: number;
    maxScrollPos: number;
    hasScroll: boolean;
    direction: number;
    movingDirection: number;
    relativeOffset: number;
    wrapperSize: number;
    contentSize: number;
    hooks: EventEmitter;
    constructor(wrapper: HTMLElement, options: Options);
    start(): void;
    move(delta: number): number;
    end(duration: number): {
        destination?: number | undefined;
        duration?: number | undefined;
    };
    private momentum;
    updateDirection(): void;
    refresh(): void;
    updatePosition(pos: number): void;
    getCurrentPos(): number;
    checkInBoundary(): {
        position: number;
        inBoundary: boolean;
    };
    adjustPosition(pos: number): number;
    updateStartPos(): void;
    updateAbsStartPos(): void;
    resetStartPos(): void;
    getAbsDist(delta: number): number;
}
