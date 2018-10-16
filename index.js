'use strict'

const Mongo = require('fastify-mongodb')
const JWT = require('fastify-jwt')
const routes = require('./routes')

module.exports = async function (app, opts) {
  if (!app.mongo) {
    app.register(Mongo, opts.mongo || opts.mongodb)
  }

  if (!app.jwt) {
    app.register(JWT, opts.auth || opts.jwt)
  }

  app.register(routes, opts)
}

module.exports.autoPrefix = '/tickets'
