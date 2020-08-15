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
