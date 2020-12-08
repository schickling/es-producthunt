export const define = <T>() => <T_ extends T>(_: T_): T_ => _

export function assertNever(_: never) {
  throw new Error(`This should code shoudl never have been called: ${_}`)
}

export function condSet<
  T extends Record<P, V | undefined>,
  P extends keyof T,
  V
>(obj: T, prop: P, val: V | undefined): void {
  if (val) {
    // TOOD figure out a way to remove cast
    obj[prop] = val as T[P]
  }
}

export function mergeObjDefault<Rec extends Record<string, { default: any }>>(
  rec: Rec,
): Rec extends Record<string, { default: infer O }>
  ? UnionToIntersection<O>
  : never {
  return Object.values(rec).reduce(
    (acc, obj) => ({ ...acc, ...obj.default }),
    {} as any,
  )
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never
