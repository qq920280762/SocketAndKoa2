'use strict';
const koa = require('koa');
const app = new koa();
const path = require('path');
const convert = require('koa-convert');
const bodyParser  = require('koa-bodyparser');
const resource = require('koa-static');
const views = require('koa-views');
const session     = require('koa-session2');
var redisStore = require('./redisStore');
const logger = require('koa-logger');
const json = require('koa-json');

const index = require('./routes');
const config = require('./config');

/* convert 可让中间件最适合配koa2 */
app.use(convert(logger()));

app.use(convert(json()));

app.use(convert(bodyParser()));

app.use(convert(resource(__dirname + '/public' )));

app.use(convert(views(__dirname + '/views' ,{
    //后缀
    extension: 'html',
    //引擎 jade ejs swig templayed pug 见 views : require('consolidate')
    map: { html:'nunjucks'}
    }
)));
if(config.session.useRedis){
    app.use(session({
        key:config.session.key,
        store:new redisStore(config.session.server)
    }));
}else{
    app.use(session({
        key:config.session.key
    }));
}


app.use(async (ctx, next) => {
    ctx.state.SESSION = ctx.session;
    ctx.state.CDN     = config.CDN;
    await next();
});

app.use(index.routes());

app.on('error', function(err, ctx){
    console.log(err);
});

module.exports = app;