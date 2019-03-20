interface EventsMap {
    [name: string]: [Function, Object][];
}
interface TypesMap {
    [type: string]: string;
}
export default class EventEmitter {
    events: EventsMap;
    eventTypes: TypesMap;
    constructor(names: string[]);
    on(type: string, fn: Function, context?: any): this;
    once(type: string, fn: Function, context?: any): this;
    off(type: string, fn: Function): this;
    trigger(type: string, ...args: any[]): any;
    registerType(names: string[]): void;
    private _checkInTypes;
}
export {};
