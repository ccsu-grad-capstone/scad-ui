/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
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
    async getDraftPicksByLeague ({ commit, state, rootState }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByLeague()')
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/draftPicks/${rootState.league.scadLeagueId}/${rootState.league.scadSettings.seasonYear}`)
        console.log('DRAFTPICKS-league', response.data)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getDraftPicksByTeam ({ commit, state, rootState }, { guid }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByTeam()', guid)
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/draftPicks/${rootState.league.scadLeagueId}/${rootState.league.scadSettings.seasonYear}/${guid}`)
        console.log('DRAFTPICKS-team', response.data)
        commit('updateDraftPicksByTeam', { dp: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async saveDraftPick ({ dispatch, rootState }, dp) {
      // console.log('[DRAFTPICK-ACTION] - saveDraftPick()')
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/draftPicks/${dp._id}`, { data: dp })
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
