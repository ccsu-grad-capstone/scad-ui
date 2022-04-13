/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
import { api } from '../../utilities/axios-node'
import moment from 'moment'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'
// import { calcTeamSalary, getPosCount } from '../../utilities/calculator'
// import { checkIRCount, checkCovidCount } from '../../utilities/validators'
// import { getTeamGuid } from '../../utilities/functions'

export default {
  namespaced: true,
  state: {
    _id: '',
    lastChecked: '',
    teams: []
  },
  getters: {

  },

  mutations: {
    updateTeams (state, teams) {
      // console.log('[LEAGUE-MUTATION] - key()')
      state.teams = teams
    },
    updateDiagnostic (state, d) {
      state._id = d._id
      state.lastChecked = moment(d.lastChecked).format('LLL')
    },
    updateLastChecked (state, d) {
      state.lastChecked = moment(d).format('LLL')
    }
  },
  actions: {
    async getDiagnostic ({ rootState, commit }) {
      try {
        const res = await api(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token,
          rootState.user.tokens.refresh_token).get(`/diagnostic/${rootState.league.yahooGameKey}/${rootState.league.yahooLeagueId}`)
        commit('updateDiagnostic', res.data.data[0])
        // console.log('DIAGNOSTIC', res.data.data[0])
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async updateDiagnostic ({ state, commit, rootState }) {
      try {
        let update = {
          lastChecked: moment()
        }
        commit('updateLastChecked', update.lastChecked)

        await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).put(`/diagnostic/${state._id}`, { data: update })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async runDiagnostics ({ rootState, state, commit, dispatch }) {
      try {
        await dispatch('transactions/getTransactions', null, { root: true })
        const process = await api(rootState.user.tokens.access_token, rootState.user.tokens.id_token).get(`/diagnostic/${state._id}/run`)
        console.log('RUN DIAGNOSTIC: ', process.data)
      } catch (error) {
        console.log(error)
      }

      // try {
      //   let teams = []
      //   for (var yt of rootState.league.yahooTeams) {
      //     let st = rootState.league.scadTeams.find(st => st.yahooGuid == getTeamGuid(yt))
      //     await dispatch('team/getTeam', { yahooLeagueId: rootState.league.yahooLeagueId, yahooTeamId: yt.team_id }, { root: true })
      //     await dispatch('capExemptions/getCapExemptionsByTeam', { guid: getTeamGuid(yt) }, { root: true })
      //     st.salary = calcTeamSalary(
      //       rootState.team.yahooTeam.roster,
      //       rootState.team.scadTeam.roster,
      //       rootState.capExemptions.capExemptionsByTeam,
      //       rootState.league.scadSettings.franchiseTagDiscount,
      //       rootState.league.scadSettings.irReliefPerc,
      //       rootState.team.yahooTeam,
      //       rootState.league.scadSettings.seasonYear
      //     )
      //     for (const ce of rootState.capExemptions.capExemptionsByTeam) {
      //       if (ce.year == rootState.league.scadSettings.seasonYear) {

      //       }
      //     }
      //     let team = {
      //       yahooTeam: rootState.team.yahooTeam,
      //       qb: getPosCount('QB', rootState.team.yahooTeam.roster),
      //       wr: getPosCount('WR', rootState.team.yahooTeam.roster),
      //       rb: getPosCount('RB', rootState.team.yahooTeam.roster),
      //       te: getPosCount('TE', rootState.team.yahooTeam.roster),
      //       def: getPosCount('DEF', rootState.team.yahooTeam.roster),
      //       salary: st.salary
      //     }
      //     if (!checkIRCount(rootState.team.yahooTeam.roster)) {
      //       team.ir = 'IR'
      //     }
      //     if (!checkCovidCount(rootState.team.yahooTeam.roster)) {
      //       team.ir = 'COVID'
      //     }
      //     team.yahooTeam.team_standings = yt.standings.rank
      //     teams.push(team)
      //     await dispatch('team/saveTeam', st, { root: true })
      //   }
      //   commit('updateTeams', teams)
      //   await dispatch('league/getYahooTeams', rootState.league.yahooLeagueId, { root: true })
      //   await dispatch('league/getScadTeams', rootState.league.scadLeagueId, { root: true })
      //   await dispatch('updateDiagnostic')
      // } catch (error) {
      //   catchAxiosNodeError(error)
      // }
    }
  }
}
