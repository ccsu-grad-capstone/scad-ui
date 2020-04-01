// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import leagueStandings from '../../data/leagueStandings'
import draftPicks from '../../data/draftPicks'
import { server } from '../../utilities/axios-server'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    draftPicks: [],
    teams: draftPicks.draftPicks.teams
  },
  getters: {

  },

  mutations: {
    updateDraftPicks (state, { dp }) {
      state.draftPicks = dp
    }
  },

  actions: {
    async getDraftPicksByLeague ({ commit, state }, leagueID) {
      try {
        const response = await server.get(`/draftPicks/${leagueID}`)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        catchAxiosScadError(error)
      }
    }
  }
}
