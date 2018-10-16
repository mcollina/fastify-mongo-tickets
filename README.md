# fastify-mongo-tickets

Demo ticket service with Fastify and MongoDB

## Install

```
npm i @matteo.collina/fastify-mongo-tickets
```

## Usage

```js
'use strict'

const Fastify = require('fastify')

const app = Fastify()

app.register(require('fastify-jwt'), {
  secret: 'averyverylongsecret'
})

app.register(require('fastify-mongodb'), {
  url: 'mongodb://localhost:27017',
  useNewUrlParser: true
})

app.register(require('@matteo.collina/fastify-mongo-tickets'))

app.listen(3000)
```

Works best in combo with
[https://github.com/mcollina/fastify-auth-mongo-jwt](https://github.com/mcollina/fastify-auth-mongo-jwt).

## API

Docs TBD, see tests.
It uses [fastify-mongodb](https://github.com/fastify-mongodb) and [fastify-jwt](https://github.com/fastify-jwt)

## License

MIT
