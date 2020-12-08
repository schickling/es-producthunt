import { aggregates } from '../aggregates'
import { defineCommands } from '../lib/commands'
import { events } from '../events'

export default defineCommands<typeof events>()({
  'new-post-link': {
    definition: events['new-post-link'],
    handler: async ({ payload, prisma }) => {
      const postAgg = await aggregates.posts({ prisma })
      const posts = Object.values(postAgg)
      const urls = posts.map((_) => _.url)
      if (urls.includes(payload.url)) {
        throw new Error(`Post with URL (${payload.url}) already exists.`)
      }

      const ids = posts.map((_) => _.postId)
      if (ids.includes(payload.postId)) {
        throw new Error(`Post with ID (${payload.postId}) already exists.`)
      }

      const userAgg = await aggregates.users({ prisma })
      const user = userAgg[payload.authorId]
      if (user === undefined) {
        throw new Error(`No such user with id ${payload.authorId}`)
      }

      return [{ kind: 'new-post-link', payload }]
    },
  },
  'new-post-submission': {
    definition: events['new-post-submission'],
    handler: async ({ payload, prisma }) => {
      const agg = await aggregates.posts({ prisma })
      const post = agg[payload.postId]
      if (post === undefined) {
        throw new Error(`No such post with id ${payload.postId}`)
      }
      if (post.state !== '0-url') {
        throw new Error(`Post in wrong state: ${post.state}. Expected: 0-url`)
      }
      return [{ kind: 'new-post-submission', payload }]
    },
  },
})
