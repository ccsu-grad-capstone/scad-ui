// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'

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

    async getAllYahooPlayers ({ commit, rootState }, leagueId) {
      console.log(`[PLAYER-ACTION] - getAllYahooPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/league/${leagueId}/players`)
        console.log('getAllYahooPlayers: ', res)
        commit('updateYahooPlayers', res)
      } catch (err) {
        console.log(err)
      }
    },
    async getAllScadPlayers ({ commit, rootState }, leagueId) {
      console.log(`[PLAYER-ACTION] - getAllScadPlayers()`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/yahoo/league/${leagueId}/players/all`)
        console.log('getAllYahooPlayers: ', res)
        commit('updateScadPlayers', res)
      } catch (err) {
        console.log(err)
      }
    },

    async updatePlayer ({ commit, rootState }, player) {
      console.log(`[PLAYER-ACTION] - updatePlayer(${player.id})`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scadleague/player/${player.id}`, player)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
