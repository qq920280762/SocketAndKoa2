'use strict';
const router = require('koa-router')();
const UserService = require('../service/UserService');
const randomNames = require('../utils/randomNames');

let get_index = async (ctx,next)=>{
    ctx.session.user = 'The winner';
    ctx.state.title = 'hello user ~';

    await ctx.render('index');
};

let sign_in = async(ctx,next)=>{
    let UserSv = new UserService();
    let user =  await UserSv.findOne({account:ctx.query.account,pwd:ctx.query.pwd});
    ctx.body = user;

}

let sign_up = async(ctx,next)=>{
    let UserSv = new UserService();
    let user =  await UserSv.findOne({account:ctx.query.account,pwd:ctx.query.pwd});
    if(user){
        ctx.body = user;
    }else{
        ctx.query.userName = randomNames.getRandomName();
        let result = await UserSv.insert(ctx.query);
        user = await UserSv.findOne({account:ctx.query.account,pwd:ctx.query.pwd});
        ctx.body = user;
    }


}

router.get('/',get_index);

router.get('/sign/up',sign_up);

router.get('/sign/in',sign_in);

module.exports = router;