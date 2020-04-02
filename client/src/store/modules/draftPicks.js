/* eslint-disable eqeqeq */
// import { notify } from '../../utilities/nofity'
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
      state.draftPicks = dp
    }
  },

  actions: {
    async getDraftPicksByLeague ({ commit, state, rootState }, leagueID) {
      try {
        const response = await server.get(`/draftPicks/${leagueID}`)
        var draftPicks = response.data.data
        var teams = rootState.league.teams
        draftPicks.forEach(dp => {
          let team = teams.find(t => t.team_id == dp.ownerID)
          let original = teams.find(t => t.team_id == dp.originalOwnerID)
          dp.teamName = team.name
          dp.originalTeamName = original.name
        })
        commit('updateDraftPicks', { dp: draftPicks })
      } catch (error) {
        catchAxiosScadError(error)
      }
    }
  }
}
