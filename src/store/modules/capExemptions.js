/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    capExemptions: [],
    capExemptionsByTeam: []
  },
  getters: {

  },

  mutations: {
    updateCapExemptions (state, { ce }) {
      // console.log('[CAPEXEMPTIONS-MUTATION] - updateCapExemptions()')

      state.capExemptions = ce
    },
    updateCapExemptionsTeam (state, { ce }) {
      // console.log('[CAPEXEMPTIONS-MUTATION] - updateCapExemptionsTeam()')

      state.capExemptionsByTeam = ce
    }
  },

  actions: {
    async getCapExemptionsByLeague ({ commit, rootState }) {
      // console.log('[CAPEXEMPTIONS-ACTION] - getCapExemptionsByLeague()')
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/capExemptions/${rootState.league.scadLeagueId}/${rootState.league.scadSettings.seasonYear}`)
        console.log('CAP-EXEMPTIONS-league', response.data.data)
        commit('updateCapExemptions', { ce: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getCapExemptionsByTeam ({ commit, rootState }, { guid }) {
      // console.log('[CAPEXEMPTIONS-ACTION] - getCapExemptionsByTeam()', guid)
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/capExemptions/${rootState.league.scadLeagueId}/${rootState.league.scadSettings.seasonYear}/${guid}`)
        console.log('CAP-EXEMPTIONS-team', response.data.data)
        commit('updateCapExemptionsTeam', { ce: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async addCapExemption ({ rootState }, ce) {
      // console.log('[CAPEXEMPTIONS-ACTION] - addCapExemption()')
      try {
        ce.addedBy = `${rootState.user.user.given_name} ${rootState.user.user.family_name}`
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).post(`/capExemptions/create`, { data: ce })
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async saveCapExemption ({ rootState }, ce) {
      // console.log('[CAPEXEMPTIONS-ACTION] - saveCapExemption()')
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/capExemptions/${ce._id}`, { data: ce })
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async removeCapExemption ({ rootState }, id) {
      // console.log('[CAPEXEMPTIONS-ACTION] - saveCapExemption()')
      try {
        const response = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).delete(`/capExemptions/remove/${id}`)
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
