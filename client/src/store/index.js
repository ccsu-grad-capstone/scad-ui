import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import league from './modules/league'
import dialog from './modules/dialog'
import team from './modules/team'
import draftPicks from './modules/draftPicks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    league,
    dialog,
    team,
    draftPicks
  }
})
