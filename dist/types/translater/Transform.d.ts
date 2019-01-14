import Base from './Base';
interface Options {
    translateZ: string;
}
export default class Transform extends Base {
    options: Options;
    constructor(element: HTMLElement, options: Options);
    getComputedPosition(): {
        x: number;
        y: number;
    };
    updatePosition(x: number, y: number, scale: number): void;
}
export {};
