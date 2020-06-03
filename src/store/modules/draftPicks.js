/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import leagueStandings from '../../data/leagueStandings'
import { node } from '../../utilities/axios-node'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'
import referenceData from '../../utilities/referenceData'

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
    async getDraftPicksByLeague ({ commit, state, rootState }, { yahooLeagueId, year }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByLeague()')
      try {
        const response = await node.get(`/draftPicks/${yahooLeagueId}/${year}`)
        console.log('DRAFTPICKS-league', response.data)
        commit('updateDraftPicks', { dp: response.data.data })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getDraftPicksByTeam ({ commit, state, rootState }, { teamId, year }) {
      // console.log('[DRAFTPICK-ACTION] - getDraftPicksByTeam()')
      try {
        const response = await node.get(`/draftPicks/${rootState.league.yahooLeagueId}/${year}/${teamId}`)
        console.log('DRAFTPICKS-team', response.data)
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
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async updateMongoWithDraftPicks ({ rootState, dispatch }) {
      console.log('updateMongoWithDraftPicks', referenceData.draftPickYears(rootState.league.scadSettings.seasonYear))
      let yahooLeagueId = rootState.league.yahooLeagueId
      let year = rootState.league.scadSettings.seasonYear
      try {
        // Check to confirm no draft picks exists for this league already
        let response = await node.get(`/draftpicks/check/${yahooLeagueId}/${year}`)
        if (response.status === 200) {
          console.log('Draft Picks Exists, dont add')
        } else {
          console.log('Draft Picks Dont Exist, lets add / update')

          let renewId = rootState.league.yahooLeagueDetails.renew.split('_')
          let renewResponse = await node.get(`/draftpicks/check/${renewId[1]}/${year - 1}`)
          console.log('renewResponse: ', renewResponse)

          // Check renew league ID to see if SCAD has previous leagues draft picks, if so, update draft picks.
          if (renewResponse.status === 200) {
            console.log('******************')
            let update = {
              oldId: renewId[1],
              newId: yahooLeagueId,
              year: year
            }
            let updateResponse = await node.put(`/draftPicks/updateLeague`, { data: update })
            console.log(updateResponse)
          } else {
            // renew league ID wasn't previous in system, create new set of draftpicks
            referenceData.draftPickYears(year).forEach(y => {
              referenceData.draftPickRounds(rootState.league.scadSettings.rookieDraftRds).forEach(r => {
                rootState.league.yahooTeams.forEach(async t => {
                  let draftPick = {
                    yahooLeagueId: yahooLeagueId,
                    yahooLeagueYear: year,
                    year: y,
                    rd: r,
                    pick: undefined,
                    salary: undefined,
                    playerId: undefined,
                    team: t,
                    originalTeam: t,
                    comments: '',
                    prevLeagueIds: [],
                    log: []
                  }
                  await node.post('/draftPicks/create', { data: draftPick })
                })
              })
            })
          }

          await dispatch('getDraftPicksByLeague', { yahooLeagueId: rootState.league.yahooLeagueId, year: rootState.league.scadSettings.seasonYear })
          console.log('COMPLETE')
        }
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
