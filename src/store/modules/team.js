/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    myYahooTeamId: '',
    myScadTeamId: '',

    myYahooTeam: {},
    myScadTeam: {},

    yahooTeam: {},
    scadTeam: {}
  },
  getters: {

  },

  mutations: {
    updateMyYahooTeamId (state, id) {
      // console.log(`[TEAM-MUTATION] - updateMyYahooTeamId()`)
      state.myYahooTeamId = id
    },
    logoutTeam (state) {
      // console.log('[TEAM-MUTATION] - logoutTeam()')
      // state.myYahooTeamId = ''
      // state.yahooTeam = {}
      // state.scadTeam = {}
      // state.yahooTeams = []
      // state.scadTeams = []
    },
    updateMyTeamIds (state, ids) {
      // console.log('[TEAM-MUTATION] - updateMyTeamIds()')
      state.myYahooTeamId = ids.myYahooTeamId
      state.myScadTeamId = ids.myScadTeamId
    },
    updateMyYahooTeam (state, team) {
      // console.log('[TEAM-MUTATION] - updateYahooTeam()')
      state.myYahooTeam = team
      // console.log('MY-YAHOO-TEAM: ', team)
    },
    updateMyScadTeam (state, team) {
      // console.log('[TEAM-MUTATION] - updateScadTeam()')
      state.myScadTeam = team
      // console.log('MY-SCAD-TEAM: ', team)
    },
    updateYahooTeam (state, team) {
      // console.log('[TEAM-MUTATION] - updateYahooTeam()')
      state.yahooTeam = team
      // console.log('YAHOO-TEAM: ', team)
    },
    updateScadTeam (state, team) {
      // console.log('[TEAM-MUTATION] - updateScadTeam()')
      state.scadTeam = team
      // console.log('SCAD-TEAM: ', team)
    }
  },
  actions: {
    async getTeam ({ dispatch }, { yahooLeagueId, yahooTeamId }) {
      console.log('yahooLeagueId', yahooLeagueId)
      console.log('yahooTeamId', yahooTeamId)
      await dispatch('getYahooTeam', { yahooLeagueId: yahooLeagueId, yahooTeamId: yahooTeamId })
      await dispatch('getScadTeam', { yahooLeagueId: yahooLeagueId, yahooTeamId: yahooTeamId })
    },

    async getYahooTeam ({ commit, rootState }, { yahooLeagueId, yahooTeamId }) {
      // console.log(`[TEAM-ACTION] - getYahooTeam(${yahooTeamId})`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${yahooLeagueId}/team/${yahooTeamId}/roster`)
        console.log('YAHOO-TEAM: ', res.data)
        res.data.team.players = res.data.team.roster.players
        res.data.team.roster.players = {}
        commit('updateYahooTeam', res.data.team)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getScadTeam ({ commit, rootState }, { yahooLeagueId, yahooTeamId }) {
      // console.log(`[TEAM-ACTION] - getScadTeam(${yahooTeamId})`)
      try {
        const team = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${yahooLeagueId}/team/${yahooTeamId}`)
        console.log('SCAD-TEAM: ', team.data)

        const players = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${yahooLeagueId}/team/${yahooTeamId}/players`)
        console.log('SCAD-TEAM - PLAYERS: ', players.data)

        let scadTeam = team.data
        scadTeam.players = players.data.scadLeaguePlayers

        commit('updateScadTeam', scadTeam)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getMyYahooTeam ({ commit, rootState, state }) {
      console.log(`[TEAM-ACTION] - getMyYahooTeam())`)
      try {
        const team = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${rootState.league.yahooLeagueId}/myTeam`)
        // console.log('MY-YAHOO-TEAM - TEAM INFO: ', team.data)

        const players = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${rootState.league.yahooLeagueId}/myPlayers`)
        // console.log('MY-YAHOO-TEAM - PLAYERS: ', players.data)

        let yahooTeam = team.data
        yahooTeam.players = players.data

        console.log('MY-YAHOO-TEAM: ', yahooTeam)
        commit('updateMyYahooTeam', yahooTeam)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async getMyScadTeam ({ commit, rootState, state }) {
      console.log(`[TEAM-ACTION] - getMyScadTeam())`)
      try {
        const team = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${rootState.league.scadLeagueId}/team/myTeam`)
        // console.log('MY-SCAD-TEAM - TEAM INFO: ', team.data)

        const players = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${rootState.league.scadLeagueId}/player/myPlayers`)
        // console.log('MY-SCAD-TEAM - PLAYERS: ', players.data)

        let scadTeam = team.data
        scadTeam.players = players.data.scadLeaguePlayers

        commit('updateMyScadTeam', scadTeam)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async savePlayer ({ rootState, dispatch, state }, { player, yahooTeamId }) {
      console.log(`[TEAM-ACTION] - savePlayer()`, player)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scad/player/${player.id}`, player)
        console.log('SAVE-PLAYER: ', res)
        notify.salarySaveSuccessful()
        if (yahooTeamId == state.myYahooTeamId) {
          dispatch('getMyScadTeam', { yahooLeagueId: rootState.league.yahooLeagueId, yahooTeamId: yahooTeamId })
        }
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async saveTeam ({ rootState, dispatch, state }, t) {
      console.log(`[TEAM-ACTION] - saveTeam()`, t)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scad/team/${t.id}`, t)
        console.log('SAVE-TEAM: ', res)
        // notify.teamSaveSuccessful()
        dispatch('league/getScadTeams', rootState.league.scadLeagueId, { root: true })
        dispatch('getTeam', { yahooLeagueId: t.yahooLeagueId, yahooTeamId: state.scadTeam.yahooLeagueTeamId })
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
