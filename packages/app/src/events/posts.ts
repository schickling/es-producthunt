import { array, defineEvents } from '../lib/type-dsl'

export default defineEvents({
  'new-post-link': { postId: 'string', url: 'string', authorId: 'string' },
  'new-post-submission': {
    postId: 'string',
    name: 'string',
    tagline: 'string',
    topics: array('string'),
    // TODO minimum one
    downloadLinks: array('string'),
    thumbnailUrl: 'string',
  },
})
