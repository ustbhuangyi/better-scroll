interface EventsMap {
    [name: string]: [Function, Object][];
}
interface TypesMap {
    [type: string]: string;
}
export default class EventEmitter {
    _events: EventsMap;
    eventTypes: TypesMap;
    constructor(names: string[]);
    on(type: string, fn: Function, context?: this): this;
    once(type: string, fn: Function, context?: this): this;
    off(type: string, fn: Function): this;
    trigger(type: string, ...args: any[]): undefined;
    private _checkInTypes;
}
export {};
