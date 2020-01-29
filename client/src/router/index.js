import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import Vuelidate from 'vuelidate'

Vue.use(VueRouter)
Vue.use(Vuelidate)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
