import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import Detail from '@/components/Detail'
import demo from '@/components/demo'
import lotteryPage from '@/components/lotteryPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/lotteryPage',
      name: 'lotteryPage',
      component: lotteryPage
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/demo',
      name: 'demo',
      component: demo
    }
  ]
})
