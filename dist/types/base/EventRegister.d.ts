import { TouchEvent } from '../util';
interface EventMap {
    name: string;
    handler(e: TouchEvent): void;
    capture?: boolean;
}
export default class EventRegister {
    wrapper: HTMLElement | Window;
    events: EventMap[];
    constructor(wrapper: HTMLElement | Window, events: EventMap[]);
    destroy(): void;
    private addDOMEvents;
    private removeDOMEvents;
    private handleDOMEvents;
    private handleEvent;
}
export {};
