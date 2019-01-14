interface EaseMap {
    [key: string]: {
        style: string;
        fn: EaseFn;
    };
}
export interface EaseFn {
    (t: number): number;
}
export declare const ease: EaseMap;
export {};
