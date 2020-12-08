import { events } from '../events'
import { makeAggregate } from '../lib/aggregates'
import { condSet } from '../utils'

export type UsersAggregate = {
  [userId: string]: UsersAggregateUser
}

export type UsersAggregateUser = {
  userId: string
  name: string
  email: string
  hashedPassword: string
}

export default makeAggregate<
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
