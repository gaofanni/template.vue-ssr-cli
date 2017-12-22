import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'hash',
        routes: [{
            path: '/',
            component: HelloWorld
        }, {
            path: '/y2017/game/vuessr/share', //路径一定要与服务端路由匹配
            name: 'vuessrShare',
            component: HelloWorld,
            redirect: '/', //推荐加上
        }, {
            path: '/test',
            name: 'Test',
            component: () =>
                import ('@/components/Test')
        }]
    })
}