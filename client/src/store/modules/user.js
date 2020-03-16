// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'
import axios from 'axios'
import { server } from '../../utilities/axios-server'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    // hard coded user information for now..
    user: {},
    active: false,
    isAdmin: false,
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
      state.firstName = ''
      state.lastName = ''
      state.email = ''
      state.active = false
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
      state.active = true
    },
    refreshToken (state, tokens) {
      console.log('[USER-MUTATION] - refreshToken()')
      state.tokens.access_token = tokens.access_token
      state.tokens.refresh_token = tokens.refresh_token
    },
    updateUser (state, user) {
      console.log('[USER-MUTATION] - updateUser()')
      state.user = user
    }
  },
  actions: {
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
    async refreshToken ({ commit, state }) {
      console.log('[USER-ACTION] - refreshToken()')
      await server.get(`auth/yahoo/refresh?refresh_token=${state.tokens.refresh_token}`)
        .then((response) => {
          console.log('refreshToken Response: ', response.data)
          Vue.$cookies.set('access_token', response.data.access_token)
          commit('refreshToken', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    async refreshStateWithCookies ({ commit, dispatch }, tokens) {
      console.log('[USER-ACTION] - refreshStateWithCookies()')
      commit('updateTokens', tokens)
      await dispatch('loginToScad')
    },
    async loginToScad ({ state, commit }) {
      console.log('[USER-ACTION] - loginToScad()')
      try {
        const res = await scad(
          state.tokens.access_token,
          state.tokens.id_token)
          .get('/user')
        commit('updateUser', res.data)
      } catch (err) {
        console.error(JSON.stringify(err))
      }
    }
  }
}
