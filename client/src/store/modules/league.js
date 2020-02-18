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

  },
  actions: {
    registerLeague ({ commit, state }) {
      console.log('[LEAGUE-ACTION] - registerLeague()')
      scad.post()
    }

  }
}
