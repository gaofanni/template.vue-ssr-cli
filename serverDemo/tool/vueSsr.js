const fs = require("fs");
const path = require("path");
const { createBundleRenderer } = require("vue-server-renderer");
const resolve = file => path.resolve(__dirname, file);

// 生成服务端渲染函数
function render(opt) {
    let { year, plat, project, entry } = opt;
    let mainPath = path.join(process.cwd(), "./../release");
    let viewPath = process.cwd() + "/y" + year + '/' + plat + '/views/' + project
    return createBundleRenderer(
        require(mainPath + "/server-bundle-" + entry + ".json"), {
            // 推荐
            runInNewContext: false,
            // 模板html文件
            template: fs.readFileSync(resolve(viewPath + "/index.html"), "utf-8"),
            // client manifest
            clientManifest: require(mainPath + "/client-manifest-" + entry + ".json")
        }
    )
}


module.exports = function renderToString(opt) {
    if (!opt.project || !opt.entry || !opt.year || !opt.plat || !opt.context) {
        throw '参数缺失 renderToString({context,project:项目名,entry:入口名,year:年份,plat：发布平台})'
    }
    return new Promise((resolve, reject) => {
        render(opt).renderToString(
            opt.context,
            (err, html) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(html)
                }
            }
        );
    });
}