const koa = require('koa');
const app = new koa();
const logger = require('koa-logger');
const session = require('koa-session');
const convert = require('koa-convert');
const views = require('co-views');
const router = require('./config/router')(); //路由控制文件
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const serve = require('koa-static');
const proxy = require('koa-proxy');

let release

app.use(async function(ctx, next) {
        let isOnline = (/^huodong.4399.cn/gi).test(ctx.hostname);
        ctx.state = Object.assign(ctx.state, { cdn: isOnline ? 'http://m.img4399.com/rds/' : '' });
        ctx.render = views(__dirname + '/serverDemo', {
            ext: 'ejs',
        });
        await next();
    })
    .use(serve(__dirname + '../release', {
        maxAge: 60 * 60 * 24 * 30 * 1000
    }))
    .use(session(app))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(logger());
app.listen(4040);