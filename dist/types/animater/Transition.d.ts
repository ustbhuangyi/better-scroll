import { EaseFn } from '../util';
import Base from './Base';
import { Position, Transform } from '../translater';
export default class Transition extends Base {
    constructor(element: HTMLElement, translater: Position | Transform, options: {
        probeType: number;
        bounceTime: number;
    });
    startProbe(): void;
    transitionTime(time?: number): void;
    transitionTimingFunction(easing: string): void;
    scrollTo(x: number, y: number, time: number, easingFn: string | EaseFn): void;
    stop(): void;
    resetPosition(time?: number, easing?: {
        style: string;
        fn: EaseFn;
    }): boolean;
}
