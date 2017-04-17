'use strict';
const router = require('koa-router')();
const user = require('./user');
const config = require('../config');

router.use('/user',user.routes());

let get_index = async (ctx)=>{
    ctx.session.user = 'The winner';
    ctx.state.title = 'welcome to koa2 ~';

    await ctx.render('index');
};

let get_server_address = async (ctx)=>{
    ctx.body = 'http://'+config.server.hostname+':'+config.server.port;
};

router.get('/server/address',get_server_address);

router.get('/',get_index);
module.exports = router;