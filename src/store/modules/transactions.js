/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { catchAxiosError } from '../../utilities/catchAxiosErrors'
import { api } from '../../utilities/axios-node'
// import { getScadTeam, getYahooTeamFromYahooTeamId, getSalaryForCatch, getTeamGuid } from '../../utilities/functions'
// import { calcTeamSalary } from '../../utilities/calculator'
import { catchAxiosError } from '../../utilities/catchAxiosErrors'

import moment from 'moment'

export default {
  namespaced: true,
  state: {
    id: '',
    lastChecked: '',
    lastTimestamp: '',
    loaded: false,
    transactions: [],
    reversedTransactions: [],
    endOfSeasonPlayerHistory: {}
  },
  getters: {

  },

  mutations: {
    updateTransaction (state, t) {
      state._id = t._id
      state.lastChecked = moment(t.lastChecked).format('LLL')
      state.lastTimestamp = t.lastTimestamp
      state.endOfSeasonPlayerHistory = t.endOfSeasonPlayerHistory
    },
    updateLastChecked (state, t) {
      // state.lastChecked = moment(t.lastChecked).format('LLL')
    },
    updateLastTimestamp (state, t) {
      state.lastTimestamp = t.lastTimestamp
    },
    updateTransactions (state, transactions) {
      state.transactions = transactions
      state.reversedTransactions = transactions.slice().reverse()
    },
    updateEndOfSeasonPlayerHistory (state, update) {
      state.endOfSeasonPlayerHistory = update.updateEndOfSeasonPlayerHistory
    },
    resetTransactions (state) {
      state.id = ''
      state.lastChecked = ''
      state.lastTimestamp = ''
      state.loaded = false
      state.transactions = []
      state.reversedTransactions = []
      state.endOfSeasonPlayerHistory = {}
    }
  },
  actions: {
    async getTransactionTimestamp ({ rootState, commit }) {
      try {
        const res = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/transaction/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}`)
        console.log('TRANSACTION', res.data.data[0])
        await commit('updateTransaction', res.data.data[0])
      } catch (error) {
        catchAxiosError(error)
      }
    },
    async updateEndOfSeasonPlayerHistory ({ state, rootState, commit }) {
      try {
        let update = {
          endOfSeasonPlayerHistory: state.endOfSeasonPlayerHistory.slice()
        }
        update.endOfSeasonPlayerHistory.push(rootState.league.yahooLeagueDetails.season)
        console.log(update)
        // await node.put(`/transaction/update/${state._id}`, { data: update })
        await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/transaction/${state._id}`, { data: update })
        commit('updateEndOfSeasonPlayerHistory', update)
        // commit('updateTransaction', transaction)
      } catch (error) {
        catchAxiosError(error)
      }
    },
    async updateLastChecked ({ state, commit, rootState }) {
      try {
        let update = {
          lastChecked: moment().format('LLL')
        }
        await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/transaction/${state._id}`, { data: update })
        commit('updateLastChecked', update)
      } catch (error) {
        catchAxiosError(error)
      }
    },
    async updateLastTimestamp ({ state, commit, rootState }) {
      try {
        let update = {
          lastTimestamp: state.transactions[0].timestamp,
          lastTransactionId: state.transactions[0].transaction_id
        }
        await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/transaction/${state._id}`, { data: update })
        commit('updateLastTimestamp', update)
      } catch (error) {
        console.error(error)
        catchAxiosError(error)
      }
    },

    async getTransactions ({ rootState, state, commit, dispatch }) {
      // console.log('[TRANSACTIONS-ACTION] - getTransactions()')

      try {
        await dispatch('getTransactionTimestamp')

        // const players = await node.get(`/player/yahoo/${rootState.league.yahooLeagueId}/${rootState.user.tokens.access_token}`)
        // console.log(players)

        const transactions = await api(rootState.user.tokens.access_token).get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${rootState.league.yahooLeagueId}/transactions`)
        console.log('TRANSACTIONS: ', transactions.data.transactions)
        await commit('updateTransactions', transactions.data.transactions)
        const process = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/transaction/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/process`)
        console.log('PROCESS TRANSACTIONS: ', process.data)

        // // Check if lastest transaction is new based on timestamps
        // if (transactions.data.transactions.length > 0) {
        //   await commit('updateTransactions', transactions.data.transactions)
        //   if (state.transactions[0].timestamp > state.lastTimestamp) {
        //     notify.warning('Updating teams based on recent transactions')
        //     let updatedTeams = []
        //     for (let t of state.reversedTransactions) {
        //       if (t.timestamp > state.lastTimestamp) { // Check Timestamp of last saved Transaction
        //         if ((t.type.indexOf('add') > -1 || t.type === 'drop') && t.status === 'successful') { // only execute if it's an add transaction
        //           for (let p of t.players) { // loop through players
        //             console.log('PLAYER NAME:', p.name.full, 'Timestamp', t.timestamp, 'id', p.player_id)
        //             let yahooTeamId
        //             try {
        //               const res = await api(
        //                 rootState.user.tokens.access_token,
        //                 rootState.user.tokens.id_token)
        //                 .get(`/scad/player/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/player/${p.player_id}`)
        //               let player = res.data.scadPlayer
        //               let newSalary
        //               let originalSalary = res.data.scadPlayer.salary
        //               let log
        //               if (p.transaction.type === 'add') {
        //                 yahooTeamId = p.transaction.destination_team_key.split('.')[4]
        //                 newSalary = t.faab_bid ? t.faab_bid : 1
        //                 if (newSalary == 0) newSalary = 1
        //                 log = {
        //                   originalSalary: originalSalary,
        //                   newSalary: newSalary,
        //                   type: t.faab_bid ? 'Waivers' : 'FA',
        //                   team: {
        //                     name: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).name,
        //                     yahooTeamId: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).team_id,
        //                     yahooGuid: getTeamGuid(getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId))
        //                   },
        //                   user: undefined,
        //                   comment: t.faab_bid ? 'Successful waiver claim' : 'FA pickup',
        //                   date: new Date(t.timestamp * 1000)
        //                 }
        //               } else if (p.transaction.type === 'drop') {
        //                 if (player.preseasonIR) player.preseasonIR = false
        //                 if (player.isFranchiseTag) player.isFranchiseTag = false
        //                 yahooTeamId = p.transaction.source_team_key.split('.')[4]
        //                 newSalary = 0
        //                 log = {
        //                   originalSalary: originalSalary,
        //                   newSalary: newSalary,
        //                   type: 'Drop',
        //                   team: {
        //                     name: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).name,
        //                     yahooTeamId: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).team_id,
        //                     yahooGuid: getTeamGuid(getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId))
        //                   },
        //                   user: undefined,
        //                   comment: 'Player dropped, salary reset.',
        //                   date: new Date(t.timestamp * 1000)
        //                 }
        //               }
        //               player.salary = newSalary
        //               await dispatch('team/savePlayer', { player: player, log: log }, { root: true })
        //               if (!updatedTeams.includes(yahooTeamId)) {
        //                 updatedTeams.push(yahooTeamId)
        //               }
        //             } catch (err) {
        //               // If scad player doesn't exist, we will add him to the DB
        //               console.log('yahooTeamId', yahooTeamId)
        //               if (p.transaction.type === 'add') {
        //                 yahooTeamId = p.transaction.destination_team_key.split('.')[4]
        //               }
        //               if (yahooTeamId && err.response && err.response.status === 404) {
        //                 let player = {
        //                   yahooPlayerId: p.player_id,
        //                   yahooLeagueId: rootState.league.yahooLeagueId,
        //                   scadLeagueId: rootState.league.scadLeagueId,
        //                   yahooTeamId: yahooTeamId,
        //                   scadTeamId: getScadTeam(rootState.league.scadTeams, yahooTeamId)._id,
        //                   salary: getSalaryForCatch(t, p),
        //                   isFranchiseTag: false,
        //                   renewSCADLeaguePlayerId: 0,
        //                   previousYearSalary: 0
        //                 }
        //                 if (!updatedTeams.includes(yahooTeamId)) {
        //                   updatedTeams.push(yahooTeamId)
        //                 }
        //                 console.log('ADDING PLAYER', player)
        //                 await dispatch('team/addPlayer', { player: player }, { root: true })
        //               } else {
        //                 console.log(err)
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //     console.log('UPDATED TEAMS: ', updatedTeams)

        //     // UPDATE TEAM SALARIES
        //     for (var id of updatedTeams) {
        //       let st = rootState.league.scadTeams.find(st => st.yahooTeamId == id)

        //       await dispatch('team/getTeam', { yahooLeagueId: rootState.league.yahooLeagueId, yahooTeamId: id }, { root: true })
        //       await dispatch('capExemptions/getCapExemptionsByTeam', { guid: getTeamGuid(rootState.team.yahooTeam) }, { root: true })

        //       // CALC new Team salary
        //       st.salary = calcTeamSalary(
        //         rootState.team.yahooTeam.roster,
        //         rootState.team.scadTeam.roster,
        //         rootState.capExemptions.capExemptionsByTeam,
        //         rootState.league.scadSettings.franchiseTagDiscount,
        //         rootState.league.scadSettings.irReliefPerc,
        //         rootState.team.yahooTeam,
        //         rootState.league.scadSettings.seasonYear
        //       )

        //       await dispatch('team/saveTeam', st, { root: true })
        //     }
        //     await dispatch('league/getYahooTeams', rootState.league.yahooLeagueId, { root: true })
        //     await dispatch('league/getScadTeams', rootState.league.scadLeagueId, { root: true })
        //     // dispatch('updateLastTimestamp')
        //     notify.success('Transactions update complete')
        //   } else {
        //     console.log('No new Transactions')
        //   }
        // }
        // dispatch('updateLastChecked')
        // state.loaded = true
      } catch (error) {
        catchAxiosError(error)
      }
    }
  }
}
