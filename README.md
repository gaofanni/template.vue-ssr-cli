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
# gulp脚本执行多入口打包
gulp

# 启动本地服务
npm run dev

```
# client部分说明
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
* 示例使用的是hash模式，即客户端与服务端只需要首页路由一致
* 要使用histroy模式，页面级路由要完全一致

---
## vuex状态管理库，数据预取
* 在服务端渲染期间，本质上是渲染应用程序的“快照”，所以数据渲染需要预取
* 路由组件上暴露出一个预取钩子`asyncData`
* `asyncData` 在服务端调用，即可直出带有数据的html

---
## 配置
* 配置项config/index.js内进行配置文件打包地址与静态资源挂载地址
* 注意：服务端输出地址挂载在路由路径下，如果跑通后静态资源报错，请检查静态资源挂载地址
---
# server部分说明

## 路由配置
* 在对应controllers内添加与服务端路由对应的routerName.js
 ``` bash
const { createBundleRenderer } = require("vue-server-renderer");
# 使用vue-server-renderer方法
# 将打包后的json文件渲染至模板上
function render(){
    createBundleRenderer(
        # server-bundle地址
        require(mainPath + "/server-bundle-" + entry + ".json"), {
            runInNewContext: false,
            # 模板html文件
            template: fs.readFileSync(resolve(viewPath + "/index.html"), "utf-8"),
            # client manifest
            clientManifest: require(mainPath + "/client-manifest-" + entry + ".json")
        }
    )
}
module.exports = function renderToString() {
    return new Promise((resolve, reject) => {
        render().renderToString(
            context,
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

# 此文件在tool/vueSsr.js可以直接使用
 ```
* 在查找路由时调用renderToString即可直出html
``` bash
`controllers/路由名.js`

index:async (ctx, next) => {
    try {
        # 调用renderToString方法直出对象
        let html = await renderToString({
            context: {
                title: ctx.request.url,
                url: ctx.request.url
            },
            project:'test',#项目名
            entry:'index',#入口名，也就是client中entrances内文件夹名
            year:2017,#年份，用于y2017/的拼写
            plat:'game'#平台名称，游戏盒，游拍等
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

# 服务端直出的html内容插入于<!--vue-ssr-outlet-->中
# js渲染后将其替换
<body>
<!--vue-ssr-outlet-->
</body>

```
---
## 遇到的一些坑

* 如果有图片，跑不动，报错css-loader找不到依赖，需重新cnpm install css-loader sass-loader style-loader node-sass --save
* 
