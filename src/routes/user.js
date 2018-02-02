const router = require('koa-router')()
const userCtrl = require('../ctrls/user-ctrl')
const User = require('../models/user-model')

router.prefix('/users')

router.get('/', async (ctx, next) => {
    console.log('+++++++')
    console.log(ctx.state.user)
    let users = await User.find({});
    ctx.body = {users: users}
})

module.exports = router
