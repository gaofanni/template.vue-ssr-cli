const renderToString = require(process.cwd() + "/tool/vueSsr");
module.exports = {
    index: async(ctx, next) => {
        // await next();
        try {
            let html = await renderToString({
                context: {
                    title: ctx.request.url,
                    url: ctx.request.url
                },
                project: 'test',
                entry: 'index',
                year: 2017,
                plat: 'game'
            });
            ctx.body = html;
        } catch (res) {
            console.log(res)
        }
    }
}