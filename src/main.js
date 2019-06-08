// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-theme-chalk';
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/icon.css'
import App from './App'
import router from './router'
import axios from 'axios'
let done = 0
let start = 0

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/' : '/api/'
axios.interceptors.response.use(response => {
  done++

  return response
}, error => {
  done = start = 0

  if (error.toString() === 'Error: timeout of 15000ms exceeded') {
    message({
      type: 'error',
      message: ' 请求超时!'
    })
  }
  const response = error.response
  // token过期
  const info = response.data
  console.log(info)

  if (response.status === 401 && info.code === 401 || response.status === 400) {
    setTimeout(() => {
      ElementUI.Message({
        type: 'error',
        message: '登录过期，请重新登录'
      })
      router.push({ path: '/login' })
      // location.reload() // 为了重新实例化vue-router对象 避免bug
    }, 1000)
  } else if (response.status === 502) {
    Message({
      message: '后端服务异常，请联系管理员！',
      type: 'error',
      duration: 1000
    })
  }
  return Promise.reject(error)
})

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  components: { App },
  template: '<App/>'
})
