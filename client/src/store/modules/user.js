import Vue from 'vue'
import { scad } from '../../utilities/axiosScad'
import axios from 'axios'
import { server } from '../../utilities/axios-server'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    user: {},
    isAdmin: false,
    active: false,
    tokens: {
      access_token: '',
      refresh_token: '',
      id_token: ''
    }
  },
  getters: {
    name (state) {
      console.log('[USER-GETTERS] - name()')
      return `${state.firstName} ${state.lastName}`
    },
    getAccessToken (state) {
      return state.tokens.access_token
    },
    getIdToken (state) {
      return state.tokens.id_token
    }
  },

  mutations: {
    logoutUser (state) {
      // console.log('[USER-MUTATION] - logoutUser()')
      state.user = {}
      state.isAdmin = false
      state.active = false
      state.tokens.access_token = ''
      state.tokens.refresh_token = ''
      state.tokens.id_token = ''
    },
    updateTokens (state, tokens) {
      // console.log('[USER-MUTATION] - updateTokens()')
      state.tokens.access_token = tokens.access_token
      state.tokens.refresh_token = tokens.refresh_token
      state.tokens.id_token = tokens.id_token
    },
    refreshToken (state, tokens) {
      // console.log('[USER-MUTATION] - refreshToken()')
      state.tokens.access_token = tokens.access_token
      state.tokens.refresh_token = tokens.refresh_token
    },
    updateUser (state, user) {
      // console.log('[USER-MUTATION] - updateUser()')
      state.user = user
      state.active = true
    }
  },
  actions: {
    // initiate OAuth Call
    async loginWithYahoo () {
      console.log('[USER-ACTION] - loginWithYahoo()')
      var nonce = Math.floor(Math.random() * 1000000 + 1)
      await axios.get(`https://api.login.yahoo.com/oauth2/request_auth?client_id=dj0yJmk9a1pBOHVpblRxME9PJmQ9WVdrOVpFaDZWVmxyTkcwbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWE3&redirect_uri=https://localhost:3000/auth/yahoo/redirect&response_type=code&language=en-us&scope=openid,fspt-w,sdpp-r&nonce=${nonce}`)
        .then((response) => {
          console.log(response.data)
        })
        .catch(error => {
          catchAxiosScadError(error)
        })
    },

    // refresh tokens with OAuth
    async refreshToken ({ commit, state }) {
      console.log('[USER-ACTION] - refreshToken()')
      await server.get(`auth/yahoo/refresh?refresh_token=${state.tokens.refresh_token}`)
        .then((response) => {
          Vue.$cookies.set('access_token', response.data.access_token)
          commit('refreshToken', response.data)
        })
        .catch(error => {
          catchAxiosScadError(error)
        })
    },
    async updateUser ({ state, commit }) {
      console.log('[USER-ACTION] - updateUser()')
      try {
        const res = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get('/user')
        commit('updateUser', res.data)
      } catch (error) {
        catchAxiosScadError(error)
      }
    },

    async loginToScad ({ state, commit, rootState }) {
      console.log('[USER-ACTION] - loginToScad()')
      try {
        const dashboard = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/dashboard/details`)
        console.log('DASHBOARD: ', dashboard)

        if (dashboard.data.key === 'league') {
          commit('league/updateScadSettings', dashboard.data.SCADLeague, { root: true })
          commit('league/updateYahooLeague', dashboard.data.YahooLeague, { root: true })
        } else {
          commit('league/dashboardRegister', dashboard.data, { root: true })
        }

        // const scadleagues = await scad(
        //   state.tokens.access_token,
        //   state.tokens.id_token)
        //   .get(`/scadleague/all`)
        // console.log('SCADLEAGUES: ', scadleagues)
        // commit('league/updateScadLeagues', scadleagues.data.scadLeagues, { root: true })

        // const settings = await scad(
        //   state.tokens.access_token,
        //   state.tokens.id_token)
        //   .get(`/league/${22351}/settings`)
        // console.log('SETTINGS: ', settings)
        // commit('league/updateYahooSettings', settings.data.settings[0], { root: true })

        // const teams = await scad(
        //   state.tokens.access_token,
        //   state.tokens.id_token)
        //   .get(`/league/${rootState.league.yahooLeagueID}/teams`)
        // console.log('TEAMS: ', teams)
        // commit('league/updateTeams', teams.data.teams, { root: true })

        // const standings = await scad(
        //   state.tokens.access_token,
        //   state.tokens.id_token)
        //   .get(`/league/${22351}/standings`)
        // console.log('STANDINGS: ', standings)
        // commit('league/updateStandings', standings.data.standings, { root: true })
        // commit('league/updateTeams', standings.data.standings, { root: true })

        // const scadplayer = await scad(
        //   state.tokens.access_token,
        //   state.tokens.id_token)
        //   .get(`/scadleague/player/${1}`)
        // console.log('SCAD Player: ', scadplayer)

        // // remove this once we have a dashboard endpoint
        // const yahooleagues = await scad(
        //   state.tokens.access_token,
        //   state.tokens.id_token)
        //   .get(`/league/all`)
        // // console.log('leagues: ', res)
        // commit('updateYahooLeagues', yahooleagues.data.leagues)
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
