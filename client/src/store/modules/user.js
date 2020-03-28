// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
import axios from 'axios'
import { server } from '../../utilities/axios-server'
import Vue from 'vue'
import notify from '../../utilities/nofity'

export default {
  namespaced: true,
  state: {
    // hard coded user information for now..
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
      console.log('[USER-MUTATION] - logoutUser()')
      state.user = {}
      state.isAdmin = false
      state.tokens.access_token = ''
      state.tokens.refresh_token = ''
      state.tokens.id_token = ''
    },
    updateTokens (state, tokens) {
      console.log('[USER-MUTATION] - updateTokens()')
      state.tokens.access_token = tokens.access_token
      state.tokens.refresh_token = tokens.refresh_token
      state.tokens.id_token = tokens.id_token
    },
    refreshToken (state, tokens) {
      console.log('[USER-MUTATION] - refreshToken()')
      state.tokens.access_token = tokens.access_token
      state.tokens.refresh_token = tokens.refresh_token
    },
    updateUser (state, user) {
      console.log('[USER-MUTATION] - updateUser()')
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
          console.log(error.response.data)
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
          console.log(error)
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
        if (error.response) {
          console.log(error.response)
          notify.serverIssue(error.response.status, error.message)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      }
    },

    async loginToScad ({ state, commit }) {
      console.log('[USER-ACTION] - loginToScad()')
      try {
        const dashboard = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/dashboard/details`)
        console.log('DASHBOARD: ', dashboard)
        commit('league/updateScadSettings', dashboard.data.SCADLeague, { root: true })
        commit('league/updateYahooLeague', dashboard.data.YahooLeague, { root: true })

        const settings = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/league/${22351}/settings`)
        console.log('SETTINGS: ', settings)
        commit('league/updateYahooSettings', settings.data, { root: true })

        const teams = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/league/${22351}/teams`)
        console.log('TEAMS: ', teams)
        commit('league/updateTeams', teams.data.teams, { root: true })

        const standings = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/league/${22351}/standings`)
        console.log('STANDINGS: ', standings)
        commit('league/updateStandings', standings.data, { root: true })

        const scadplayer = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/scadleague/player/${1}`)
        console.log('SCAD Player: ', scadplayer)

        // remove this once we have a dashboard endpoint
        const yahooleagues = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get(`/league/all`)
        // console.log('leagues: ', res)
        commit('updateYahooLeagues', yahooleagues.data.leagues)
      } catch (error) {
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response)
          notify.serverIssue(error.response.status, error.message)
          // console.log(error.response.data)
          // console.log(error.response.status)
          // console.log(error.response.headers)
          // console.log(error.message)
          // console.log(error.request)
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message)
        }
        console.log(error)
      }
    }
  }
}
