import BScroll from '@better-scroll/core'
import Zoom from '@better-scroll/zoom'
import Wheel from '@better-scroll/wheel'
import Slide from '@better-scroll/slide'
import ScrollBar from '@better-scroll/scroll-bar'
import PullUp from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'
import ObserveDom from '@better-scroll/observe-dom'
import NestedScroll from '@better-scroll/nested-scroll'
import MouseWheel from '@better-scroll/mouse-wheel'
import Infinity from '@better-scroll/infinity'
import Movable from '@better-scroll/movable'
import { IfEquals } from './util'

export * from '@better-scroll/core'
export * from '@better-scroll/zoom'
export * from '@better-scroll/wheel'
export * from '@better-scroll/slide'
export * from '@better-scroll/scroll-bar'
export * from '@better-scroll/pull-up'
export * from '@better-scroll/pull-down'
export * from '@better-scroll/observe-dom'
export * from '@better-scroll/nested-scroll'
export * from '@better-scroll/mouse-wheel'
export * from '@better-scroll/infinity'
export * from '@better-scroll/movable'

export type ArgumentsCheck<
  T extends any[],
  U extends (...args: any[]) => any
> = (
  ...args: any[]
) => U extends (...args: infer P) => any
  ? IfEquals<T, P, ReturnType<U>, T>
  : never
export type ReturnValueCheck<T, U extends (...args: any[]) => any> = (
  ...args: any[]
) => U extends (...args: any[]) => infer P ? IfEquals<T, P, P, T> : never
export declare function expectType<T, T1 extends IfEquals<T, T1, T, T>>(): void
export declare function expectError<T>(value: T): void
export declare function expectAssignable<T1 extends T, T>(): void
export declare function expectFuncArguments<
  T extends any[],
  T1 extends ArgumentsCheck<T, T1>
>(): void
export declare function expectFuncReturnValue<
  T,
  T1 extends ReturnValueCheck<T, T1>
>(): void

export {
  BScroll,
  Zoom,
  Wheel,
  Slide,
  ScrollBar,
  PullUp,
  PullDown,
  ObserveDom,
  NestedScroll,
  MouseWheel,
  Infinity,
  Movable
}
