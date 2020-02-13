// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import { server } from '../../utilities/axios-server'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    user: {},
    firstName: '',
    lastName: '',
    email: '',
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
          console.log(response.data)
          commit('refreshToken', response.data)
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    async refreshStateWithCookies ({ commit, dispatch }, tokens) {
      console.log('[USER-ACTION] - refreshStateWithCookies()')
      commit('updateTokens', tokens)
      // dispatch('loginToScad')
    },
    async loginToScad ({ state, commit }) {
      console.log('[USER-ACTION] - loginToScad()')
      const options = {
        method: 'GET',
        headers: {
          'access_token': `${state.tokens.access_token}`,
          'id_token': `${state.tokens.id_token}`,
          'Authorization': 'Basic dXxERLUVfGhQNhKxabNoRvNzBW8J8Gju76YNMNvG2+A=' },
        url: `user`
      }
      await scad(options)
        .then((response) => {
          console.log(response.data)
          commit('updateUser', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
