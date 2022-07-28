/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
import { catchAxiosError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    draftPicks: [],
    draftPicksByTeam: [],
    getDraftPicksByLeagueError: true,
    getDraftPicksByTeamError: false
  },
  getters: {

  },

  mutations: {
    updateDraftPicks (state, { dp }) {
      // console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')
      state.draftPicks = dp
      state.getDraftPicksByLeagueError = false
    },
    updateDraftPicksByTeam (state, { dp }) {
      // console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')
      state.draftPicksByTeam = dp
      state.getDraftPicksByTeamError = false
    },
    getDraftPicksByLeagueError (state) {
      // console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')
      state.draftPicks = []
      state.getDraftPicksByLeagueError = true
    },
    getDraftPicksByTeamError (state) {
      // console.log('[DRAFTPICK-MUTATION] - updateDraftPicks()')
      state.draftPicksByTeam = []
      state.getDraftPicksByTeamError = true
    },
    resetDraftPicks (state) {
      state.draftPicks = []
      state.draftPicksByTeam = []
      state.getDraftPicksByLeagueError = true
      state.getDraftPicksByTeamError = false
    }
  },

  actions: {
    async getDraftPicksByLeague ({ commit, state, rootState }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByLeague()')
      let limit = rootState.league.scadSettings.rookieDraftRds * rootState.league.yahooLeagueDetails.num_teams * rootState.league.scadSettings.tradingDraftPickYears
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/draftPicks/${rootState.league.scadLeagueId}/${rootState.league.scadSettings.seasonYear}/${limit}`)
        console.log('DRAFTPICKS-league', response.data)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        commit('getDraftPicksByLeagueError')
        catchAxiosError(error)
      }
    },
    async getDraftPicksByTeam ({ commit, state, rootState }, { guid }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByTeam()', guid)
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/draftPicks/${rootState.league.scadLeagueId}/${rootState.league.scadSettings.seasonYear}/${guid}`)
        console.log('DRAFTPICKS-team', response.data)
        commit('updateDraftPicksByTeam', { dp: response.data.data })
      } catch (error) {
        commit('getDraftPicksByTeamError')
        catchAxiosError(error)
      }
    },
    async saveDraftPick ({ dispatch, rootState }, dp) {
      // console.log('[DRAFTPICK-ACTION] - saveDraftPick()')
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/draftPicks/${dp._id}`, { data: dp })
        notify.saveSuccessful(response.data)
        dispatch('getDraftPicksByLeague')
      } catch (error) {
        catchAxiosError(error)
      }
    }
  }
}
