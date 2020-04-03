// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    myYahooTeamID: '2',
    info: {},
    roster: []
  },
  getters: {

  },

  mutations: {
    updateTeam (state, data) {
      // console.log(`[TEAM-MUTATION] - updateTeam(${newTeam})`)
      state.team.info = data.info
      state.team.roster = data.roster
    },
    logoutTeam (state) {
      // console.log('[TEAM-MUTATION] - logoutTeam()')
      state.info = ''
      state.roster = ''
    },
    updateTeamRoster (state, roster) {
      // console.log('[TEAM-MUTATION] - updateTeamRoster()')
      state.roster = roster
    }
  },
  actions: {
    async getTeam ({ commit, rootState }, yahooTeamID) {
      console.log(`[ROSTER-ACTION] - getTeam(${yahooTeamID})`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/league/${rootState.league.yahooLeagueID}/team/${yahooTeamID}/roster`)
        console.log('TEAM: ', res.data.roster.players)
        commit('updateTeamRoster', res.data.roster.players)
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
