import * as path from 'path'
import {
  makeSchema,
  objectType,
  queryType,
  list,
  mutationType,
} from '@nexus/schema'
import { commands } from '../commands'
import { PrismaClient } from '@prisma/client'
import { isPostsAggregatePost1, aggregates } from '../aggregates'
import { generateCommandMutations } from './command-mutations'

const prisma = new PrismaClient()

const Post = objectType({
  name: 'Post',
  rootTyping: {
    path: path.join(__dirname, '..', '..', 'src', 'aggregates', 'index.ts'),
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
        const agg = await aggregates.users({ prisma })
        return agg[_.authorId]
      },
    })
  },
})

const User = objectType({
  name: 'User',
  rootTyping: {
    path: path.join(__dirname, '..', '..', 'src', 'aggregates', 'index.ts'),
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
        const agg = await aggregates.posts({ prisma })
        return Object.values(agg).filter(isPostsAggregatePost1)
      },
    })
  },
})

const Mutation = mutationType({
  definition(t) {
    generateCommandMutations(t, commands, prisma)
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
