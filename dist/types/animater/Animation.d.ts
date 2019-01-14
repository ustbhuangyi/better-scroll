import { Position, Transform } from '../translater';
import Base from './Base';
import { EaseFn } from '../util';
export default class Animation extends Base {
    constructor(element: HTMLElement, translater: Position | Transform, options: {
        bounceTime: number;
        probeType: number;
    });
    scrollTo(x: number, y: number, time: number, easingFn: EaseFn | string): void;
    private animate;
    stop(): void;
    resetPosition(time?: number, easing?: {
        style: string;
        fn: EaseFn;
    }): boolean;
}
