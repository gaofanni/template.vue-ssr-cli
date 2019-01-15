"use strict";

const path = require("path");
let glob = require('glob')
let version = 1; //请配置活动版本，默认为1
let name = "{{name}}";
let year = "{{year}}";
let plat = "{{plat}}";
let title = '';//请配置活动标题

/**
 * 项目中打包地址可修改为
 * let releasePath = `../../../../../release/y${year}/${plat}/${name}/`;
 * let serverReleasePath = `../../../../server/y${year}/${plat}/views/${name}/`;
 */
let releasePath = "../release/"; //请配置打包后的输出路径
let assetsPath = "./"; //请配置打包后的静态资源挂载路径
let serverReleasePath = "../release/";//配置打包后的服务端渲染模板路径，将生成index.ejs供node入口的ssr插入

//获得入口名,build使用
let entry;
for (let n in process.argv) {
    n = process.argv[n]
    if (n.indexOf('ENTRY=') > -1) {
        entry = n.split('=')[1];
    }
}

module.exports = {
    entry: './src/entrances/' + entry + '/entry-client.js',
    entryName: entry,
    version: version,
    title: title,
    template: {//打包前端所用模板
        filename: entry + '.html',
        template: './src/template.ejs',
        inject: true,
        chunks: ['main', 'vendor', 'manifest'],
        chunksSortMode: 'dependency',
        slot: '<div id=app />',
        publicPath: `<script>window.__webpack_public_path__='%iamcdn%'</script>`,
        title: title,
        minify: { //压缩打包的模板内注释
            removeComments: true,
            minifyJS: true
        }
    },
    serverTemplate: {//打包服务端渲染所用模板
        filename: serverReleasePath + 'index.ejs',
        template: './src/template.ejs',
        inject: false,
        chunks: ['main', 'vendor', 'manifest'],
        chunksSortMode: 'dependency',
        slot: '<!--vue-ssr-outlet-->',
        publicPath: `<script>window.__webpack_public_path__='%iamcdn%'</script>`,
        title: title,
        minify: {
            minifyJS: true
        }
    },
    build: {
        env: require("./prod.env"),
        index: path.resolve(__dirname, "../dist/index.html"),
        assetsRoot: path.resolve(__dirname, releasePath),
        assetsSubDirectory: "static/" + entry,
        assetsPublicPath: assetsPath,
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require("./dev.env"),
        port: process.env.PORT || 7777,
        autoOpenBrowser: true,
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        proxyTable: {
            '/redirect/': {
                target: '',
                pathRewrite: {
                    '^/redirect/': '/redirect/'
                },
                changeOrigin: true
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
};
