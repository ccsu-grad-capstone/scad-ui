// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axiosScad'
// import teamDetails from '../../data/teamDetails'

export default {
  namespaced: true,
  state: {
    info: '',
    roster: ''
    // info: teamDetails.fantasy_content.team[0],
    // roster: teamDetails.fantasy_content.team[1].roster
  },
  getters: {

  },

  mutations: {
    updateTeam (state, newTeam) {
      console.log(`[TEAM-MUTATION] - updateTeam(${newTeam})`)
      state.team.info = {}
      state.team.roster = {}
    },
    logoutTeam (state) {
      console.log('[TEAM-MUTATION] - logoutTeam()')
      state.info = ''
      state.roster = ''
    }
  },
  actions: {
    async getTeam ({ commit, rootState }, teamKey) {
      console.log(`[ROSTER-ACTION] - getTeam(${teamKey})`)
      try {
        // const res = await scad(
        //   rootState.user.tokens.access_token,
        //   rootState.user.tokens.id_token)
        //   .get(`/league/${rootState.league.leagueID}/team/${teamKey}/roster`)
        // console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
