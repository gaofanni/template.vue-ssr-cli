const renderToString = require(process.cwd() + "/serverDemo/tool/vueSsr");
module.exports = {
    index: async(ctx, next) => {
        // await next();
        console.log(1)
        try {
            let html = await renderToString({
                context: {
                    title: ctx.request.url,
                    url: ctx.request.url
                },
                project: 'test',
                entry: 'share',
                year: 2017,
                plat: 'game'
            });
            ctx.body = html;
        } catch (res) {
            console.log(res)
        }
    }
}