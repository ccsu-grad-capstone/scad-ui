// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
// import leagueSettings from '../../data/leagueSettings'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    isActive: true,
    key: '',
    yahooLeagueID: '22351',
    scadLeagueID: '',
    yahooLeague: {},
    yahooSettings: {},
    scadSettings: {},
    teams: [],
    standings: [],
    scadLeagues: [],
    yahooLeagues: [] // to remove this when we have scad leagues we're allowed to register
  },
  mutations: {
    dashboard (state, dashboard) {
      console.log('[LEAGUE-MUTATION] - dashboard()')
      if (dashboard.key === 'league') {
        state.isActive = true
      }
      state.key = dashboard.key
      state.yahooLeagueID = dashboard.YahooLeague.league_id
      state.scadLeagueID = dashboard.SCADLeague.id
      state.yahooLeague = dashboard.YahooLeague
      // state.yahooSettings = dashboard.???????
      state.scadSettings = dashboard.SCADLeague
      // state.standings = dashboard.???????
      // commit('team/updateTeam', dashboard.????????, { root: true })
    },
    updateYahooLeague (state, league) {
      console.log('[LEAGUE-MUTATION] - updateYahooLeague()')
      state.yahooLeague = league
      state.yahooLeagueID = league.league_id
    },
    updateYahooSettings (state, settings) {
      console.log('[LEAGUE-MUTATION] - updateYahooSettings()')
      state.yahooSettings = settings
    },
    updateScadSettings (state, settings) {
      console.log('[LEAGUE-MUTATION] - updateScadSettings()')
      state.scadSettings = settings
      state.scadLeagueID = settings.id
    },
    updateTeams (state, teams) {
      console.log('[LEAGUE-MUTATION] - updateTeams()')
      state.teams = teams
    },
    updateStandings (state, standings) {
      console.log('[LEAGUE-MUTATION] - updateStandings()')
      state.standings = standings
    },
    updateScadLeagues (state, leagues) {
      console.log('[LEAGUE-MUTATION] - updateStandings()')
      state.scadLeagues = leagues
    },
    // to remove this when we have scad leagues we're allowed to register
    updateYahooLeagues (state, leagues) {
      console.log('[LEAGUE-MUTATION] - updateYahooLeagues()')
      state.yahooLeagues = leagues
    },
    leagueIsActiveToggle (state) {
      state.isActive = !state.isActive
    },
    logoutLeague (state) {
      console.log('[LEAGUE-MUTATION] - logoutLeague()')
      state.isActive = false
      state.key = ''
      state.yahooLeagueID = ''
      state.scadLeagueID = ''
      state.yahooLeague = {}
      state.yahooSettings = {}
      state.scadSettings = {}
      state.teams = []
      state.standings = []
      state.scadLeagues = []
    }
  },
  getters: {
    // Return team names for Yahoo Leagues to display when Registering League
    getLeagues (state) {
      console.log('[LEAGUE-GETTERS] - getLeagues()')
      let teams = []
      state.yahooLeagues.forEach(league => {
        let name = league.name
        teams.push(name)
      })
      return teams
    },
    getTeams (state) {
      console.log('[LEAGUE-GETTERS] - getTeams()')
      let teams = []
      state.teams.forEach(team => {
        let name = team.name
        teams.push(name)
      })
      return teams
    },
    getTeamID: (state) => (teamName) => {
      console.log('[LEAGUE-GETTERS] - getTeamID(): ')
      const team = state.teams.find(team => (team.name === teamName))
      return team.team_id
    },
    yahooLeagueId: (state) => (teamName) => {
      console.log('[LEAGUE-GETTERS] - yahooLeagueId(): ', teamName)
      const league = state.yahooLeagues.find(league => (league.name === teamName))
      return league.league_id
    },
    yahooLeagueManagers: (state) => (teamName) => {
      console.log('[LEAGUE-GETTERS] - yahooLeagueManagers(): ', teamName)
      const league = state.yahooLeagues.find(league => (league.name === teamName))
      return league.num_teams
    }
  },

  actions: {
    async registerLeague ({ rootState, commit, state }, { league }) {
      console.log('[LEAGUE-ACTION] - registerLeague()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .post('scadleague', league)
        console.log('POST response scadleague: ', res)
        // commit('updateLeague', { league: league })
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    // emailLeagueMembers (state) {
    //   console.log('[LEAGUE-ACTION] - emailLeagueMembers()')
    //   scad.post()
    // },

    async getScadSettings ({ rootState, state, commit }) {
      console.log('[LEAGUE-ACTION] - getScadSettings()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scadleague/1`)
          // .get(`/scadleague/default`)
        console.log('settings: ', res)
        commit('updateScadSettings', res.data)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getAllYahooLeagues ({ rootState, commit }) {
      console.log('[LEAGUE-ACTION] - getAllYahooLeagues()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/league/all`)
        // console.log('leagues: ', res)
        commit('updateYahooLeagues', res.data.leagues)
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
