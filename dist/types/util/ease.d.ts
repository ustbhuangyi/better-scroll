export interface EaseItem {
    style: string;
    fn: EaseFn;
}
interface EaseMap {
    [key: string]: EaseItem;
}
export interface EaseFn {
    (t: number): number;
}
export declare const ease: EaseMap;
export {};
