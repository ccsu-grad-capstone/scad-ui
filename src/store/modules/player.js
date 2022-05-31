// import { notify } from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
import { catchAxiosError } from '../../utilities/catchAxiosErrors'
import { getOwner, getTeamGuid } from '../../utilities/functions'
import { checkToLogEOYSalaries } from '../../utilities/validators'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    yahooPlayers: [],
    scadPlayers: [],
    yahooTeamPlayers: [],
    scadTeamPlayers: [],
    scadPlayer: {},
    franchiseTaggedPlayers: []
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
    updateFranchiseTaggedPlayers (state, players) {
      // console.log(`[PLAYER-MUTATION] - updateYahooPlayers()`)
      state.franchiseTaggedPlayers = players
    },
    updateYahooTeamPlayers (state, players) {
      // console.log(`[PLAYER-MUTATION] - updateYahooPlayers()`)
      state.yahooTeamPlayers = players
    },
    updateScadTeamPlayers (state, players) {
      // console.log(`[PLAYER-MUTATION] - updateYahooPlayers()`)
      state.scadTeamPlayers = players
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
          const res = await api(
            rootState.user.tokens.access_token,
            rootState.user.tokens.id_token)
            .get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${leagueId}/players`)
          commit('updateYahooPlayers', res.data.players)
          console.log('ALL-YAHOO-PLAYERS: ', res.data.players)
        } catch (err) {
          catchAxiosError(err)
        }
      }
    },
    async getAllScadPlayers ({ commit, rootState, state }, scadLeagueId) {
      // console.log(`[PLAYER-ACTION] - getAllScadPlayers()`)
      if (state.scadPlayers.length === 0) {
        try {
          const res = await api(
            rootState.user.tokens.access_token,
            rootState.user.tokens.id_token)
            .get(`/scad/league/${scadLeagueId}/player/all`)
          console.log(res)
          commit('updateScadPlayers', res.data.scadPlayers)
          console.log('ALL-SCAD-PLAYERS: ', res.data.scadPlayers)
        } catch (err) {
          catchAxiosError(err)
        }
      }
    },
    async getTeamYahooPlayers ({ commit, rootState }, teamId) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${rootState.league.yahooLeagueId}/team/${teamId}/players`)
        console.log('TEAM-PLAYERS: ', res.data)
        await commit('updateYahooTeamPlayers', res.data.players)
      } catch (err) {
        catchAxiosError(err)
      }
    },
    async getTeamScadPlayers ({ commit, rootState }, teamId) {
      // console.log(`[PLAYER-ACTION] - getTeamYahooPlayers()`)
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/league/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/team/${teamId}/players`)
        console.log('SCAD-PLAYERS: ', res.data.scadPlayers)
        await commit('updateScadTeamPlayers', res.data.scadPlayers)
      } catch (err) {
        catchAxiosError(err)
      }
    },
    async getScadPlayer ({ commit, rootState }, yahooPlayerId) {
      // console.log(`[PLAYER-ACTION] - getScadPlayer()`)
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/player/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/player/${yahooPlayerId}`)
        // console.log('SCAD-PLAYER: ', res.data.scadPlayer)
        await commit('updateScadPlayer', res.data.scadPlayer)
      } catch (err) {
        catchAxiosError(err)
      }
    },
    async getFranchiseTaggedPlayers ({ commit, rootState, state }) {
      // console.log(`[PLAYER-ACTION] - getFranchiseTaggedPlayers()`)
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .get(`/scad/player/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/franchiseTagged`)
        console.log('FranchiseTaggedPlayers: ', res.data.scadPlayerFranchiseTagged)
        await commit('updateFranchiseTaggedPlayers', res.data.scadPlayerFranchiseTagged)
      } catch (err) {
        catchAxiosError(err)
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
              yahooTeamId: owner ? owner.team_id : 'Free Agent',
              yahooGuid: owner ? getTeamGuid(owner) : 'Free Agnet'
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
