/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import leagueStandings from '../../data/leagueStandings'
import { node } from '../../utilities/axios-node'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

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
    async getDraftPicksByLeague ({ commit, state, rootState }, { leagueId, year }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByLeague()')
      try {
        const response = await node.get(`/draftPicks/${leagueId}/${year}`)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getDraftPicksByTeam ({ commit, state, rootState }, { teamId, year }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByTeam()')
      try {
        const response = await node.get(`/draftPicks/${rootState.league.yahooLeagueId}/${year}/${teamId}`)
        console.log('DRAFTPICKS-team', response.data.data)
        commit('updateDraftPicksByTeam', { dp: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async saveDraftPick ({ dispatch }, dp) {
      // console.log('[DRAFTPICK-ACTION] - saveDraftPick()')
      try {
        const response = await node.put(`/draftPicks/${dp._id}`, { data: dp })
        notify.saveSuccessful(response.data)
        await dispatch('getDraftPicksByLeague', dp.yahooLeagueId)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
