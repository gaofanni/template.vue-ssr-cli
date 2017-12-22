"use strict"

let router = require('koa-router')();
let koaBody = require('koa-body')({ multipart: true, jsonLimit: '100mb', formLimit: '100mb' });
router
//路径规则：/年份/项目/活动名(即controllers下命名的文件名)
    .all(/y2017\/(\w+)\/(\w+)(\/)?(\w*)/, async function(ctx, next) {
    let path = ctx.path;
    let match = path.match(/y2017\/(\w+)\/(\w+\.*\w+)(\/?)(\w*)/);
    let plat = match[1]; //获取平台
    let actName = match[2]; //获取活动名称
    let action = match[4] != '' ? match[4] : 'index';
    let controllers = require('../y2017/' + plat + '/controllers/' + actName)
    if (actName && controllers) {
        if (controllers[action]) {
            await controllers[action](ctx);
        } else {
            ctx.body = 'Not Found'
        }
    } else {
        ctx.body = 'Not Found'
    }
})

module.exports = function() {
    return router;
};