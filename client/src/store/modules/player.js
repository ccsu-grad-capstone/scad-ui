// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
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
      dispatch('getAllYahooPlayers', rootState.league.yahooLeagueID)
      dispatch('getAllScadPlayers', rootState.league.yahooLeagueID)
    },

    async getAllYahooPlayers ({ commit, rootState }, leagueId) {
      // console.log(`[PLAYER-ACTION] - getAllYahooPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${leagueId}/players`)
        console.log('YAHOO-PLAYERS: ', res.data)
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
          .get(`/scad/yahoo/league/${leagueId}/player/all`)
        console.log('SCAD-PLAYERS: ', res.data)
        commit('updateScadPlayers', res.data.scadLeaguePlayers)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },
    async getTeamYahooPlayers ({ commit, rootState }, teamID) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${rootState.league.yahooLeagueID}/team/${teamID}`)
        console.log('TEAM-PLAYERS: ', res.data.team.roster)
        commit('updateYahooPlayers', res.data.team.roster.players)
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
