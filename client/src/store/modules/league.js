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
    },
    updateYahooLeagues (state, leagues) {
      console.log('[LEAGUE-MUTATION] - updateYahooLeagues()')
      state.yahooLeagues = leagues
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

    async getAllYahooLeagues ({ rootState, commit }) {
      console.log('[LEAGUE-ACTION] - getAllYahooLeagues()')
      console.log('rootState: ', rootState.user.tokens.access_token)
      const options = {
        headers: {
          'access_token': `${rootState.user.tokens.access_token}`,
          'id_token': `${rootState.user.tokens.id_token}`,
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic c2NhZC1hcGktcmVhZHdyaXRlOnNjYWQtYXBpLXJlYWR3cml0ZQ==' }
      }
      await scad.get(`/league/all`, options)
        .then((res) => {
          console.log('leagues/get response: ', res.data.leagues)
          commit('updateYahooLeagues', res.data.leagues)
        })
        .catch(err => {
          console.log(err)
        })
      // commit('league/updateLeague', leagueStandings.fantasy_content.league)
    }
  }
}
