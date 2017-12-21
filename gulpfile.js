var gulp = require('gulp')
    // var webpack = require('gulp-webpack')
    // var start = require('gulp-start-process')
var run = require('gulp-run')
var glob = require('glob')
var path = require('path')

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname, name;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/');
        name = tmp[tmp.length - 2];
        console.log(name)
        pathname = basename; // 正确输出js和html的路径
        entries[name] = entry;
    });

    return entries;
}

var serverEntries = getEntry('./src/entrances/**/entry-server.js');
var clientEntries = getEntry('./src/entrances/**/entry-client.js');

gulp.task('default', function(cb) {
    for (let n in serverEntries) {
        run('webpack --env.NODE_ENV=production --env.ENTRY=' + n + ' --config build/webpack.server.conf.js --progress --hide-modules').exec()
    }
    for (let n in clientEntries) {
        run('node build/build.js cross-env ENTRY=' + n).exec()
    }
})