import { Options as BScrollOptions } from '../Options';
import { Options as ActionsHandlerOptions } from '../base/ActionsHandler';
import { Options as BehaviorOptions, Bounces, Rect } from './Behavior';
export declare function createActionsHandlerOptions(bsOptions: BScrollOptions): ActionsHandlerOptions;
export declare function createBehaviorOptions(bsOptions: BScrollOptions, extraProp: 'scrollX' | 'scrollY', bounces: Bounces, rect: Rect): BehaviorOptions;
