// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    yahooPlayers: [],
    scadPlayers: []
  },
  getters: {

  },

  mutations: {
    updateYahooPlayers (state, players) {
      // console.log(`[PLAYER-MUTATION] - updateYahooPlayers()`)
      state.yahooPlayers = players
    },
    updateScadPlayers (state, players) {
      // console.log(`[PLAYER-MUTATION] - updateYahooPlayers()`)
      state.scadPlayers = players
    },
    updatePlayer (state, player) {
      // console.log(`[PLAYER-MUTATION] - updatePlayer()`)
      state.id = player.id
      state.salary = player.salary // <- ??
    },
    logoutPlayer (state) {
      // console.log('[PLAYER-MUTATION] - logoutPlayer()')
      state.id = ''
      state.salary = ''
    }
  },
  actions: {

    async getAllPlayers ({ dispatch, rootState }) {
      await dispatch('getAllYahooPlayers', rootState.league.yahooLeagueId)
      await dispatch('getAllScadPlayers', rootState.league.yahooLeagueId)
    },

    async getAllYahooPlayers ({ commit, rootState }, leagueId) {
      // console.log(`[PLAYER-ACTION] - getAllYahooPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${leagueId}/players`)
        commit('updateYahooPlayers', res.data.players)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },
    async getAllScadPlayers ({ commit, rootState }, leagueId) {
      // console.log(`[PLAYER-ACTION] - getAllScadPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${leagueId}/player/all`)
        commit('updateScadPlayers', res.data.scadLeaguePlayers)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },
    async getTeamYahooPlayers ({ commit, rootState }, teamId) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${rootState.league.yahooLeagueId}/team/${teamId}/players`)
        console.log('TEAM-PLAYERS: ', res.data)
        await commit('updateYahooPlayers', res.data.players)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },
    async getTeamScadPlayers ({ commit, rootState }, teamId) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${rootState.league.yahooLeagueId}/team/${teamId}/players`)
        console.log('SCAD-PLAYERS: ', res.data.scadLeaguePlayers)
        await commit('updateScadPlayers', res.data.scadLeaguePlayers)
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
