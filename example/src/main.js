// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/element/theme/index.css'
import '@/assets/css/style.scss'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import globalConfig from '@/public/config'
import { dateFormat } from '@/utils'
// import './mock/mock'

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.prototype.gc = globalConfig

Vue.filter('dateFormat', function (value, fmt) {
  if (!value) return ''
  return dateFormat(fmt, new Date(value))
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
