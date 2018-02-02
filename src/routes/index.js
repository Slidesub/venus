const router = require('koa-router')()
const userCtrl = require('../ctrls/user-ctrl')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


router.get('/signin', async (ctx, next) => {
  await ctx.render('signin')
});
router.post('/signin', userCtrl.signin);


router.get('/signup', async (ctx, next) => {
  await ctx.render('signup')
});
router.post('/signup', userCtrl.signup);


// router.post('/signout', userCtrl.signout);


router.get('/passwd', async (ctx, next) => {
  await ctx.render('passwd')
});
router.post('/passwd', userCtrl.updatePassword);
module.exports = router
