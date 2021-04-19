/* eslint-disable eqeqeq */
import notify from '../../utilities/nofity'
import { nodeHeader } from '../../utilities/axios-node'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

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
      // console.log('yahooLeagueId', yahooLeagueId)
      // console.log('yahooTeamId', yahooTeamId)
      await dispatch('getYahooTeam', { yahooLeagueId: yahooLeagueId, yahooTeamId: yahooTeamId })
      await dispatch('getScadTeam', { yahooLeagueId: yahooLeagueId, yahooTeamId: yahooTeamId })
    },

    async getYahooTeam ({ commit, rootState }, { yahooLeagueId, yahooTeamId }) {
      // console.log(`[TEAM-ACTION] - getYahooTeam(${yahooTeamId})`)
      try {
        const res = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${rootState.league.gameKey}/league/${yahooLeagueId}/team/${yahooTeamId}/roster`)
        console.log('YAHOO-TEAM: ', res.data)
        commit('updateYahooTeam', res.data.team)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },

    async getScadTeam ({ commit, rootState }, { yahooLeagueId, yahooTeamId }) {
      console.log(`[TEAM-ACTION] - getScadTeam(${yahooTeamId})`, rootState.league.gameKey)
      try {
        const team = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${rootState.league.scadLeagueId}/yahooTeam/${yahooTeamId}`)
        // console.log('SCAD-TEAM: ', team.data)

        const players = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${rootState.league.gameKey}/${yahooLeagueId}/team/${yahooTeamId}/players`)
        // console.log('SCAD-TEAM - PLAYERS: ', players.data)

        let scadTeam = team.data.team
        scadTeam.roster = players.data.scadPlayers

        console.log('SCAD-TEAM: ', scadTeam)
        commit('updateScadTeam', scadTeam)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },

    async getMyYahooTeam ({ commit, rootState, state }) {
      // console.log(`[TEAM-ACTION] - getMyYahooTeam())`)
      try {
        const team = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${rootState.league.yahooLeagueId}/myTeam`)

        console.log('MY-YAHOO-TEAM: ', team.data)
        commit('updateMyYahooTeam', team.data.myTeam)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },

    async getMyScadTeam ({ commit, rootState, state }) {
      // console.log(`[TEAM-ACTION] - getMyScadTeam())`)
      try {
        const team = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${rootState.league.scadLeagueId}/team/myTeam`)
        // console.log('MY-SCAD-TEAM - TEAM INFO: ', team.data)

        const players = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/${rootState.league.scadLeagueId}/players/myPlayers`)
        // console.log('MY-SCAD-TEAM - PLAYERS: ', players.data)

        let scadTeam = team.data.myTeam
        scadTeam.roster = players.data.scadPlayers

        console.log('MY-SCAD-TEAM: ', scadTeam)
        commit('updateMyScadTeam', scadTeam)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },

    async addPlayer ({ rootState, dispatch, state }, { player }) {
      console.log(`[TEAM-ACTION] - addPlayer()`, player)
      try {
        const res = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .post(`/scad/player`, { data: player })
        console.log('ADD-PLAYER: ', res)
        // notify.salarySaveSuccessful()
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },

    async savePlayer ({ rootState, dispatch, state }, { player, log, yahooTeamId }) {
      console.log(`[TEAM-ACTION] - savePlayer()`)
      if (!player.history) {
        player.history = []
      }
      player.history.push(log)
      try {
        await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scad/player/${player._id}`, { data: player })
        // console.log('SAVE-PLAYER: ', res)
        notify.salarySaveSuccessful()
        if (yahooTeamId == state.myYahooTeamId) {
          await dispatch('getMyScadTeam', { yahooLeagueId: rootState.league.yahooLeagueId, yahooTeamId: yahooTeamId })
        }
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },

    async saveTeam ({ rootState, dispatch, state }, t) {
      console.log(`[TEAM-ACTION] - saveTeam()`)
      try {
        const res = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scad/team/${t._id}`, { data: t })
        console.log('SAVE-TEAM: ', res)
        // notify.teamSaveSuccessful()
      } catch (err) {
        catchAxiosNodeError(err)
      }
    }
  }
}
