/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import leagueStandings from '../../data/leagueStandings'
import { server } from '../../utilities/axios-server'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    draftPicks: [],
    draftPicksByTeam: []
  },
  getters: {

  },

  mutations: {
    updateDraftPicks (state, { dp }) {
      // console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')

      state.draftPicks = dp
    },
    updateDraftPicksByTeam (state, { dp }) {
      // console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')

      state.draftPicksByTeam = dp
    }
  },

  actions: {
    async getDraftPicksByLeague ({ commit, state, rootState }, leagueId) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByLeague()')
      try {
        const response = await server.get(`/draftPicks/${leagueId}`)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        catchAxiosScadError(error)
      }
    },
    async getDraftPicksByTeam ({ commit, state, rootState }, teamId) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByTeam()')
      try {
        const response = await server.get(`/draftPicks/${rootState.league.yahooLeagueId}/team/${teamId}`)
        console.log('DRAFTPICKS-team', response.data.data)
        commit('updateDraftPicksByTeam', { dp: response.data.data })
      } catch (error) {
        catchAxiosScadError(error)
      }
    },
    async saveDraftPick ({ dispatch }, dp) {
      // console.log('[DRAFTPICK-ACTION] - saveDraftPick()')
      try {
        const response = await server.put(`/draftPicks/${dp._id}`, { data: dp })
        notify.saveSuccessful(response.data)
        await dispatch('getDraftPicksByLeague', dp.yahooLeagueId)
      } catch (error) {
        catchAxiosScadError(error)
      }
    }
  }
}
