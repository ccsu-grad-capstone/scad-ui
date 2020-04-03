/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
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
      console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')

      state.draftPicks = dp
    }
  },

  actions: {
    async getDraftPicksByLeague ({ commit, state, rootState }, leagueID) {
      console.log('[DRAFTPICK-ACTION] - getDraftPicksByLeague()')
      try {
        const response = await server.get(`/draftPicks/${leagueID}`)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        catchAxiosScadError(error)
      }
    },
    async saveDraftPick ({ dispatch }, dp) {
      console.log('[DRAFTPICK-ACTION] - saveDraftPick()')
      try {
        const response = await server.put(`/draftPicks/${dp._id}`, { data: dp })
        notify.saveSuccessful(response.data)
        await dispatch('getDraftPicksByLeague', dp.yahooLeagueID)
      } catch (error) {
        catchAxiosScadError(error)
      }
    }
  }
}
