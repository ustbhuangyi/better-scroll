import Base from './Base';
export default class Position extends Base {
    constructor(element: HTMLElement);
    getComputedPosition(): {
        x: number;
        y: number;
    };
    updatePosition(x: number, y: number, scale: number): void;
}
