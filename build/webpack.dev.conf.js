"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const glob = require('glob')
const path = require('path')

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname, name;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/');
        name = tmp[tmp.length - 2];
        console.log(name)
        pathname = basename; // 正确输出js和html的路径
        entries[name] = entry;
    });

    return entries;
}

baseWebpackConfig.entry = getEntry('./src/entrances/**/entry-client.js');
let tml = [];
for (var i in baseWebpackConfig.entry) {
    tml.push({
        filename: 'view/' + i + '.html',
        template: './src/template.ejs',
        inject: true,
        chunks: ["" + i, 'vendor', 'manifest'],
        title: config.title,
        slot: '<div id=app />',
        chunksSortMode: 'dependency'
    });
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ["./build/dev-client"].concat(
        baseWebpackConfig.entry[name]
    );
});
console.log(baseWebpackConfig.tml)

var devConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: "#cheap-module-eval-source-map",
    plugins: [
        new webpack.DefinePlugin({
            "process.env": config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //     filename: "index.html",
        //     template: "front.html",
        //     inject: true
        // }),
        new FriendlyErrorsPlugin()
    ]
});
for (var i in tml) {
    devConfig.plugins.push(
        new HtmlWebpackPlugin(tml[i])
    )
}
module.exports = devConfig;