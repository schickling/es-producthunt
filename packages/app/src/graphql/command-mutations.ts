import {
  AllNexusArgsDefs,
  ArgsRecord,
  booleanArg,
  intArg,
  list,
  nullable,
  ObjectDefinitionBlock,
  stringArg,
} from '@nexus/schema/dist/core'
import { PrismaClient } from '@prisma/client'
import { camelCase } from 'camel-case'
import { FieldValue, ObjectDef } from '../lib/type-dsl'
import { CommandMap } from '../lib/commands'

export function generateCommandMutations(
  t: ObjectDefinitionBlock<'Mutation'>,
  commands: CommandMap,
  prisma: PrismaClient,
): void {
  Object.entries(commands).forEach(([kind, { definition, handler }]) => {
    t.field(camelCase(kind), {
      type: 'Boolean',
      args: definitionToArgs(definition),
      resolve: async (_source, args) => {
        await handler({ payload: args, prisma })
        return true
      },
    })
  })
}

function definitionToArgs(definition: ObjectDef): ArgsRecord {
  return Object.entries(definition).reduce(
    (acc, [field, fv]) => ({ ...acc, [field]: fieldValueToArgs(fv) }),
    {},
  )
}

function fieldValueToArgs(fv: FieldValue): AllNexusArgsDefs {
  if (fv === 'string') {
    return stringArg()
  } else if (fv === 'boolean') {
    return booleanArg()
  } else if (fv === 'number') {
    return intArg()
  } else if (fv?.wrapper === 'array') {
    return list(fieldValueToArgs(fv.value))
  } else if (fv?.wrapper === 'nullable') {
    return nullable(fieldValueToArgs(fv.value) as any)
  } else if (fv?.wrapper === 'undefineable') {
    return nullable(fieldValueToArgs(fv.value) as any)
  }

  throw new Error(`Unsupported field value ${fv}`)
}
