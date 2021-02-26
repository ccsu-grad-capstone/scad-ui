/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'
import { node, nodeHeader } from '../../utilities/axios-node'
import { getScadTeam, getPlayerHistoryLog, getYahooTeamFromYahooTeamId } from '../../utilities/functions'
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
    transactions: []
  },
  getters: {

  },

  mutations: {
    updateTransaction (state, t) {
      state._id = t._id
      state.lastChecked = moment(t.lastChecked).format('LLL')
      state.lastTimestamp = t.lastTimestamp
    },
    updateLastChecked (state, t) {
      state.lastChecked = moment(t.lastChecked).format('LLL')
    },
    updateLastTimestamp (state, t) {
      state.lastTimestamp = t.lastTimestamp
    },
    updateTransactions (state, transactions) {
      state.transactions = transactions
    }
  },
  actions: {
    async getTransactionTimestamp ({ rootState, commit }) {
      try {
        const res = await node.get(`/transaction/${rootState.league.yahooLeagueId}`)
        commit('updateTransaction', res.data.data[0])
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
          lastTimestamp: state.transactions[0].timestamp
        }
        await node.put(`/transaction/update/${state._id}`, { data: update })
        commit('updateLastTimestamp', update)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },

    async getTransactions ({ rootState, state, commit, dispatch }) {
      // console.log('[TRANSACTIONS-ACTION] - getTransactions()')

      try {
        dispatch('getTransactionTimestamp')

        // const players = await node.get(`/player/yahoo/${rootState.league.yahooLeagueId}/${rootState.user.tokens.access_token}`)
        // console.log(players)

        const transactions = await nodeHeader(rootState.user.tokens.access_token).get(`/yahoo/league/${rootState.league.yahooLeagueId}/transactions`)
        console.log('TRANSACTIONS: ', transactions.data.transactions.transactions)
        commit('updateTransactions', transactions.data.transactions.transactions)

        // Check if lastest transaction is new based on timestamps
        if (state.transactions[0].timestamp > state.lastTimestamp) {
          let updatedTeams = []
          for (let t of state.transactions) {
            if (t.timestamp > state.lastTimestamp) { // Check Timestamp of last saved Transaction
              if (t.type.indexOf('add') > -1 && t.status === 'successful') { // only execute if it's an add transaction
                for (let p of t.players) { // loop through players
                  if (p.transaction.type === 'add') {
                    const yahooTeamId = p.transaction.destination_team_key.split('.')[4]
                    console.log('PLAYER NAME:', p.name.full)
                    try {
                      const res = await nodeHeader(
                        rootState.user.tokens.access_token,
                        rootState.user.tokens.id_token)
                        .get(`/scad/player/yahoo/${rootState.league.gameKey}/${rootState.league.yahooLeagueId}/player/${p.player_id}`)
                      let player = res.data.scadPlayer
                      player.salary = t.faab_bid ? t.faab_bid : 1
                      let log = getPlayerHistoryLog(player.salary, t.faab_bid ? 'Waivers' : 'FA', getYahooTeamFromYahooTeamId(rootState.league.yahooTeams, yahooTeamId))
                      await dispatch('team/savePlayer', { player: player, log: log }, { root: true })
                      if (!updatedTeams.includes(yahooTeamId)) {
                        updatedTeams.push(yahooTeamId)
                      }
                    } catch (err) {
                      if (err.response && err.response.status === 404) {
                        let player = {
                          yahooPlayerId: p.player_id,
                          yahooLeagueId: rootState.league.yahooLeagueId,
                          scadLeagueId: rootState.league.scadLeagueId,
                          yahooTeamId: yahooTeamId,
                          scadTeamId: getScadTeam(rootState.league.scadTeams, yahooTeamId)._id,
                          salary: t.faab_bid ? t.faab_bid : 1,
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
                  } else if (p.transaction.type === 'drop') {
                    // try {
                    //   const res = await nodeHeader(
                    //     rootState.user.tokens.access_token,
                    //     rootState.user.tokens.id_token)
                    //     .get(`/scad/league/yahoo/${rootState.league.yahooLeagueId}/player/${p.player_id}`)
                    //   let player = res.data
                    //   player.salary = 0
                    //   await dispatch('team/savePlayer', { player: player, yahooTeamId: rootState.league.yahooLeagueId }, { root: true })
                    // } catch (err) {
                    //   console.log(err)
                    // }
                  }
                }
              } // end add/drop transactions
              //
              // UPDATE SALARIES FOR THIS TRANSACTION
              //
            } else { break }
          }
          console.log('UPDATED TEAMS: ', updatedTeams)

          // UPDATE TEAM SALARIES
          for (var id of updatedTeams) {
            let st = rootState.league.scadTeams.find(st => st.yahooTeamId == id)

            // Get SCAD Players
            const scadPlayers = await nodeHeader(
              rootState.user.tokens.access_token,

              rootState.user.tokens.id_token)
              .get(`/scad/league/yahoo/${rootState.league.gameKey}/${rootState.league.yahooLeagueId}/team/${id}/players`)
            console.log(scadPlayers.data)

            // Get YAHOO Team
            const yahooTeam = await nodeHeader(
              rootState.user.tokens.access_token,
              rootState.user.tokens.id_token)
              .get(`/yahoo/league/${rootState.league.yahooLeagueId}/team/${st.yahooTeamId}/roster`)
            console.log(yahooTeam.data)

            // Get Cap Exemptions for Team
            const ce = await node.get(`/capExemptions/${rootState.league.yahooLeagueId}/${rootState.league.scadSettings.seasonYear}/${st.yahooTeamId}`)

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
        catchAxiosNodeError(error)
      }
    }
  }
}
