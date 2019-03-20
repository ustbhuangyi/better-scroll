import { EaseFn } from '../util';
import Base from './Base';
import { TranslaterPoint } from '../translater';
export default class Transition extends Base {
    startProbe(): void;
    transitionTime(time?: number): void;
    transitionTimingFunction(easing: string): void;
    move(startPoint: TranslaterPoint, endPoint: TranslaterPoint, time: number, easingFn: string | EaseFn): void;
    stop(): void;
}
