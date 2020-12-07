import { events } from './events'
import { makeAggregate } from '../lib/aggregates'

export type PostsAggregate = {
  [postId: string]: PostsAggregatePost
}

export type PostsAggregatePost = PostsAggregatePost0 | PostsAggregatePost1

export type PostsAggregatePost0 = {
  state: '0-url'
  postId: string
  url: string
  authorId: string
}

export type PostsAggregatePost1 = {
  state: '1-submission'
  postId: string
  url: string
  authorId: string
  name: string
  tagline: string
  topics: string[]
  downloadLinks: string[]
  thumbnailUrl: string
}

export function isPostsAggregatePost1(
  _: PostsAggregatePost,
): _ is PostsAggregatePost1 {
  return _.state === '1-submission'
}

export const makePostsAggregate = makeAggregate<
  PostsAggregate,
  typeof events
>()({
  'new-post-link': (agg, payload) => {
    agg[payload.postId] = { ...payload, state: '0-url' }
  },
  'new-post-submission': (agg, payload) => {
    agg[payload.postId] = {
      ...agg[payload.postId],
      ...payload,
      state: '1-submission',
    }
  },
})
