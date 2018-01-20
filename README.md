# vue-ssr-cli

### 技术栈：vue+vuex+vue-router（node 8.0+   webpack 2.0+）

> 基于vue-cli的多入口服务端渲染脚手架

## Build Setup

``` bash
# 全局安装huodong
npm install huodong-cli -g

# 安装vue-ssr-cli
huodong init vue-ssr-cli

# 进入文件夹安装依赖
npm install

# 打包生成环境与服务器端渲染资源
# 用webpack打包无法实现多入口打包，打包出来的结果会将多入口打包在一起，导致路由访问错误，所以改用gulp打包
gulp

# 启动本地服务
npm run dev

```

## 基本文件结构

```bash

    -build
        -utils.js#css图片路径在这里配置
        -webpack.base.conf.js#基本配置入口，包括base64限制大小，现默认60k
        -webpack.prod.conf.js#打包client-manifest入口
        -webpack.server.conf.js#打包server-bundle入口
    -config
        -index.js#配置的入口文件，大多数配置在这里修改
    -src
        -entrances#入口文件夹
        -router#路由
        -store#仓库
    -static
    images.js#这是曹志辉写的根据图片(src/images)自动生成scss的脚本（生成地址：src/common/sass/），很好用
    gulpfile.js#执行gulp打包

```
# client部分说明：前端开发部分
---
## 入口文件说明
* 新增入口需在src/entrances内新建文件夹
* 示例为多入口模式，单入口只需entrances内留有一个文件夹
* entry-client：客户端入口
* entry-server：服务端打包入口
> 注意：文件夹命名与打包后的文件命名一一对应

---

## vue-router路由
* 客户端和服务端必须复用相同的路由配置！
* 客户端和服务端必须复用相同的路由配置！
* 客户端和服务端必须复用相同的路由配置！（重要的事情说三遍）
  > 比如现在的服务端路径大多为"/y2017/平台名/项目名"，那么vue-router也需要一模一样的配置:`new Router({path: '/y2017/game/vuessr/index'})`
* 示例使用的是hash模式，即客户端与服务端只需要首页路由一致
* 要使用histroy模式，页面级路由要完全一致

---
## vuex状态管理库，数据预取
* 在服务端渲染期间，本质上是渲染应用程序的“快照”，所以数据渲染需要预取
* 路由组件上暴露出一个预取钩子`asyncData`
* `asyncData` 在服务端调用，即可直出带有数据的html
  ```bash
   #使用方式

   # 需返回一个promise，让服务端等待数据预取
   # 此勾子只会在服务端执行，客户端不调用
   # 回调参数为{仓库，路由，上下文}
   asyncData({ store, route, ctx }) {
       #ctx为koa中的ctx
      return store.dispatch("getTest", { test: 2 });
   }
  ```

---
## 配置
* 配置项config/index.js内进行配置文件打包地址与静态资源挂载地址  
* 默认打包出来的css图片路径是按照"项目名/static/入口名/"的层级放置，如果需要更改，请到build/utils中`ExtractTextPlugin.extract({publicPath:配置地址})`  

---
# server部分说明：node部分

## 路由配置
* 在对应controllers内添加与服务端路由对应的routerName.js
 ``` bash
const { createBundleRenderer } = require("vue-server-renderer");

# 使用vue-server-renderer方法
# 将打包后的json文件渲染至模板上
function render({ context, project, entry, year, plat }, data = {}) {
    let releasePath = process.cwd() + '/release/y' + year + '/' + plat + '/' + project;
    let serverPath = process.cwd() + '/server/y' + year + '/' + plat + '/views/' + project;

    # 先进行模板插值
    return new Promise(async(res, rej) => {
        let file
        let fileName = resolve(serverPath + "/index.ejs")
        try {
            #ejs模板插值
            #用于将数据插入模板上，如meta标签等
            file = await new Promise((resolve, reject) => {
                ejs.renderFile(fileName, data, function(err, str) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(str)
                    }
                })
            });
        } catch (err) {
            console.log(err)
        }
        res(
            createBundleRenderer(
                require(releasePath + "/server-bundle-" + entry + ".json"), {
                    # 推荐
                    runInNewContext: false,
                    # 模板html文件
                    template: file,
                    # client manifest
                    clientManifest: require(releasePath + "/client-manifest-" + entry + ".json")
                }
            )
        )
    })


}


module.exports = function renderToString(opt, data) {
    if (!opt.project || !opt.entry || !opt.ctx || !opt.year || !opt.plat) {
        throw '参数缺失 renderToString({ctx,project:项目名,entry:入口名,year:年份，plat:平台})'
    }
    return new Promise(async(resolve, reject) => {
        let rend = await render(opt, data);
        rend.renderToString(opt.ctx,
            (err, html) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(html)
                }
            }
        );
    });
}


# 此文件在tool/vueSsr.js可以直接使用

 ```
