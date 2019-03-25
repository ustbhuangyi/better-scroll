import BScroll from '../../index';
import { SlideConfig } from './index';
import PagesPos from './PagesPos';
export interface Page {
    pageX: number;
    pageY: number;
}
export interface Position {
    x: number;
    y: number;
}
declare enum LoopStage {
    Head = "head",
    Tail = "tail",
    Middle = "middle"
}
export default class PageInfo {
    scroll: BScroll;
    private slideOpt;
    loopX: boolean;
    loopY: boolean;
    slideX: boolean;
    slideY: boolean;
    needLoop: boolean;
    pagesPos: PagesPos;
    currentPage: Page & Position;
    constructor(scroll: BScroll, slideOpt: Partial<SlideConfig>);
    init(): void;
    change2safePage(pageX: number, pageY: number): Page & Position | undefined;
    getRealPage(): Page;
    getPageSize(): {
        width: number;
        height: number;
    };
    realPage2Page(x: number, y: number): {
        realX: number;
        realY: number;
    } | undefined;
    nextPage(): {
        pageX: number;
        pageY: number;
    };
    prevPage(): {
        pageX: number;
        pageY: number;
    };
    nearestPage(x: number, y: number, directionX: number, directionY: number): Page & Position;
    getLoopStage(): LoopStage;
    resetLoopPage(): {
        pageX: number;
        pageY: number;
    } | undefined;
    private changedPageNum;
    private checkSlideLoop;
}
export {};
