
/* 动态化异步静态文件的插入地址，使得模板可动态插入 */
__webpack_public_path__ = window.__webpack_public_path__;

import { createApp } from './index'
const { app, router, store } = createApp()
//在使用template时，context.state作为window.__INITIAL_STATE__的状态
//自动嵌入html中，
//在客户端时，挂在到应用程序前，就会获取到状态
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}
// 因为可能存在异步组件，所以等待router将所有异步组件加载完毕，服务器端配置也需要此操作
router.onReady(() => {
    console.log('router ready')
    app.$mount('#app')
})