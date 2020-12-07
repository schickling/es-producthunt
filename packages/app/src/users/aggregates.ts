import { events } from './events'
import { makeAggregate } from '../lib/aggregates'

export type UsersAggregate = {
  [userId: string]: UsersAggregateUser
}

export type UsersAggregateUser = {
  userId: string
  name: string
  email: string
  hashedPassword: string
}

export const makeUsersAggregate = makeAggregate<
  UsersAggregate,
  typeof events
>()({
  'user-signedup': (agg, payload) => {
    agg[payload.userId] = { ...payload }
  },
  'user-update': (agg, payload) => {
    condSet(agg[payload.userId], 'email', payload.email)
    condSet(agg[payload.userId], 'name', payload.name)
  },
})

function condSet<T extends Record<P, V | undefined>, P extends keyof T, V>(
  obj: T,
  prop: P,
  val: V | undefined,
): void {
  if (val) {
    // TOOD figure out a way to remove cast
    obj[prop] = val as T[P]
  }
}
