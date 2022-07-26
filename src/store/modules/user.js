import Vue from 'vue'
import { api } from '../../utilities/axios-node'

import { catchAxiosError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    user: {},
    isAdmin: false,
    active: false,
    offseason: false,
    defaultLeague: {},
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
      state.isAdmin = user.isAdmin
      state.active = true
    },
    offseason (state) {
      state.offseason = true
    },
    setDefaultLeague (state, league) {
      state.defaultLeague = league
    }
  },
  actions: {

    // refresh tokens with OAuth
    async refreshToken ({ commit, state }) {
      console.log('[USER-ACTION] - refreshToken()')

      await api(
        state.tokens.access_token,
        state.tokens.id_token)
        .get(`auth/yahoo/refresh?refresh_token=${state.tokens.refresh_token}`)
        .then((response) => {
          Vue.$cookies.set('access_token', response.data.access_token)
          commit('refreshToken', response.data)
        })
        .catch(error => {
          commit('logoutUser')
          console.error(error)
          // catchAxiosError(error)
        })
    },
    async updateUser ({ state, commit }) {
      try {
        const res = await api(
          state.tokens.access_token,
          state.tokens.id_token)
          .get('/user/details')
        commit('updateUser', res.data.user)
        console.log('[USER-ACTION] - updateUser(): ', res.data.user)
      } catch (error) {
        catchAxiosError(error)
      }
    },
    async setDefaultLeague ({ state, commit }, league) {
      console.log('setDefaultLeague', league)
      try {
        const res = await api(
          state.tokens.access_token,
          state.tokens.id_token)
          .put(`/udl/update/${league.yahooGame.game_key}/${league.yahooLeagueId}/${league.scadLeagueId}`)
        commit('setDefaultLeague', res.data.udl)
        console.log('[USER-ACTION] - setDefaultLeague(): ', res.data)
      } catch (error) {
        catchAxiosError(error)
      }
    }
  }
}
