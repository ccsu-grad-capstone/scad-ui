import Vue from 'vue'
import { nodeHeader, node } from '../../utilities/axios-node'

import { catchAxiosScadError, catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

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

    // refresh tokens with OAuth
    async refreshToken ({ commit, state }) {
      console.log('[USER-ACTION] - refreshToken()')

      await node.get(`auth/yahoo/refresh?refresh_token=${state.tokens.refresh_token}`)
        .then((response) => {
          Vue.$cookies.set('access_token', response.data.access_token)
          commit('refreshToken', response.data)
        })
        .catch(error => {
          catchAxiosNodeError(error)
        })
    },
    async updateUser ({ state, commit }) {
      try {
        const res = await nodeHeader(
          state.tokens.access_token,
          state.tokens.id_token)
          .get('/user/details')
        commit('updateUser', res.data.user)
        console.log('[USER-ACTION] - updateUser(): ', res.data.user)
      } catch (error) {
        catchAxiosScadError(error)
      }
    }
  }
}
