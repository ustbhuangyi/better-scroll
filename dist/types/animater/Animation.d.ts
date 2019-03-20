import Base from './Base';
import { TranslaterPoint } from '../translater';
import { EaseFn } from '../util';
export default class Animation extends Base {
    move(startPoint: TranslaterPoint, endPoint: TranslaterPoint, time: number, easingFn: EaseFn | string): void;
    private animate;
    stop(): void;
}
