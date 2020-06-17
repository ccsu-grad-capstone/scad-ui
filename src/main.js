import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import VueWindowSize from 'vue-window-size'

import './quasar'

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(VueWindowSize)

Vue.$cookies.config('7d')
Vue.$cookies.set('theme', 'default')
Vue.$cookies.set('hover-time', '1s')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
