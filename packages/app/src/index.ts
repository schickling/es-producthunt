import Fastify from 'fastify'
import mercurius from 'mercurius'
import { schema } from './graphql'

const app = Fastify()

app.register(mercurius, {
  schema,
  ide: 'graphiql',
  // context: buildContext
})

app.get('/', async function (req, reply) {
  const query = '{ add(x: 2, y: 2) }'
  return reply.graphql(query)
})

app.listen(3000, (err, addr) => console.log(err ?? `Running on ${addr}`))

