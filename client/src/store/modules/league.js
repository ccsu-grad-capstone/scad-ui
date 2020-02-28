// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import leagueStandings from '../../data/leagueStandings'
import leagueSettings from '../../data/leagueSettings'

export default {
  namespaced: true,
  state: {
    league: leagueStandings.fantasy_content.league,
    settings: leagueSettings.fantasy_content.league.settings,
    yahooLeagues: [],
    scadLeagues: []
  },
  getters: {

  },

  mutations: {
    updateLeague (state, league) {
      console.log('[LEAGUE-MUTATION] - updateLeague()')
      state.league = league
    }
  },
  actions: {
    registerLeague ({ commit, state }, { league }) {
      console.log('[LEAGUE-ACTION] - registerLeague()')
      scad.post()
      commit('updateLeague', { league: league })
    },
    emailLeagueMembers (state) {
      console.log('[LEAGUE-ACTION] - emailLeagueMembers()')
      scad.post()
    },
    async getLeague (commit) {
      console.log('[LEAGUE-ACTION] - emailLeagueMembers()')
      // await scad.get(`/league:${league_id}`) // get league by leagueID?
      //   .then((res) => {
      //     commit('league/updateLeague', res.data)
      //   })
      //   .catch(err => {
      //     console.error(JSON.stringify(err))
      //   })
      commit('league/updateLeague', leagueStandings.fantasy_content.league)
    }
  }
}
