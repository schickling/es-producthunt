import { defineEvents, undefineable } from '../lib/type-dsl'

export const events = defineEvents({
  'user-signedup': {
    userId: 'string',
    name: 'string',
    email: 'string',
    /** Using bcrypt */
    hashedPassword: 'string',
  },
  'user-update': {
    userId: 'string',
    name: undefineable('string'),
    email: undefineable('string'),
  },
})
