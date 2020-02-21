// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'

export default {
  namespaced: true,
  state: {
    league: {
      hi: 'hi'
    },
    yahooLeagues: [ ],
    scadLeagues: []
  },
  getters: {

  },

  mutations: {
    updateLeague (state, league) {
      console.log('[LEAGUE-MUTATION] - updateLeague(): ', league.league)
      state.league = league
    }
  },
  actions: {
    registerLeague ({ commit, state }, { league }) {
      console.log('[LEAGUE-ACTION] - registerLeague()')
      scad.post()
      commit('updateLeague', { league: league })
    },
    emailLeagueMembers (state) {
      console.log('[LEAGUE-ACTION] - emailLeagueMembers()')
      scad.post()
    }
  }
}
