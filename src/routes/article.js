const router = require('koa-router')()
// const userCtrl = require('../ctrls/user-ctrl')
// const User = require('../models/user-model')

router.prefix('/articles')

router.get('/edit', async (ctx, next) => {
    let id = ctx.params.id;
    let article = null;
    if (id) {
        // let article = ;
    }
    await ctx.render('article/edit', {article: article})
});

router.post('/edit', async (ctx, next) => {
    ctx.body = {result: "创建/更新"};
});

module.exports = router
