'use strict'

const S = require('fluent-schema')

const ticketSchema = S.object()
  .prop('_id', S.string())
  .prop('title', S.string().required())
  .prop('body', S.string().required())

module.exports = async function (app, opts) {
  if (!app.hasRequestDecorator('jwtVerify')) {
    throw new Error('fastify-jwt plugin is required')
  }

  if (!app.hasDecorator('mongo')) {
    throw new Error('fastify-mongodb plugin is required')
  }

  const tickets = app.mongo.db.collection('tickets')
  const { ObjectId } = app.mongo

  app.addHook('preHandler', function (req, reply) {
    return req.jwtVerify()
  })

  app.post('/', {
    schema: {
      body: ticketSchema,
      response: {
        '2xx': ticketSchema
      }
    }
  }, async function (req, reply) {
    const data = await tickets.insertOne(Object.assign({
      username: req.user.username
    }, req.body))

    const _id = data.ops[0]._id

    reply
      .code(201)
      .header('location', `${this.prefix}/${_id}`)

    return Object.assign({
      _id
    }, req.body)
  })

  app.get('/', {
    schema: {
      response: {
        '2xx': S.object()
          .prop('tickets', S.array().items(ticketSchema))
      }
    }
  }, async function (req, reply) {
    const array = await tickets.find({
      username: req.user.username
    }).sort({
      _id: -1 // new tickets first
    }).toArray()

    return { tickets: array }
  })

  app.get('/:id', {
    schema: {
      response: {
        '2xx': ticketSchema
      }
    }
  }, async function (req, reply) {
    const id = req.params.id

    const data = await tickets.findOne({
      username: req.user.username,
      _id: new ObjectId(id)
    })

    if (!data) {
      reply.code(404)
      return { status: 'not ok' }
    }

    return data
  })
}
