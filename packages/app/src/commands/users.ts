import { aggregates } from '../aggregates'
import { defineCommands } from '../lib/commands'
import { events } from '../events'
import { undefineable } from '../lib/type-dsl'

export default defineCommands<typeof events>()({
  'user-signup': {
    definition: {
      userId: 'string',
      name: 'string',
      email: 'string',
      password: 'string',
    },
    handler: async ({ payload, prisma }) => {
      const agg = await aggregates.users({ prisma })
      const users = Object.values(agg)
      const emails = users.map((_) => _.email)
      if (emails.includes(payload.email)) {
        throw new Error(`User with email (${payload.email}) already exists.`)
      }

      const ids = users.map((_) => _.userId)
      if (ids.includes(payload.userId)) {
        throw new Error(`User with ID (${payload.userId}) already exists.`)
      }

      // TODO check password best practices

      return [
        {
          kind: 'user-signedup',
          payload: {
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
            hashedPassword: payload.password + 'TODO',
          },
        },
      ]
    },
  },
  'user-update': {
    definition: {
      userId: 'string',
      name: undefineable('string'),
      email: undefineable('string'),
    },
    handler: async ({ payload, prisma }) => {
      const agg = await aggregates.users({ prisma })
      const user = agg[payload.userId]
      if (user === undefined) {
        throw new Error(`No such user with id ${payload.userId}`)
      }

      const allUsers = Object.values(agg)
      if (payload.email) {
        const emails = allUsers.map((_) => _.email)
        if (emails.includes(payload.email)) {
          throw new Error(
            `Email (${payload.email}) address is already in use for another account.`,
          )
        }
      }
      return [{ kind: 'user-update', payload }]
    },
  },
})
