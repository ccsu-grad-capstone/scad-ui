/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'
import { scad } from '../../utilities/axios-scad'
import { node } from '../../utilities/axios-node'
import { getScadTeam } from '../../utilities/functions'
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
      state.id = t._id
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
        await node.put(`/transaction/update/${state.id}`, { data: update })
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
        await node.put(`/transaction/update/${state.id}`, { data: update })
        commit('updateLastTimestamp', update)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async getTransactions ({ rootState, state, commit, dispatch }) {
      console.log('[TRANSACTIONS-ACTION] - getTransactions()')
      try {
        dispatch('getTransactionTimestamp')

        // const players = await node.get(`/player/yahoo/${rootState.league.yahooLeagueId}/${rootState.user.tokens.access_token}`)
        // console.log(players)

        // // TESTING API..
        // const test = await node.get(`/yahoo/league/${rootState.league.yahooLeagueId}/teams/${rootState.user.tokens.access_token}`)
        // console.log('')
        // console.log('***API TEST***: ', test.data)
        // console.log('')

        const transactions = await node.get(`/transaction/yahoo/${rootState.league.yahooLeagueId}/${rootState.user.tokens.access_token}`)
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
                    console.log('PLAYER NAME:', p.name.full)
                    try {
                      const res = await scad(
                        rootState.user.tokens.access_token,
                        rootState.user.tokens.id_token)
                        .get(`/api/scad/league/yahoo/${rootState.league.yahooLeagueId}/player/${p.player_id}`)
                      let player = res.data
                      player.salary = p.transaction.source_type === 'freeagents' ? 1 : t.faab_bid
                      await dispatch('team/savePlayer', { player: player, yahooTeamId: rootState.league.yahooLeagueId }, { root: true })
                      if (!updatedTeams.includes(p.transaction.destination_team_key.split('.')[4])) {
                        updatedTeams.push(p.transaction.destination_team_key.split('.')[4])
                      }
                    } catch (err) {
                      if (err.response && err.response.status === 404) {
                        let player = {
                          yahooLeaguePlayerId: p.player_id,
                          yahooLeagueId: rootState.league.yahooLeagueId,
                          scadLeagueId: rootState.league.scadLeagueId,
                          yahooTeamId: p.transaction.destination_team_key.split('.')[4],
                          scadTeamId: getScadTeam(rootState.league.scadTeams, p.transaction.destination_team_key.split('.')[4]).id,
                          salary: p.transaction.source_type === 'freeagents' ? 1 : t.faab_bid,
                          isFranchiseTag: false,
                          renewSCADLeaguePlayerId: 0,
                          previousYearSalary: 0
                        }
                        if (!updatedTeams.includes(p.transaction.destination_team_key.split('.')[4])) {
                          updatedTeams.push(p.transaction.destination_team_key.split('.')[4])
                        }
                        console.log('ADDING PLAYER', player)
                        await dispatch('team/addPlayer', { player: player }, { root: true })
                      } else {
                        console.log(err)
                      }
                    }
                  } else if (p.transaction.type === 'drop') {
                    // try {
                    //   const res = await scad(
                    //     rootState.user.tokens.access_token,
                    //     rootState.user.tokens.id_token)
                    //     .get(`/api/scad/league/yahoo/${rootState.league.yahooLeagueId}/player/${p.player_id}`)
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
            let st = rootState.league.scadTeams.find(st => st.yahooLeagueTeamId == id)

            // Get SCAD Players
            const scadPlayers = await scad(
              rootState.user.tokens.access_token,
              rootState.user.tokens.id_token)
              .get(`/api/scad/league/${rootState.league.scadLeagueId}/team/${id}/players`)

            // Get YAHOO Team
            const yahooTeam = await scad(
              rootState.user.tokens.access_token,
              rootState.user.tokens.id_token)
              .get(`/api/yahoo/league/${rootState.league.yahooLeagueId}/team/${st.yahooLeagueTeamId}/roster`)
            // Get Cap Exemptions for Team
            const ce = await node.get(`/capExemptions/${rootState.league.yahooLeagueId}/${rootState.league.scadSettings.seasonYear}/${st.yahooLeagueTeamId}`)

            // CALC new Team salary
            st.salary = calcTeamSalary(
              yahooTeam.data.team.roster.players,
              scadPlayers.data.scadLeaguePlayers,
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
