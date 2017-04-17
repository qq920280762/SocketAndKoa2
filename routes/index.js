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

let get_socket_address = async (ctx)=>{
    ctx.body = 'http://'+config.server.socket.hostname+':'+config.server.socket.port;
};

router.get('/socket/address',get_socket_address);

router.get('/',get_index);

module.exports = router;