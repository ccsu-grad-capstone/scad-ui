// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import teamDetails from '../../data/teamDetails'

export default {
  namespaced: true,
  state: {
    team: {
      info: teamDetails.fantasy_content.team[0],
      roster: teamDetails.fantasy_content.team[1].roster
    }
  },
  getters: {

  },

  mutations: {
    updateTeam (state, newTeam) {
      console.log(`[ROSTER-MUTATION] - updateTeam(${newTeam})`)
      state.team.info = {}
      state.team.roster = {}
    }
  },
  actions: {
    getTeam ({ commit }, teamKey) {
      console.log(`[ROSTER-ACTION] - getTeam(${teamKey})`)
      scad.get(`team/${teamKey}`)
        .then((res) => {
          commit('updateTeam', res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
