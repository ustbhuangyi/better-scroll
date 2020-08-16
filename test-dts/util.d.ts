type NonUndefined<T> = T extends undefined ? never : T
export type DeepNonNullable<T> = {
  [P in keyof T]-?: T[P] extends object
    ? DeepNonNullable<NonUndefined<T[P]>>
    : NonUndefined<T[P]>
}

export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X
  ? 1
  : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B

export type FilterType<T, F> = T extends F ? never : T

export type FilterUndef<T> = FilterType<T, undefined>
export type FilterBoolean<T> = FilterType<T, boolean>
export type FilterNull<T> = FilterType<T, null>
export type FilterString<T> = FilterType<T, string>
export type FilterNumber<T> = FilterType<T, number>
export type FilterSymbol<T> = FilterType<T, symbol>
export type FilterArray<T> = FilterType<T, Array<any>>
export type FilterFunc<T> = FilterType<T, Function>
export type FilterObject<T> = FilterType<T, object>
