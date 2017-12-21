# vue-ssr-cli

### 技术栈：vue+vuex+vue-router（node 8.0+   webpack 2.0+）

> support ssr with node
> 基于vue-cli的服务端渲染脚手架

## Build Setup

``` bash
# install dependencies
npm install

# 打包生成环境与服务器端渲染资源
# gulp脚本执行多入口打包
gulp

# 启动本地服务
npm run dev
```
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
