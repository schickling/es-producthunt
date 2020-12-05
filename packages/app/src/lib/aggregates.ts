import { PrismaClient } from '@prisma/client'
import { EventMap, TypeByKind } from './type-dsl'

export const makeAggregate = <Agg extends {}, EM extends EventMap>() => (
  reducerMap: Partial<ReducerMap<Agg, EM>>,
) => async ({ prisma }: { prisma: PrismaClient }): Promise<Agg> => {
  const eventKinds = Object.keys(reducerMap)

  const events = await prisma.event.findMany({
    where: { kind: { in: eventKinds } },
    orderBy: { id: 'asc' },
  })

  const agg = events
    .map((_) => ({ kind: _.kind, payload: _.payload } as any))
    .reduce((agg, event) => {
      reducerMap[event.kind]!(agg, event.payload)
      return agg
    }, {} as Agg)

  return agg
}

type ReducerMap<Agg extends {}, EM extends EventMap> = {
  [P in keyof EM]: (agg: Agg, payload: TypeByKind<EM, P>) => void
}
