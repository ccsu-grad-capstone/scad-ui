/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
import { node } from '../../utilities/axios-node'
import moment from 'moment'
// import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'
import { calcTeamSalary, getPosCount } from '../../utilities/calculator'

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
      state.id = d._id
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
        console.log(error)
      }
    },
    async updateDiagnostic ({ state, commit }) {
      try {
        let update = {
          lastChecked: moment()
        }
        commit('updateLastChecked', update.lastChecked)

        await node.put(`/diagnostic/update/${state.id}`, { data: update })
      } catch (error) {
        console.log(error)
      }
    },
    async runDiagnostics ({ rootState, state, commit, dispatch }) {
      let teams = []
      for (var yt of rootState.league.yahooTeams) {
        let st = rootState.league.scadTeams.find(st => st.yahooLeagueTeamId == yt.team_id)
        await dispatch('team/getTeam', { yahooLeagueId: rootState.league.yahooLeagueId, yahooTeamId: yt.team_id }, { root: true })
        await dispatch('capExemptions/getCapExemptionsByTeam', { teamId: yt.team_id, year: rootState.league.scadSettings.seasonYear }, { root: true })
        st.salary = calcTeamSalary(
          rootState.team.yahooTeam.players,
          rootState.team.scadTeam.players,
          rootState.capExemptions.capExemptionsByTeam,
          rootState.league.scadSettings.franchiseTagDiscount,
          rootState.league.scadSettings.irReliefPerc,
          rootState.team.yahooTeam,
          rootState.league.scadSettings.seasonYear
        )
        let team = {
          yahooTeam: rootState.team.yahooTeam,
          qb: getPosCount('QB', rootState.team.yahooTeam.players),
          wr: getPosCount('WR', rootState.team.yahooTeam.players),
          rb: getPosCount('RB', rootState.team.yahooTeam.players),
          te: getPosCount('TE', rootState.team.yahooTeam.players),
          def: getPosCount('DEF', rootState.team.yahooTeam.players),
          salary: st.salary
        }
        console.log(yt.team_standings)
        team.yahooTeam.team_standings = yt.team_standings.team_standings.rank
        teams.push(team)
        await dispatch('team/saveTeam', st, { root: true })
      }
      commit('updateTeams', teams)
      await dispatch('league/getYahooTeams', rootState.league.yahooLeagueId, { root: true })
      await dispatch('league/getScadTeams', rootState.league.scadLeagueId, { root: true })
      await dispatch('updateDiagnostic')
    }
  }
}
