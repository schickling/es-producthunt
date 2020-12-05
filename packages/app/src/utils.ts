export const define = <T>() => <T_ extends T>(_: T_): T_ => _

export function assertNever(_: never) {
  throw new Error(`This should code shoudl never have been called: ${_}`)
}