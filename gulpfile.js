const gulp = require('gulp')
const exec = require('child_process').exec;
const glob = require('glob')
const path = require('path')
const editor = require('gulp-json-editor')
const releasePath = require('./config/index').build.assetsRoot;

function getEntry(globPath) {
    var entries = {}, entryArr = [],
        basename, tmp, pathname, name;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/');
        name = tmp[tmp.length - 2];
        entryArr.push(name);
        pathname = basename; // 正确输出js和html的路径
        entries[name] = entry;
    });

    return { entries, entryArr };
}
//获取服务端与客户端文件打包入口
let serverEntryInfo = getEntry('./src/entrances/**/entry-server.js');
let entryArr = serverEntryInfo.entryArr;
var serverEntries = serverEntryInfo.entries;
var clientEntries = getEntry('./src/entrances/**/entry-client.js').entries;


gulp.task('default', function (cb) {
    //打包服务端bundle
    for (let n in serverEntries) {
        exec('webpack --env.NODE_ENV=production --env.ENTRY=' + n + ' --config build/webpack.server.conf.js --progress --hide-modules', function (err, stdout) {
            //命令行打印log
            console.log(stdout)
        })
    }
    //打包客户端bundle
    for (let n in clientEntries) {
        exec('node build/build.js cross-env ENTRY=' + n, function (err, stdout) {
            console.log(stdout)

            /**
             * 由于资源打包过程中manifest与client-manifest打包的publicPath一致无法拆分
             * 由gulp进行一次将client-manifest的publicPath替换cdn标志位为'%iamcdn%'
             */
            gulp.src(releasePath + '/client-manifest-*.json')
                .pipe(editor({
                    publicPath: '%iamcdn%'
                }))
                .pipe(gulp.dest(releasePath))

        })
    }
})