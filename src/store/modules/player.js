// import { notify } from '../../utilities/nofity'
import { nodeHeader } from '../../utilities/axios-node'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'
import { getOwner } from '../../utilities/functions'
import { checkToLogEOYSalaries } from '../../utilities/validators'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    yahooPlayers: [],
    scadPlayers: [],
    scadPlayer: {}
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
    updateScadPlayer (state, player) {
      // console.log(`[PLAYER-MUTATION] - updateScadPlayer()`)
      state.scadPlayer = player
    },
    logoutPlayer (state) {
      // console.log('[PLAYER-MUTATION] - logoutPlayer()')
      state._id = ''
      state.salary = ''
    }
  },
  actions: {

    async getAllPlayers ({ dispatch, rootState }) {
      await dispatch('getAllYahooPlayers', rootState.league.yahooLeagueId)
      await dispatch('getAllScadPlayers', rootState.league.scadLeagueId)
    },

    async getAllYahooPlayers ({ commit, rootState, state }, leagueId) {
      // console.log(`[PLAYER-ACTION] - getAllYahooPlayers()`)
      if (state.yahooPlayers.length === 0) {
        try {
          const res = await nodeHeader(
            rootState.user.tokens.access_token,
            rootState.user.tokens.id_token)
            .get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${leagueId}/players`)
          commit('updateYahooPlayers', res.data.players)
          console.log('ALL-YAHOO-PLAYERS: ', res.data.players)
        } catch (err) {
          catchAxiosNodeError(err)
        }
      }
    },
    async getAllScadPlayers ({ commit, rootState, state }, scadLeagueId) {
      // console.log(`[PLAYER-ACTION] - getAllScadPlayers()`)
      if (state.scadPlayers.length === 0) {
        try {
          const res = await nodeHeader(
            rootState.user.tokens.access_token,
            rootState.user.tokens.id_token)
            .get(`/scad/league/${scadLeagueId}/player/all`)
          commit('updateScadPlayers', res.data.scadPlayers)
          console.log('ALL-SCAD-PLAYERS: ', res.data.scadPlayers)
        } catch (err) {
          catchAxiosNodeError(err)
        }
      }
    },
    async getTeamYahooPlayers ({ commit, rootState }, teamId) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${rootState.league.yahooLeagueId}/team/${teamId}/players`)
        console.log('TEAM-PLAYERS: ', res.data)
        await commit('updateYahooPlayers', res.data.players)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },
    async getTeamScadPlayers ({ commit, rootState }, teamId) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/team/${teamId}/players`)
        console.log('SCAD-PLAYERS: ', res.data.scadPlayers)
        await commit('updateScadPlayers', res.data.scadPlayers)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },
    async getScadPlayer ({ commit, rootState }, yahooPlayerId) {
      // console.log(`[PLAYER-ACTION] - getScadPlayer()`)
      try {
        const res = await nodeHeader(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/player/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/player/${yahooPlayerId}`)
        // console.log('SCAD-PLAYER: ', res.data.scadPlayer)
        await commit('updateScadPlayer', res.data.scadPlayer)
      } catch (err) {
        catchAxiosNodeError(err)
      }
    },
    async logAllPlayersEndOfYearSalary ({ rootState, state, dispatch }) {
      // console.log(`[PLAYER-ACTION] - logAllPlayersEndOfYearSalary()`)
      if (checkToLogEOYSalaries(rootState.league.yahooLeagueDetails, rootState.transactions.endOfSeasonPlayerHistory)) {
        await dispatch('getAllPlayers')
        for (const p of state.scadPlayers) {
          let owner = getOwner(p.yahooPlayerId, rootState.league.yahooTeams, state.yahooPlayers)
          const log = {
            originalSalary: p.salary,
            newSalary: p.salary,
            type: 'EOY',
            team: {
              name: owner ? owner.name : 'Free Agent',
              yahooTeamId: owner ? owner.team_id : 'Free Agent'
            },
            user: undefined,
            comment: 'End of year salary.',
            date: moment().format()
          }
          await dispatch('team/savePlayer', {
            player: p,
            log: log,
            yahooTeamId: undefined
          }, { root: true })
        }
        await dispatch('transactions/updateEndOfSeasonPlayerHistory', null, { root: true })
      } else console.log('EOY Salaries have already been logged.')
    }
  }
}
