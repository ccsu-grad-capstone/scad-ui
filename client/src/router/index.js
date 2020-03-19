import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import Vuelidate from 'vuelidate'
import VueCookies from 'vue-cookies'
import user from '../store/modules/user'

Vue.use(VueRouter)
Vue.use(Vuelidate)
Vue.use(VueCookies)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Route Auth
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Vue.$cookies.get('access_token')) {
      if (to.query.access_token) {
        next()
      } else {
        next({
          path: '/'
        })
      }
      console.log('ROUTER - no access_token')
    } else {
      // let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.isAdmin)) {
        console.log('ROUTER - user.state.isAdmin', user.state.isAdmin)
        if (user.state.isAdmin) {
          next()
        } else {
          next({ path: '/dashboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next({ name: 'userboard' })
    }
  } else {
    next()
  }
})

export default router
