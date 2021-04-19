/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'
import { node, nodeHeader } from '../../utilities/axios-node'
import { getScadTeam, getYahooTeamFromYahooTeamId, getSalaryForCatch } from '../../utilities/functions'
import { calcTeamSalary } from '../../utilities/calculator'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

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
      state.lastChecked = moment(t.lastChecked).format('LLL')
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
    }
  },
  actions: {
    async getTransactionTimestamp ({ rootState, commit }) {
      try {
        const res = await node.get(`/transaction/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}`)
        // console.log(res.data.data[0])
        await commit('updateTransaction', res.data.data[0])
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async updateEndOfSeasonPlayerHistory ({ state, rootState, commit }) {
      try {
        let update = {
          endOfSeasonPlayerHistory: state.endOfSeasonPlayerHistory.slice()
        }
        update.endOfSeasonPlayerHistory.push(rootState.league.yahooLeagueDetails.season)
        console.log(update)
        await node.put(`/transaction/update/${state._id}`, { data: update })
        commit('updateEndOfSeasonPlayerHistory', update)
        // commit('updateTransaction', transaction)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async updateLastChecked ({ state, commit }) {
      try {
        let update = {
          lastChecked: moment().format('LLL')
        }
        await node.put(`/transaction/update/${state._id}`, { data: update })
        commit('updateLastChecked', update)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async updateLastTimestamp ({ state, commit }) {
      try {
        let update = {
          lastTimestamp: state.transactions[0].timestamp,
          lastTransactionId: state.transactions[0].transaction_id
        }
        await node.put(`/transaction/update/${state._id}`, { data: update })
        commit('updateLastTimestamp', update)
      } catch (error) {
        console.error(error)
        catchAxiosNodeError(error)
      }
    },

    async getTransactions ({ rootState, state, commit, dispatch }) {
      // console.log('[TRANSACTIONS-ACTION] - getTransactions()')

      try {
        dispatch('getTransactionTimestamp')

        // const players = await node.get(`/player/yahoo/${rootState.league.yahooLeagueId}/${rootState.user.tokens.access_token}`)
        // console.log(players)

        const transactions = await nodeHeader(rootState.user.tokens.access_token).get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${rootState.league.yahooLeagueId}/transactions`)
        console.log('TRANSACTIONS: ', transactions.data.transactions)
        await commit('updateTransactions', transactions.data.transactions)
        // Check if lastest transaction is new based on timestamps
        if (state.transactions[0].timestamp > state.lastTimestamp) {
          let updatedTeams = []
          for (let t of state.reversedTransactions) {
            if (t.timestamp > state.lastTimestamp) { // Check Timestamp of last saved Transaction
              if ((t.type.indexOf('add') > -1 || t.type === 'drop') && t.status === 'successful') { // only execute if it's an add transaction
                for (let p of t.players) { // loop through players
                  console.log('PLAYER NAME:', p.name.full, 'Timestamp', t.timestamp)
                  let yahooTeamId
                  try {
                    const res = await nodeHeader(
                      rootState.user.tokens.access_token,
                      rootState.user.tokens.id_token)
                      .get(`/scad/player/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/player/${p.player_id}`)
                    let player = res.data.scadPlayer
                    let newSalary
                    let originalSalary = res.data.scadPlayer.salary
                    let log
                    if (p.transaction.type === 'add') {
                      yahooTeamId = p.transaction.destination_team_key.split('.')[4]
                      newSalary = t.faab_bid ? t.faab_bid : 1
                      log = {
                        originalSalary: originalSalary,
                        newSalary: newSalary,
                        type: t.faab_bid ? 'Waivers' : 'FA',
                        team: {
                          name: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).name,
                          yahooTeamId: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).team_id
                        },
                        user: undefined,
                        comment: t.faab_bid ? 'Successful waiver claim' : 'FA pickup',
                        date: new Date(t.timestamp * 1000)
                      }
                    } else if (p.transaction.type === 'drop') {
                      yahooTeamId = p.transaction.source_team_key.split('.')[4]
                      newSalary = 0
                      log = {
                        originalSalary: originalSalary,
                        newSalary: newSalary,
                        type: 'Drop',
                        team: {
                          name: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).name,
                          yahooTeamId: getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId).team_id
                        },
                        user: undefined,
                        comment: 'Player dropped, salary reset.',
                        date: new Date(t.timestamp * 1000)
                      }
                    }
                    player.salary = newSalary
                    await dispatch('team/savePlayer', { player: player, log: log }, { root: true })
                    if (!updatedTeams.includes(yahooTeamId)) {
                      updatedTeams.push(yahooTeamId)
                    }
                  } catch (err) {
                    // If scad player doesn't exist, we will add him to the DB
                    if (err.response && err.response.status === 404) {
                      let player = {
                        yahooPlayerId: p.player_id,
                        yahooLeagueId: rootState.league.yahooLeagueId,
                        scadLeagueId: rootState.league.scadLeagueId,
                        yahooTeamId: yahooTeamId,
                        scadTeamId: getScadTeam(rootState.league.scadTeams, yahooTeamId)._id,
                        salary: getSalaryForCatch(t, p),
                        isFranchiseTag: false,
                        renewSCADLeaguePlayerId: 0,
                        previousYearSalary: 0
                      }
                      if (!updatedTeams.includes(yahooTeamId)) {
                        updatedTeams.push(yahooTeamId)
                      }
                      console.log('ADDING PLAYER', player)
                      await dispatch('team/addPlayer', { player: player }, { root: true })
                    } else {
                      console.log(err)
                    }
                  }
                }
              }
            }
          }
          console.log('UPDATED TEAMS: ', updatedTeams)

          // UPDATE TEAM SALARIES
          for (var id of updatedTeams) {
            let st = rootState.league.scadTeams.find(st => st.yahooTeamId == id)

            // Get SCAD Players
            const scadPlayers = await nodeHeader(
              rootState.user.tokens.access_token,

              rootState.user.tokens.id_token)
              .get(`/scad/league/yahoo/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}/team/${id}/players`)
            console.log(scadPlayers.data)

            // Get YAHOO Team
            const yahooTeam = await nodeHeader(
              rootState.user.tokens.access_token,
              rootState.user.tokens.id_token)
              .get(`/yahoo/game/${rootState.league.yahooGameKey}/league/${rootState.league.yahooLeagueId}/team/${st.yahooTeamId}/roster`)
            console.log(yahooTeam.data)

            // Get Cap Exemptions for Team
            const ce = await node.get(`/capExemptions/${rootState.league.scadLeagueId}/${st.yahooTeamId}`)

            // CALC new Team salary
            st.salary = calcTeamSalary(
              yahooTeam.data.team.roster,
              scadPlayers.data.scadPlayers,
              ce.data.data,
              rootState.league.scadSettings.franchiseTagDiscount,
              rootState.league.scadSettings.irReliefPerc,
              yahooTeam.data.team,
              rootState.league.scadSettings.seasonYear
            )

            await dispatch('team/saveTeam', st, { root: true })
          }
          await dispatch('league/getYahooTeams', rootState.league.yahooLeagueId, { root: true })
          await dispatch('league/getScadTeams', rootState.league.scadLeagueId, { root: true })
        } else {
          console.log('No new Transactions')
        }
        dispatch('updateLastTimestamp')
        dispatch('updateLastChecked')
        state.loaded = true
      } catch (error) {
        console.log(error)
        catchAxiosNodeError(error)
      }
    }
  }
}
