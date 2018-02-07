const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const config = require('./config')
const koajwt = require('koa-jwt');

const index = require('./src/routes/index')
const user = require('./src/routes/user')
const article = require('./src/routes/article')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))
app.use(views(__dirname + '/src/views', {
  map: {
    html: 'nunjucks'
  }
}))

// mongoose
mongoose.connect(config.database)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// jwt
app.use(koajwt({secret: config.secret, key: 'user', debug: true}).unless({
  path: [
    /^\/signin/,
    /^\/signup/,
    /^\/passwd/,
    /^\/articles\/edit/,
  ]
}))
// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(article.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
