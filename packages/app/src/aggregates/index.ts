import { mergeObjDefault } from '../utils'
import * as posts from './posts'
import * as users from './users'
export * from './posts'
export * from './users'

// export * from './_barrel'

export const aggregates = { posts: posts.default, users: users.default }