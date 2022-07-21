/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
// import leagueSettings from '../../data/leagueSettings'
import { catchAxiosError } from '../../utilities/catchAxiosErrors'
import { calcTeamSalary } from '../../utilities/calculator'
import { getGameKey, getTeamGuid } from '../../utilities/functions'

export default {
  namespaced: true,
  state: {
    isActive: false,
    key: '',

    yahooGameKey: '',
    yahooLeagueId: '',
    scadLeagueId: '',
    renewedAvailable: false,

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
      state.yahooCommishLeagues = dashboard.yahooCommishLeagues
    },
    updateRenewedAvailable (state, renew) {
      // console.log('[LEAGUE-MUTATION] - updateRenewedAvailable()', renew)
      state.renewedAvailable = renew
    },
    updateYahooLeagueDetails (state, league) {
      // console.log('[LEAGUE-MUTATION] - updateYahooLeagueDetails()')
      state.yahooGameKey = getGameKey(league.league_key)
      state.yahooLeagueDetails = league
      state.yahooLeagueId = league.league_id
    },
    updateYahooSettings (state, settings) {
      // console.log('[LEAGUE-MUTATION] - updateYahooSettings()')
      state.yahooSettings = settings
    },
    updateScadSettings (state, settings) {
      // console.log('[LEAGUE-MUTATION] - updateScadSettings()')
      state.isActive = true
      state.scadSettings = settings
      state.scadLeagueId = settings._id
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
      // state.yahooLeagueId = ''
      // state.scadLeagueId = ''
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
    getTeamId: (state) => (teamName) => {
      console.log('[LEAGUE-GETTERS] - getTeamId(): ')
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
    async dashboard ({ state, commit, rootState, dispatch }) {
      // console.log('[LEAGUE-ACTION] - dashboard()')
      try {
        const dashboard = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/dashboard/details`)
        console.log('DASHBOARD: ', dashboard.data.result)

        if (dashboard.data.result.key === 'League') {
          let scadTeam = dashboard.data.result.scadMyTeam
          scadTeam.roster = dashboard.data.result.scadMyPlayers
          commit('key', dashboard.data.result.key)
          commit('updateRenewedAvailable', dashboard.data.result.renewedAvailable)
          commit('updateYahooLeagueDetails', dashboard.data.result.yahooLeague)
          commit('updateScadSettings', dashboard.data.result.scadLeague)
          commit('team/updateMyYahooTeam', dashboard.data.result.yahooMyTeam, { root: true })
          commit('team/updateMyScadTeam', scadTeam, { root: true })
          commit('user/setDefaultLeague', dashboard.data.result.udl, { root: true })
          // Move these calls to Layout.vue?
          dispatch('draftPicks/getDraftPicksByLeague', null, { root: true })
          dispatch('capExemptions/getCapExemptionsByLeague', null, { root: true })
          await dispatch('transactions/getTransactions', null, { root: true })
          await dispatch('getYahooTeams', state.yahooLeagueId)
          await dispatch('getScadTeams', state.scadLeagueId)
          dispatch('getAllYahooCommishLeagues')
          // await dispatch('transactions/getTransactions', null, { root: true })
          // await dispatch('player/getFranchiseTaggedPlayers', null, { root: true })
          // dispatch('diagnostics/getDiagnostic', null, { root: true })
          // dispatch('getAllYahooLeagues')
          // dispatch('getAllScadLeagues')
          let myYahooTeam = state.yahooTeams.find(t => getTeamGuid(t) === rootState.user.user.guid) // needed for when getting previous team preseason
          let id = {
            myYahooTeamId: myYahooTeam.team_id,
            myScadTeamId: dashboard.data.result.scadMyTeam._id
          }
          commit('team/updateMyTeamIds', id, { root: true })
        } else {
          // notify.dashboardRegister()
          commit('dashboardRegister', dashboard.data.result)
        }
      } catch (err) {
        catchAxiosError(err)
        throw err
      }
    },

    async switchLeagues ({ rootState, state, dispatch, commit }, yahooLeagueId) {
      // console.log('[LEAGUE-ACTION] - switchLeagues()')
      try {
        await dispatch('getYahooLeagueDetails', yahooLeagueId)
        await dispatch('getScadSettingsByYahooId', yahooLeagueId)
        await dispatch('team/getMyScadTeam', null, { root: true })
        await dispatch('team/getMyYahooTeam', null, { root: true })
        await dispatch('getYahooTeams', yahooLeagueId)
        await dispatch('getScadTeams', state.scadLeagueId)
        await dispatch('transactions/getTransactions', null, { root: true })
        let id = {
          myYahooTeamId: rootState.team.myYahooTeam.team_id,
          myScadTeamId: rootState.team.myScadTeam._id
        }
        commit('team/updateMyTeamIds', id, { root: true })
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async updateTeamSalaries ({ rootState, state, commit, dispatch }) {
      for (var yt of state.yahooTeams) {
        let st = state.scadTeams.find(st => st.yahooTeamId == yt.team_id)
        await dispatch('team/getTeam', { yahooLeagueId: state.yahooLeagueId, yahooTeamId: yt.team_id }, { root: true })
        await dispatch('capExemptions/getCapExemptionsByTeam', { teamId: yt.team_id }, { root: true })
        st.salary = calcTeamSalary(
          rootState.team.yahooTeam.roster,
          rootState.team.scadTeam.roster,
          rootState.capExemptions.capExemptionsByTeam,
          state.scadSettings.franchiseTagDiscount,
          state.scadSettings.irReliefPerc,
          rootState.team.yahooTeam,
          state.scadSettings.seasonYear
        )
        await dispatch('team/saveTeam', st, { root: true })
      }
      await dispatch('getYahooTeams', state.yahooLeagueId)
      await dispatch('getScadTeams', state.scadLeagueId)
    },

    async getYahooLeagueDetails ({ rootState, state, commit }, leagueId) {
      // console.log('[LEAGUE-ACTION] - getYahooLeagueDetails()')
      try {
        const yahooLeague = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${state.yahooGameKey}/league/${leagueId}`)
        console.log('YAHOO-LEAGUE-DETAILS: ', yahooLeague.data)
        commit('updateYahooLeagueDetails', yahooLeague.data.league)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getYahooSettings ({ rootState, state, commit }, leagueId) {
      // console.log('[LEAGUE-ACTION] - getYahooSettings()')
      try {
        const settings = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${state.yahooGameKey}/league/${leagueId}/settings`)
        console.log('YAHOO-SETTINGS: ', settings.data)
        commit('updateYahooSettings', settings.data.settings)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getScadSettings ({ rootState, state, commit }, id) {
      // console.log('[LEAGUE-ACTION] - getScadSettings()')
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${id}`)
          // .get(`/scadleague/default`)
        console.log('SCAD-SETTINGS: ', res)
        commit('updateScadSettings', res.data.settings)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getScadSettingsByYahooId ({ rootState, state, commit }, yahooId) {
      // console.log('[LEAGUE-ACTION] - getScadSettingsByYahooId()')
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${state.yahooGameKey}/${yahooId}`)
          // .get(`/scadleague/default`)
        console.log('SCAD-SETTINGS-ByYAHOO: ', res.data)
        commit('updateScadSettings', res.data.scadLeague)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getYahooTeams ({ rootState, state, commit }, leagueId) {
      // console.log('[LEAGUE-ACTION] - getYahooTeams()')
      try {
        const standings = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${state.yahooGameKey}/league/${leagueId}/standings`)
        console.log('YAHOO-TEAMS: ', standings.data)
        commit('updateYahooTeams', standings.data.standings)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getScadTeams ({ rootState, commit }, id) {
      // console.log('[TEAM-ACTION] - getScadTeams()')
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${id}/team/all`)
        console.log('SCAD-TEAMS: ', res.data)
        commit('updateScadTeams', res.data.scadTeams)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getAllYahooLeagues ({ rootState, commit, state }) {
      // console.log('[LEAGUE-ACTION] - getAllYahooLeagues()')
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${state.yahooGameKey}/league/get/all`)
        console.log('YAHOO-LEAGUES: ', res.data)
        commit('updateYahooLeagues', res.data.leagues)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getAllScadLeagues ({ rootState, commit, dispatch }) {
      // console.log('[LEAGUE-ACTION] - getAllScadLeagues()')
      try {
        const scadleagues = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/get/all`)
        console.log('SCAD-LEAGUES: ', scadleagues.data)
        commit('updateScadLeagues', scadleagues.data.scadLeagues)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async getAllYahooCommishLeagues ({ rootState, commit, state }) {
      // console.log('[LEAGUE-ACTION] - getAllYahooCommishLeagues()')
      try {
        const commishLeagues = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${state.yahooGameKey}/league/commissioner/all`)
        console.log('YAHOO-COMMISH-LEAGUES: ', commishLeagues.data)
        commit('updateYahooCommishLeagues', commishLeagues.data.commishLeagues)
      } catch (err) {
        catchAxiosError(err)
      }
    },

    async registerLeague ({ rootState, commit, state }, { league }) {
      // console.log('[LEAGUE-ACTION] - registerLeague()')
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .post('/scad/league', { data: league })
        console.log('POST response scadleague: ', res)
        // commit('updateLeague', { league: league })
      } catch (err) {
        catchAxiosError(err)
      }
    },
    async saveLeagueSettings ({ rootState, commit, state }, { settings }) {
      console.log('[LEAGUE-ACTION] - saveLeagueSettings(): ', settings)
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scad/league/${settings._id}`, { data: settings })
        console.log('PUT RESPONSE - SAVE LEAGUE: ', res.data.message)
        commit('updateScadSettings', res.data.league)
        notify.saveSuccessful('SCAD settings saved successfully')
      } catch (err) {
        catchAxiosError(err)
      }
    }
  }
}
