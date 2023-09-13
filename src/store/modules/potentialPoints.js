/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
// import moment from 'moment'
import { catchAxiosError } from '../../utilities/catchAxiosErrors'
// import { calcTeamSalary, getPosCount } from '../../utilities/calculator'
// import { checkIRCount, checkCovidCount } from '../../utilities/validators'
// import { getTeamGuid } from '../../utilities/functions'

export default {
  namespaced: true,
  state: {
    values: []
  },
  getters: {

  },

  mutations: {
    updateValues (state, values) {
      // console.log('[LEAGUE-MUTATION] - key()')
      state.values = values.data
    }
  },
  actions: {
    async getPotentialPoints ({ rootState, commit }) {
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token,
          rootState.user.tokens.refresh_token).get(`/potentialPoints/${rootState.league.scadLeagueId}`)
        console.log('POTENTIAL POINTS', res.data)
        commit('updateValues', res.data)
      } catch (error) {
        catchAxiosError(error)
      }
    },
    async runPotentialPoints ({ rootState, state, commit, dispatch }, week) {
      try {
        const params = {
          scadLeagueId: rootState.league.scadLeagueId,
          week: week
        }
        const process = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).post(`/potentialPoints/run`, { data: params })
        console.log('RUN Potential Points: ', process.data)
        notify.success(`Potential Points ran successfully`)
      } catch (error) {
        console.log(error.response)
        notify.warning('Potential Points run failed to complete.')
      }
    }
  }
}