* 在查找路由时调用renderToString即可直出html
``` bash
`controllers/路由名.js`

index:async (ctx, next) => {
    try {
        # 调用renderToString方法直出对象
        let html = await renderToString({
            ctx,#上下文，一定要传
            project:'test',#项目名
            entry:'index',#入口名，也就是client中entrances内文件夹名
            year:2017,#年份，用于y2017/的拼写
            plat:'game'#平台名称，游戏盒，游拍等
        },{
            #这边放置模版插值内容，
            #有需要直出数据到模板的话在这里填写
        });
        ctx.body = html;
    } catch (res) {
        console.log(res)
    }
}
```
* view渲染模板
```bash
'views/项目名/index.html'

# 支持ejs模板插值
如：<%= meta %>

# 服务端直出的html内容插入于<!--vue-ssr-outlet-->中
# js渲染后将其替换
<body>
<!--vue-ssr-outlet-->
</body>

```
---
## 遇到的一些坑

* 如果有图片，跑不动，报错css-loader找不到依赖，需重新`npm install css-loader sass-loader style-loader node-sass --save `   
* 访问路径时，pm2 log报错404  
  >可能原因：前端vue-router定义path与服务端访问路径不一致  
* 访问路径是，报错：`name of undefined`  
  >可能原因：renderToString调用时ctx参数没传
* 首页渲染周期的理解
  >报错：`window，localstorage is not defined`   
  >原因：首页直出的所有组件的`created`和`beforeCreate`钩子和`beforeRouteEnter`、`beforeEach`等路由钩子、`import`进组件的模块中的定义、`data`的定义都会在服务端执行，所以一定不可以执行或调用window和localStorage这种服务端没有的变量不能使用，否则将会报错  
  >解决：如需定义`data`与`window`相关联，在mounted钩子内再定义；import的模块需谨慎，小心不要引入带有client变量（如window、localstorage等），如果一定需要引入，可异步在调用时引入  
* 静态资源在线上会部署到cdn，其他环境访问服务器下的地址，也就是线上与其他环境的静态资源路径不一致
* >问题：由于服务端渲染地址是通过webpack打包出，无法用模板插值的方式将静态地址直出到页面，如果要改变地址，则要上线后重新打包，修改地址，效率低下  
  >解决：node端开静态资源请求代理，判断是否线上请求，如果是线上则代理转发到cdn域名下，比较灵活
---
## 缓存策略
* 服务端渲染的性能消耗主要是来源于在服务端需要在每一次请求都重新渲染一边vue组件
* > 由于活动中node无法获得用户身份标识，返回给用户的初始数据在短时间内，都没有太大变化，且首屏渲染后前端还会再次进行带有用户标识（scookie）的请求来进行覆盖，所以短时间内是可以进行缓存的  
  > 使用`lru`进行`ssr render`后的缓存，相同地址在`maxage=5分钟`内将不再重新服务端渲染vue，使得性能大大提高
* 服务端渲染的优势是**样式和结构都放在模板上**，达到传统web开发的直出效果，但是这也有很大的劣势，**样式和结构都放在模板上，导致文件过大，图片多的时候可能导致好几百k**
* > 思路：本地缓存刻不容缓！本打算直接加`cache-control`本地缓存，比较简单暴力，多次尝试失败后，查阅资料发现**浏览器直接访问的入口页面刷新或进入，浏览器会让当前这个文件所设定的过期时间失效**  
  > 解决：在`node`增加`304缓存`（`last-modified`）,modified时间与`serverBundle`挂钩，达到在文件模板不更新的情况下，无论几次访问，都将返回304缓存，告知浏览器去读取本地缓存
---
## 保险措施，打包出纯前端页面

* 防止服务端渲染导致服务器崩溃，增加纯前端渲染模板入口以备不时之需
* >问题：服务端渲染开发过程中增加假数据在模板上，注释后打包出的模板也包含假数据注释，并不合适  
  >解决：增加模板minify功能，对注释打包消除
* 开发过程中，一般会有两个本地服务：dev-server与node，当需要用dev-server请求node接口时，会存在因不同端口的跨域问题
* >解决：node增加koa2-cors允许跨域，判断条件暂时为，请求内host为（192.168||localhost）时支持跨域 
* 纯前端页面部署在cdn（m.img4399.com），域名与node端(mm.img4399.com)不一致，请求存在跨域问题
* >解决：node端开允许跨域，允许cdn所属域名的跨域请求

