export declare type safeCSSStyleDeclaration = {
    [key: string]: string;
} & CSSStyleDeclaration;
export interface DOMRect {
    left: number;
    top: number;
    width: number;
    height: number;
    [key: string]: number;
}
export declare function getElement(el: HTMLElement | string): HTMLElement;
export declare function addEvent(el: HTMLElement, type: string, fn: EventListenerOrEventListenerObject, capture?: AddEventListenerOptions): void;
export declare function removeEvent(el: HTMLElement, type: string, fn: EventListenerOrEventListenerObject, capture?: EventListenerOptions): void;
export declare function offset(el: HTMLElement | null): {
    left: number;
    top: number;
};
export declare function offsetToBody(el: HTMLElement): {
    left: number;
    top: number;
};
export declare const cssVendor: string;
export declare const hasPerspective: boolean;
export declare const hasTouch: boolean | "";
export declare const hasTransition: boolean;
export declare const style: {
    transform: string;
    transition: string;
    transitionTimingFunction: string;
    transitionDuration: string;
    transitionDelay: string;
    transformOrigin: string;
    transitionEnd: string;
};
export declare const eventTypeMap: {
    [key: string]: number;
    touchstart: number;
    touchmove: number;
    touchend: number;
    mousedown: number;
    mousemove: number;
    mouseup: number;
};
export declare function getRect(el: HTMLElement): DOMRect;
export declare function preventDefaultExceptionFn(el: any, exceptions: {
    tagName?: RegExp;
    className?: RegExp;
    [key: string]: any;
}): boolean;
export declare function tap(e: any, eventName: string): void;
export declare function click(e: any, event?: string): void;
export declare function dblclick(e: Event): void;
export declare function prepend(el: HTMLElement, target: HTMLElement): void;
export declare function before(el: HTMLElement, target: HTMLElement): void;
export declare function removeChild(el: HTMLElement, child: HTMLElement): void;
export declare function hasClass(el: HTMLElement, className: string): boolean;
export declare function addClass(el: HTMLElement, className: string): void;
export declare function removeClass(el: HTMLElement, className: string): void;
