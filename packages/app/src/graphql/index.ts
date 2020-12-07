import * as path from 'path'
import {
  makeSchema,
  objectType,
  queryType,
  list,
  mutationType,
} from '@nexus/schema'
import { commands as postCommands } from '../posts/commands'
import { commands as userCommands } from '../users/commands'
import { PrismaClient } from '@prisma/client'
import { isPostsAggregatePost1, makePostsAggregate } from '../posts/aggregates'
import { generateCommandMutations } from './command-mutations'
import { makeUsersAggregate } from '../users/aggregates'

const prisma = new PrismaClient()

const Post = objectType({
  name: 'Post',
  rootTyping: {
    path: path.join(__dirname, '..', '..', 'src', 'posts', 'aggregates.ts'),
    name: 'PostsAggregatePost1',
  },
  definition(t) {
    t.string('id', { resolve: (_) => _.postId })
    t.string('url')
    t.string('name')
    t.string('tagline')
    t.list.string('topics')
    t.list.string('downloadLinks')
    t.string('thumbnailUrl')
    t.field('author', {
      type: User,
      resolve: async (_) => {
        const agg = await makeUsersAggregate({ prisma })
        return agg[_.authorId]
      }
    })
  },
})

const User = objectType({
  name: 'User',
  rootTyping: {
    path: path.join(__dirname, '..', '..', 'src', 'users', 'aggregates.ts'),
    name: 'UsersAggregateUser',
  },
  definition(t) {
    t.string('id', { resolve: (_) => _.userId })
    t.string('name')
  },
})

const Query = queryType({
  definition(t) {
    t.field('posts', {
      type: list(Post),
      resolve: async () => {
        const agg = await makePostsAggregate({ prisma })
        return Object.values(agg).filter(isPostsAggregatePost1)
      },
    })
  },
})

const Mutation = mutationType({
  definition(t) {
    generateCommandMutations(t, { ...userCommands, ...postCommands }, prisma)
  },
})

export const schema = makeSchema({
  types: [Post, User, Query, Mutation],
  nonNullDefaults: { input: true, output: true },
  outputs: {
    typegen: path.join(
      __dirname,
      '..',
      '..',
      'node_modules',
      '@types',
      'nexusgen',
      'index.d.ts',
    ),
  },
})
