import {
  BScroll,
  expectFuncArguments,
  expectFuncReturnValue,
  Options
} from './index'
import { EaseItem } from '@better-scroll/shared-utils/src'

describe('core api parameter type should be correct', () => {
  type ExtraTransform = { start: object; end: object }
  expectFuncArguments<[], BScroll['refresh']>()
  expectFuncArguments<
    [number, number, number?, EaseItem?, ExtraTransform?],
    BScroll['scrollTo']
  >()
  expectFuncArguments<
    [number, number, number?, EaseItem?],
    BScroll['scrollBy']
  >()
  expectFuncArguments<
    [
      string | HTMLElement,
      number,
      number | boolean,
      number | boolean,
      EaseItem?
    ],
    BScroll['scrollToElement']
  >()
  expectFuncArguments<[], BScroll['stop']>()
  expectFuncArguments<[], BScroll['enable']>()
  expectFuncArguments<[], BScroll['disable']>()
  expectFuncArguments<[], BScroll['destroy']>()
  // Events API
  expectFuncArguments<[string, Function, Object?], BScroll['on']>()
  expectFuncArguments<[string, Function, Object?], BScroll['once']>()
  expectFuncArguments<[string?, Function?], BScroll['off']>()
  expectFuncReturnValue<BScroll<Options>, BScroll['on']>()
  expectFuncReturnValue<BScroll<Options>, BScroll['once']>()
  expectFuncReturnValue<BScroll<Options> | undefined, BScroll['off']>()
})
