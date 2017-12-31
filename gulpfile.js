var gulp = require('gulp')
var run = require('gulp-run')
var glob = require('glob')
var path = require('path')

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
//获取服务端与客户端文件打包入口
var serverEntries = getEntry('./src/entrances/**/entry-server.js');
var clientEntries = getEntry('./src/entrances/**/entry-client.js');

gulp.task('default', function (cb) {
    //打包服务端bundle
    for (let n in serverEntries) {
        run('webpack --env.NODE_ENV=production --env.ENTRY=' + n + ' --config build/webpack.server.conf.js --progress --hide-modules').exec()
    }
    //打包客户端bundle
    for (let n in clientEntries) {
        run('node build/build.js cross-env ENTRY=' + n).exec()
    }
})