import EventRegister from '../../base/EventRegister';
import BScroll from '../../index';
import Indicator from './indicator';
import EventEmitter from '../../base/EventEmitter';
interface EventHandlerOptions {
    disableMouse: boolean | '';
}
export default class EventHandler {
    indicator: Indicator;
    options: EventHandlerOptions;
    startEventRegister: EventRegister;
    moveEventRegister: EventRegister;
    endEventRegister: EventRegister;
    initiated: boolean;
    moved: boolean;
    private lastPoint;
    bscroll: BScroll;
    hooks: EventEmitter;
    constructor(indicator: Indicator, options: EventHandlerOptions);
    private _start;
    private _move;
    private _end;
    destroy(): void;
}
export {};
