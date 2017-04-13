'use strict';
const router = require('koa-router')();

let get_index = async (ctx,next)=>{
    ctx.session.user = 'The winner';
    ctx.state.title = 'hello user ~';

    await ctx.render('index');
};


router.get('/',get_index);

module.exports = router;