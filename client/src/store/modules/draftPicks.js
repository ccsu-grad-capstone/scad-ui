// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import leagueStandings from '../../data/leagueStandings'
import draftPicks from '../../data/draftPicks'

export default {
  namespaced: true,
  state: {
    teams: draftPicks.draftPicks.teams
  },
  getters: {

  },

  mutations: {
  },
  actions: {
  }
}
