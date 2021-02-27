/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
// import { nodeHeader } from '../../utilities/axios-node'
// import leagueStandings from '../../data/leagueStandings'
import { node } from '../../utilities/axios-node'
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
    async getCapExemptionsByLeague ({ commit, state, rootState }) {
      // console.log('[CAPEXEMPTIONS-ACTION] - getCapExemptionsByLeague()')
      try {
        const response = await node.get(`/capExemptions/${rootState.league.scadLeagueId}`)
        console.log('CAP-EXEMPTIONS-league', response.data.data)
        commit('updateCapExemptions', { ce: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getCapExemptionsByTeam ({ commit, state, rootState }, { teamId }) {
      // console.log('[CAPEXEMPTIONS-ACTION] - getCapExemptionsByTeam()')
      try {
        const response = await node.get(`/capExemptions/${rootState.league.scadLeagueId}/${teamId}`)
        console.log('CAP-EXEMPTIONS-team', response.data.data)
        commit('updateCapExemptionsTeam', { ce: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async addCapExemption ({ dispatch, rootState }, ce) {
      // console.log('[CAPEXEMPTIONS-ACTION] - addCapExemption()')
      try {
        ce.addedBy = `${rootState.user.user.given_name} ${rootState.user.user.familyName}`
        const response = await node.post(`/capExemptions/create`, { data: ce })
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async saveCapExemption ({ dispatch }, ce) {
      // console.log('[CAPEXEMPTIONS-ACTION] - saveCapExemption()')
      try {
        const response = await node.put(`/capExemptions/${ce._id}`, { data: ce })
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async removeCapExemption ({ dispatch, rootState }, id) {
      // console.log('[CAPEXEMPTIONS-ACTION] - saveCapExemption()')
      try {
        const response = await node.delete(`/capExemptions/remove/${id}`)
        notify.saveSuccessful(response.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
    // async updateMongoWithCE ({ rootState, state, dispatch }) {
    //   console.log('updateMongoWithCE', referenceData.draftPickYears(rootState.league.scadSettings.seasonYear))
    //   let yahooLeagueId = rootState.league.yahooLeagueId
    //   let year = rootState.league.scadSettings.seasonYear
    //   try {
    //     // Check to confirm Cap Exemptions exists for this league already
    //     let response = await node.get(`/capExemptions/check/${rootState.league.scadLeagueID}`)

    //     if (response.status === 200) {
    //       console.log('Cap Exemptions Exists, dont add')
    //     } else {
    //       console.log('Cap Exemptions Dont Exist, lets update')

    //       let renewId = rootState.league.yahooLeagueDetails.renew.split('_')
    //       let renewResponse = await node.get(`/capExemptions/check/${renewId[1]}/${year - 1}`)
    //       console.log('renewResponse: ', renewResponse)

    //       // Check renew league ID to see if SCAD has previous leagues Cap Exemptions, if so, update Cap Exemptions.
    //       if (renewResponse.status === 200) {
    //         let update = {
    //           oldId: renewId[1],
    //           newId: yahooLeagueId,
    //           year: year
    //         }
    //         let updateResponse = await node.put(`/capExemptions/updateLeague`, { data: update })
    //         console.log(updateResponse)
    //       } else {
    //         console.log('No previous league')
    //       }

    //       await dispatch('getCapExemptionsByLeague')
    //       console.log('COMPLETE')
    //     }
    //   } catch (error) {
    //     catchAxiosNodeError(error)
    //   }
    // }
  }
}
