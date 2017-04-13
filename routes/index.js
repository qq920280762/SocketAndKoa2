'use strict';
const router = require('koa-router')();
const user = require('./user');

router.use('/user',user.routes());

let get_index = async (ctx,next)=>{
    ctx.session.user = 'The winner';
    ctx.state.title = 'welcome to koa2 ~';

    await ctx.render('index');
};


router.get('/',get_index);
module.exports = router;