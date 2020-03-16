// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
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
    // Return team names for Yahoo Leagues to display when Registering League
    getTeams (state) {
      console.log('[LEAGUE-GETTERS] - getTeams()')
      let teams = []
      state.yahooLeagues.forEach(league => {
        let name = league.name
        teams.push(name)
      })
      return teams
    },
    yahooLeagueId: (state) => (teamName) => {
      console.log('[LEAGUE-GETTERS] - yahooLeagueId(): ', teamName)
      const league = state.yahooLeagues.find(league => (league.name === teamName))
      return league.league_id
    },
    yahooLeagueManagers: (state) => (teamName) => {
      console.log('[LEAGUE-GETTERS] - yahooLeagueId(): ', teamName)
      const league = state.yahooLeagues.find(league => (league.name === teamName))
      return league.num_teams
    }
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
    registerLeague ({ rootState, commit, state }, { league }) {
      console.log('[LEAGUE-ACTION] - registerLeague()', league)
      const options = {
        headers: {
          'access_token': `${rootState.user.tokens.access_token}`,
          'id_token': `${rootState.user.tokens.id_token}`,
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic c2NhZC1hcGktcmVhZHdyaXRlOnNjYWQtYXBpLXJlYWR3cml0ZQ==' }
      }
      try {
        const res = scad.post('scadleague', league, options)
        console.log('POST response scadleague: ', res)
        // commit('updateLeague', { league: league })
      } catch (err) {
        console.log(err)
      }
    },

    emailLeagueMembers (state) {
      console.log('[LEAGUE-ACTION] - emailLeagueMembers()')
      scad.post()
    },

    async getAllYahooLeagues ({ rootState, commit }) {
      console.log('[LEAGUE-ACTION] - getAllYahooLeagues()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/league/all`)
        commit('updateYahooLeagues', res.data.leagues)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
