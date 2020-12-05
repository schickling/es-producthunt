import { PrismaClient } from '@prisma/client'
import { EventContainer, EventMap, GetType, ObjectDef } from './type-dsl'

type CommandMapDef = Record<string, ObjectDef>

type CommandHandlerEventProducer<Payload, EM extends EventMap> = (_: {
  payload: Payload
  prisma: PrismaClient
}) => Promise<EventContainer<EM, keyof EM & string>[]>

type CommandMapEventProducer<CM extends CommandMapDef, EM extends EventMap> = {
  [P in keyof CM]: {
    definition: CM[P]
    handler: CommandHandlerEventProducer<GetType<CM[P]>, EM>
  }
}

type CommandHandler<Payload> = (_: {
  payload: Payload
  prisma: PrismaClient
}) => Promise<void>

type MakeCommandMap<CM extends CommandMapDef> = {
  [P in keyof CM]: {
    definition: CM[P]
    handler: CommandHandler<GetType<CM[P]>>
  }
}

type CommandDef = {
  definition: ObjectDef
  handler: CommandHandler<any>
}

export type CommandMap = Record<string, CommandDef>

export const defineCommands = <EM extends EventMap>() => <
  CMD extends CommandMapDef
>(
  _: CommandMapEventProducer<CMD, EM>,
): MakeCommandMap<CMD> => {
  return Object.entries(_).reduce(
    (acc, [kind, { handler, definition }]) => ({
      ...acc,
      [kind]: { handler: process(handler), definition },
    }),
    {} as MakeCommandMap<CMD>,
  )
}

const process = (
  produceEventsFn: CommandHandlerEventProducer<any, any>,
) => async ({
  prisma,
  payload: commandPayload,
}: {
  payload: any
  prisma: PrismaClient
}): Promise<void> => {
  const lastEvent = await prisma.event.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  })
  const lastEventId = lastEvent?.id ?? -1
  const newEvents = await produceEventsFn({ payload: commandPayload, prisma })
  // TODO figure out a way to not need `: any`
  const createMutations = newEvents.map((e: any, i) =>
    prisma.event.create({
      data: {
        id: lastEventId + i + 1,
        kind: e.kind,
        payload: e.payload,
      },
    }),
  )
  await prisma.$transaction(createMutations)
}
