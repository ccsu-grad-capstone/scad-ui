/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
import { node } from '../../utilities/axios-node'
import moment from 'moment'
import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'
import { calcTeamSalary, getPosCount } from '../../utilities/calculator'
import { checkIRCount, checkCovidCount } from '../../utilities/validators'

export default {
  namespaced: true,
  state: {
    id: '',
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
        const res = await node.get(`/diagnostic/${rootState.league.yahooLeagueId}`)
        commit('updateDiagnostic', res.data.data[0])
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async updateDiagnostic ({ state, commit }) {
      try {
        let update = {
          lastChecked: moment()
        }
        commit('updateLastChecked', update.lastChecked)

        await node.put(`/diagnostic/update/${state._id}`, { data: update })
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },
    async runDiagnostics ({ rootState, state, commit, dispatch }) {
      try {
        let teams = []
        for (var yt of rootState.league.yahooTeams) {
          let st = rootState.league.scadTeams.find(st => st.yahooTeamId == yt.team_id)
          await dispatch('team/getTeam', { yahooLeagueId: rootState.league.yahooLeagueId, yahooTeamId: yt.team_id }, { root: true })
          await dispatch('capExemptions/getCapExemptionsByTeam', { teamId: yt.team_id, year: rootState.league.scadSettings.seasonYear }, { root: true })
          st.salary = calcTeamSalary(
            rootState.team.yahooTeam.roster,
            rootState.team.scadTeam.roster,
            rootState.capExemptions.capExemptionsByTeam,
            rootState.league.scadSettings.franchiseTagDiscount,
            rootState.league.scadSettings.irReliefPerc,
            rootState.team.yahooTeam,
            rootState.league.scadSettings.seasonYear
          )
          let team = {
            yahooTeam: rootState.team.yahooTeam,
            qb: getPosCount('QB', rootState.team.yahooTeam.roster),
            wr: getPosCount('WR', rootState.team.yahooTeam.roster),
            rb: getPosCount('RB', rootState.team.yahooTeam.roster),
            te: getPosCount('TE', rootState.team.yahooTeam.roster),
            def: getPosCount('DEF', rootState.team.yahooTeam.roster),
            salary: st.salary
          }
          if (!checkIRCount(rootState.team.yahooTeam.roster)) {
            team.ir = 'IR'
          }
          if (!checkCovidCount(rootState.team.yahooTeam.roster)) {
            team.ir = 'COVID'
          }
          team.yahooTeam.team_standings = yt.standings.rank
          teams.push(team)
          await dispatch('team/saveTeam', st, { root: true })
        }
        commit('updateTeams', teams)
        await dispatch('league/getYahooTeams', rootState.league.yahooLeagueId, { root: true })
        await dispatch('league/getScadTeams', rootState.league.scadLeagueId, { root: true })
        await dispatch('updateDiagnostic')
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
