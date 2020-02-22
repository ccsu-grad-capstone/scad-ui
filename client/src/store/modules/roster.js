// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
import teamDetails from '../../data/teamDetails'

export default {
  namespaced: true,
  state: {
    team: teamDetails.fantasy_content.team[0],
    roster: teamDetails.fantasy_content.team[1].roster
  },
  getters: {

  },

  mutations: {

  },
  actions: {

  }
}
