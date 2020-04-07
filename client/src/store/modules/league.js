// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
// import leagueSettings from '../../data/leagueSettings'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    isActive: false,
    key: '',

    yahooLeagueID: '22351',
    scadLeagueID: '1',

    yahooLeagueDetails: {},
    yahooSettings: {},
    scadSettings: {},

    yahooTeams: [],
    scadTeams: [],

    yahooLeagues: [],
    scadLeagues: [],
    yahooCommishLeagues: []
  },
  mutations: {
    key (state, key) {
      // console.log('[LEAGUE-MUTATION] - key()')
      state.key = key
    },
    dashboardRegister (state, dashboard) {
      // console.log('[LEAGUE-MUTATION] - dashboardRegister()')
      // state.isActive = false
      state.key = dashboard.key
      state.yahooCommishLeagues = dashboard.YahooLeagues
    },
    updateYahooLeagueDetails (state, league) {
      // console.log('[LEAGUE-MUTATION] - updateYahooLeagueDetails()')
      state.yahooLeagueDetails = league
      state.yahooLeagueID = league.league_id
    },
    updateYahooSettings (state, settings) {
      // console.log('[LEAGUE-MUTATION] - updateYahooSettings()')
      state.yahooSettings = settings
    },
    updateScadSettings (state, settings) {
      // console.log('[LEAGUE-MUTATION] - updateScadSettings()')
      state.isActive = true
      state.scadSettings = settings
      state.scadLeagueID = settings.id
    },
    updateYahooTeams (state, teams) {
      // console.log('[TEAM-MUTATION] - updateYahooTeams()')
      state.yahooTeams = teams
    },
    updateScadTeams (state, teams) {
      // console.log('[TEAM-MUTATION] - updateScadTeams()')
      state.scadTeams = teams
    },
    updateYahooLeagues (state, leagues) {
      // console.log('[LEAGUE-MUTATION] - updateYahooLeagues()')
      state.yahooLeagues = leagues
    },
    updateScadLeagues (state, leagues) {
      // console.log('[LEAGUE-MUTATION] - updateStandings()')
      state.scadLeagues = leagues
    },
    updateYahooCommishLeagues (state, leagues) {
      // console.log('[LEAGUE-MUTATION] - updateYahooCommishLeagues()')
      state.yahooCommishLeagues = leagues
    },
    leagueIsActiveToggle (state) {
      state.isActive = !state.isActive
    },
    logoutLeague (state) {
      console.log('[LEAGUE-MUTATION] - logoutLeague()')
      // state.isActive = false
      // state.key = ''
      // state.yahooLeagueID = ''
      // state.scadLeagueID = ''
      // state.yahooLeague = {}
      // state.yahooSettings = {}
      // state.scadSettings = {}
      // state.teams = []
      // state.standings = []
      // state.scadLeagues = []
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
    // Calls whenever the page reloads.. Fills store with initial information needed to fill dashboard
    async getScadInfo ({ dispatch, state, rootState }) {
      console.log('[LEAGUE-ACTION] - getScadInfo()')
      try {
        await dispatch('dashboard')
        dispatch('getYahooTeams', state.yahooLeagueID)
        dispatch('getScadTeams', 2)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async dashboard ({ state, commit, rootState }) {
      // console.log('[LEAGUE-ACTION] - dashboard()')
      try {
        const dashboard = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/dashboard/details`)
        console.log('DASHBOARD: ', dashboard.data)

        if (dashboard.data.key === 'League') {
          let yahooTeam = dashboard.data.yahooMyTeam
          yahooTeam.players = dashboard.data.yahooMyPlayers
          let scadTeam = dashboard.data.scadMyTeam
          scadTeam.players = dashboard.data.scadMyPlayers.scadLeaguePlayers
          commit('key', dashboard.data.key)
          commit('updateYahooLeagueDetails', dashboard.data.yahooLeague)
          commit('updateScadSettings', dashboard.data.scadLeague)
          commit('team/updateYahooTeam', yahooTeam, { root: true })
          commit('team/updateScadTeam', scadTeam, { root: true })
          let id = {
            myYahooTeamID: dashboard.data.yahooMyTeam.team_id,
            myScadTeamID: dashboard.data.scadMyTeam.id
          }
          commit('team/updateMyTeamIDs', id, { root: true })
        } else {
          commit('dashboardRegister', dashboard.data)
        }
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getYahooCommishLeagues ({ rootState, commit, dispatch }) {
      // console.log('[LEAGUE-ACTION] - getCommishLeagues()')
      try {
        const commish = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/commissioner/all`)
        console.log('COMMISH: ', commish)
        commit('updateYahooCommishLeagues', commish.data.commissionerLeagues)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getYahooSettings ({ rootState, state, commit }, leagueID) {
      // console.log('[LEAGUE-ACTION] - getYahooSettings()')
      try {
        const settings = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${leagueID}/settings`)
        console.log('SETTINGS: ', settings)
        commit('updateYahooSettings', settings.data.settings[0])
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getScadSettings ({ rootState, state, commit }, id) {
      console.log('[LEAGUE-ACTION] - getScadSettings()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${id}`)
          // .get(`/scadleague/default`)
        console.log('settings: ', res)
        commit('updateScadSettings', res.data)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getYahooTeams ({ rootState, state, commit }, leagueId) {
      // console.log('[LEAGUE-ACTION] - getYahooTeams()')
      try {
        const standings = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${leagueId}/standings`)
        console.log('YAHOO-TEAMS: ', standings.data.standings)
        commit('updateYahooTeams', standings.data.standings)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getScadTeams ({ rootState, commit }, id) {
      // console.log('[TEAM-ACTION] - getScadTeams()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${id}/team/all`)
        console.log('SCAD-TEAMS: ', res.data.scadLeagueTeams)
        commit('updateScadTeams', res.data.scadLeagueTeams)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getAllYahooLeagues ({ rootState, commit }) {
      // console.log('[LEAGUE-ACTION] - getAllYahooLeagues()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/all`)
        console.log('leagues: ', res)
        commit('updateYahooLeagues', res.data.leagues)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    // async getAllScadLeagues ({ rootState, commit }) {
    //   console.log('[LEAGUE-ACTION] - getAllScadLeagues()')
    //   try {
    //     const scadleagues = await scad(
    //       rootState.tokens.access_token,
    //       rootState.tokens.id_token)
    //       .get(`/scad/league/all`)
    //     console.log('SCADLEAGUES: ', scadleagues)
    //     commit('updateScadLeagues', scadleagues.data.scadLeagues)
    //   } catch (err) {
    //     catchAxiosScadError(err)
    //   }
    // },

    async switchLeagues ({ rootState, commit }, league) {
      // console.log('[LEAGUE-ACTION] - switchLeagues()')
      commit('updateScadSettings', league)
      try {
        // const res = await scad(
        //   rootState.user.tokens.access_token,
        //   rootState.user.tokens.id_token)
        //   .get(`/league/all`)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async registerLeague ({ rootState, commit, state }, { league }) {
      // console.log('[LEAGUE-ACTION] - registerLeague()')
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .post('scad/league', league)
        console.log('POST response scadleague: ', res)
        // commit('updateLeague', { league: league })
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
