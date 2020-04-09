/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    myYahooTeamID: '',
    myScadTeamID: '',

    myYahooTeam: {},
    myScadTeam: {},

    yahooTeam: {},
    scadTeam: {}
  },
  getters: {

  },

  mutations: {
    updateMyYahooTeamID (state, id) {
      // console.log(`[TEAM-MUTATION] - updateMyYahooTeamID()`)
      state.myYahooTeamID = id
    },
    logoutTeam (state) {
      // console.log('[TEAM-MUTATION] - logoutTeam()')
      // state.myYahooTeamID = ''
      // state.yahooTeam = {}
      // state.scadTeam = {}
      // state.yahooTeams = []
      // state.scadTeams = []
    },
    updateMyTeamIDs (state, ids) {
      // console.log('[TEAM-MUTATION] - updateMyTeamIDs()')
      state.myYahooTeamID = ids.myYahooTeamID
      state.myScadTeamID = ids.myScadTeamID
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
    async getTeam ({ dispatch }, yahooLeagueId, yahooTeamId) {
      await dispatch('getYahooTeam', yahooLeagueId, yahooTeamId)
      await dispatch('getScadTeam', yahooLeagueId, yahooTeamId)
    },

    async getYahooTeam ({ commit, rootState }, { yahooLeagueId, yahooTeamId }) {
      // console.log(`[TEAM-ACTION] - getYahooTeam(${yahooTeamId})`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${yahooLeagueId}/team/${yahooTeamId}`)
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
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/yahoo/league/${yahooLeagueId}/team/${yahooTeamId}`)
        console.log('SCAD-TEAM: ', res.data)
        commit('updateScadTeam', res.data)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },

    async savePlayer ({ rootState, dispatch, state }, player) {
      console.log(`[TEAM-ACTION] - savePlayer()`, player)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scad/player/${player.id}`, player)
        console.log('SAVE-PLAYER: ', res)
        notify.salarySaveSuccessful()
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
        dispatch('getTeam', { yahooLeagueId: t.yahooLeagueId, yahooTeamId: state.scadTeam.yahooLeagueTeamId })
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
