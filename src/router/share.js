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
      path: '/y2017/game/vuessrShare',
      name: 'vuessrShare',
      component: HelloWorld,
      redirect: '/'
    }, {
      path: '/test',
      name: 'Test',
      component: () =>
        import ('@/components/Test')
    }]
  })
}
