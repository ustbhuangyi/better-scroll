import BScroll from '../../index';
import { SlideConfig } from './index';
interface PagePos {
    x: number;
    y: number;
    width: number;
    height: number;
    cx: number;
    cy: number;
}
export default class PagesPos {
    private scroll;
    private slideOpt;
    pages: Array<Array<PagePos>>;
    xLen: number;
    yLen: number;
    private wrapperWidth;
    private wrapperHeight;
    private scrollerWidth;
    private scrollerHeight;
    private slideEl;
    constructor(scroll: BScroll, slideOpt: Partial<SlideConfig>);
    init(): void;
    hasInfo(): boolean;
    getPos(x: number, y: number): PagePos;
    getNearestPage(x: number, y: number): {
        pageX: number;
        pageY: number;
    } | undefined;
    private computePagePosInfo;
    private computePagePosInfoByEl;
}
export {};
