/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import leagueStandings from '../../data/leagueStandings'
import { node } from '../../utilities/axios-node'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    capExemptions: [],
    capExemptionsTeam: []
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

      state.capExemptionsTeam = ce
    }
  },

  actions: {
    async getCapExemptionsByLeague ({ commit, state, rootState }, leagueId) {
      // console.log('[CAPEXEMPTIONS-ACTION] - getCapExemptionsByLeague()')
      try {
        const response = await node.get(`/capExemptions/${leagueId}`)
        console.log('CAP-EXEMPTIONS-league', response.data.data)
        commit('updateCapExemptions', { ce: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getCapExemptionsByTeam ({ commit, state, rootState }, teamId) {
      // console.log('[CAPEXEMPTIONS-ACTION] - getCapExemptionsByTeam()')
      try {
        const response = await node.get(`/capExemptions/${rootState.league.yahooLeagueId}/team/${teamId}`)
        console.log('CAP-EXEMPTIONS-team', response.data.data)
        commit('updateCapExemptionsTeam', { ce: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async addCapExemption ({ dispatch }, ce) {
      // console.log('[CAPEXEMPTIONS-ACTION] - addCapExemption()')
      try {
        const response = await node.post(`/capExemptions/create`, { data: ce })
        notify.saveSuccessful(response.data)
        await dispatch('getCapExemptionsByLeague', ce.yahooLeagueId)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async saveCapExemption ({ dispatch }, ce) {
      // console.log('[CAPEXEMPTIONS-ACTION] - saveCapExemption()')
      try {
        const response = await node.put(`/capExemptions/${ce._id}`, { data: ce })
        notify.saveSuccessful(response.data)
        await dispatch('getCapExemptionsByLeague', ce.yahooLeagueId)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async removeCapExemption ({ dispatch, rootState }, id) {
      // console.log('[CAPEXEMPTIONS-ACTION] - saveCapExemption()')
      try {
        const response = await node.delete(`/capExemptions/remove/${id}`)
        notify.saveSuccessful(response.data)
        await dispatch('getCapExemptionsByLeague', rootState.league.yahooLeagueId)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
