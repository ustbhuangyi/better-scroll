import { DirectionLock } from '../enums';
import { TouchEvent } from '../util';
export default class DirectionLockAction {
    directionLockThreshold: number;
    freeScroll: boolean;
    eventPassthrough: string;
    directionLocked: DirectionLock;
    constructor(directionLockThreshold: number, freeScroll: boolean, eventPassthrough: string);
    reset(): void;
    checkMovingDirection(absDistX: number, absDistY: number, e: TouchEvent): boolean;
    adjustDelta(deltaX: number, deltaY: number): {
        deltaX: number;
        deltaY: number;
    };
    private computeDirectionLock;
    private handleEventPassthrough;
}
