// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import { server } from '../../utilities/axios-server'

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
    loginUser (state, user) {
      console.log('[USER-MUTATION] - loginUser()')
      state.firstName = user.firstName
      state.lastName = user.lastName
      state.email = user.email
      state.active = true
      if (user.isAdmin) {
        state.isAdmin = true
      }
    },
    logoutUser (state) {
      console.log('[USER-MUTATION] - logoutUser()')
      // eslint-disable-next-line no-unused-expressions
      state.firstName = null
      state.lastName = null
      state.email = null
      state.active = false
      state.admin = false
    },
    clearTokens (state) {
      state.tokens.access_token = ''
      state.tokens.refresh_token = ''
      state.tokens.id_token = ''
      state.active = false
    },
    updateTokens (state, tokens) {
      console.log('[USER-MUTATION] - updateTokens()')
      state.tokens.access_token = tokens.access_token
      state.tokens.refresh_token = tokens.refresh_token
      state.tokens.id_token = tokens.id_token
      state.active = true
    },
    refreshToken (state, tokens) {
      console.log('[USER-MUTATION] - updateTokens()')
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
      await server.get('auth/yahoo')
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
    async updateUser ({ commit, dispatch }, tokens) {
      console.log('[USER-ACTION] - updateUser()')
      commit('updateTokens', tokens)
      dispatch('loginToScad')
    },
    async loginToScad ({ state, commit }) {
      console.log('[USER-ACTION] - loginToScad()')
      const options = {
        method: 'GET',
        headers: {
          'access_token': `${state.access_token}`,
          'username': 'scad-api-readwrite',
          'password': 'scad-api-readwrite' },
        url: `user/${state.tokens.id_token}`
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
