import BScroll from '../index';
export default class Picker {
    scroll: typeof BScroll;
    constructor(scroll: typeof BScroll);
    init(): void;
    static install(ctor: typeof BScroll): void;
}
