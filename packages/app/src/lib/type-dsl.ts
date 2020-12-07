export type Container = {
  kind: string
  payload: ObjectDef
}

export type ObjectDef = {
  [name: string]: FieldValue
}

export type FieldValue =
  | ObjectDef
  | 'string'
  | 'number'
  | 'boolean'
  | undefined
  | ArrayWrapper<FieldValue>
  | NullableWrapper<FieldValue>
  | UndefineableWrapper<FieldValue>

export interface Wrapper<FV extends FieldValue, W extends string> {
  wrapper: W
  value: FV
}
export interface ArrayWrapper<FV extends FieldValue>
  extends Wrapper<FV, 'array'> {}
export const array = <FV extends FieldValue>(_: FV): ArrayWrapper<FV> => ({
  wrapper: 'array',
  value: _,
})
export interface NullableWrapper<FV extends FieldValue>
  extends Wrapper<FV, 'nullable'> {}
export const nullable = <FV extends FieldValue>(
  _: FV,
): NullableWrapper<FV> => ({
  wrapper: 'nullable',
  value: _,
})

export interface UndefineableWrapper<FV extends FieldValue>
  extends Wrapper<FV, 'undefineable'> {}
export const undefineable = <FV extends FieldValue>(
  _: FV,
): UndefineableWrapper<FV> => ({
  wrapper: 'undefineable',
  value: _,
})

export type GetType<FV extends FieldValue> = FV extends 'string'
  ? string
  : FV extends 'number'
  ? number
  : FV extends 'boolean'
  ? boolean
  : FV extends ObjectDef
  ? {
      [P in keyof FV]: GetType<FV[P]>
    }
  : FV extends ArrayWrapper<infer FV_>
  ? GetType<FV_>[]
  : FV extends NullableWrapper<infer FV_>
  ? GetType<FV_> | null
  : FV extends UndefineableWrapper<infer FV_>
  ? GetType<FV_> | undefined
  : never

export type EventMap = { [kind: string]: ObjectDef }

export const defineEvents = <CM extends EventMap>(_: CM): CM => _

export type TypeByKind<CM extends EventMap, K extends keyof CM> = GetType<CM[K]>

// export type Helper<EM extends EventMap> = {
//   AllEventTypes: TypeByKind<EM, keyof EM>
//   AllEventKinds: keyof EM
// }

export type EventContainer<
  EM extends EventMap,
  K extends keyof EM & string = keyof EM & string
> = K extends any ? { kind: K; payload: PayloadType<EM, K> } : never

export type PayloadType<EM extends EventMap, K extends keyof EM> = TypeByKind<
  EM,
  K
>
