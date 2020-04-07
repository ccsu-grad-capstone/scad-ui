import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import Vuelidate from 'vuelidate'
import VueCookies from 'vue-cookies'
import user from '../store/modules/user'
// import league from '../store/modules/league'
// import store from '../store'

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
  // If the requested route requires auth..
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('ROUTER - Route Requires Auth')
    // If there's not access_token in cookies, but there is one in a query param.. continue..
    if (!Vue.$cookies.get('access_token')) {
      console.log('ROUTER - NO - access_token in cookie.. No Active User')
      if (to.query.access_token) {
        next()
        // else, no user, go to index to log in..
      } else {
        next({ path: '/about' })
      }
      // else, there is an access_token..
    } else {
      console.log('ROUTER - YES - access_token in cookie.. Active User')

      if (to.matched.some(record => record.meta.requiresLeague)) {
        console.log('ROUTER - Requires League')
        next()
        // if (!league.state.isActive) {
        //   console.log('ROUTER - NO - SCAD Leagues.. Redirect to index..')
        //   // store.dispatch('league/getScadInfo')
        //   next({ path: '/about' })
        // } else {
        //   next()
        // }
      } else if (to.matched.some(record => record.meta.isAdmin)) {
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
  } else {
    console.log('ROUTER - Doesnt Require Auth')
    next()
  }
})

export default router
