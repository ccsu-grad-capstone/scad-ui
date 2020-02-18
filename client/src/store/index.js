import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import league from './modules/league'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    league
  }
})
