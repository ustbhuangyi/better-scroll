import EventEmitter from '../base/EventEmitter';
interface BubblingEventMap {
    source: string;
    target: string;
}
declare type BubblingEventConfig = BubblingEventMap | string;
export declare function bubbling(source: EventEmitter, target: EventEmitter, events: BubblingEventConfig[]): void;
export {};
