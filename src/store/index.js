import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import league from './modules/league'
import dialog from './modules/dialog'
import team from './modules/team'
import player from './modules/player'
import draftPicks from './modules/draftPicks'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    league,
    dialog,
    team,
    draftPicks,
    player
  }
})

export default store