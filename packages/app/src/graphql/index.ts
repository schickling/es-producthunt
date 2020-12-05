import * as path from 'path'
import {
  makeSchema,
  objectType,
  queryType,
  list,
  mutationType,
} from '@nexus/schema'
import { commands } from '../posts/commands'
import { PrismaClient } from '@prisma/client'
import { isPostsAggregatePost1, makePostsAggregate } from '../posts/aggregates'
import { generateCommandMutations } from './command-mutations'

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
    generateCommandMutations(t, commands, prisma)
  },
})

export const schema = makeSchema({
  types: [Post, Query, Mutation],
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
