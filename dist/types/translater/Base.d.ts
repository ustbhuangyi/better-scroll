export default class Base {
    element: HTMLElement;
    style: CSSStyleDeclaration;
    x: number;
    y: number;
    scale: number;
    lastScale: number;
    constructor(element: HTMLElement);
    setScale(scale: number): void;
    private setUpProps;
    updateProps(x: number, y: number, scale: number): void;
}
