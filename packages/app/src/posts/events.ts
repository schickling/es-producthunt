import { array, defineEvents } from '../lib/type-dsl'

export const events = defineEvents({
  'new-post-link': { postId: 'string', url: 'string' },
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
