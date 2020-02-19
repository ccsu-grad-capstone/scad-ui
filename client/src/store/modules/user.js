// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'
import axios from 'axios'
import { server } from '../../utilities/axios-server'

export default {
  namespaced: true,
  state: {
    // hard coded user information for now..
    user: {
      'at_hash': 'sXP6ji1r8zQXttarp8z2Ow',
      'sub': '2OMLCT3C2A42Z3FCGWJZCIDYLU',
      'email_verified': true,
      'birthdate': '1990',
      'iss': 'https://api.login.yahoo.com',
      'profile_images': {
        'image64': 'https://s.yimg.com/ag/images/5877/59490392552_ac9b6a_64sq.jpg',
        'image192': 'https://s.yimg.com/ag/images/5877/59490392552_ac9b6a_192sq.jpg',
        'image128': 'https://s.yimg.com/ag/images/5877/59490392552_ac9b6a_128sq.jpg',
        'image32': 'https://s.yimg.com/ag/images/5877/59490392552_ac9b6a_32sq.jpg' },
      'given_name': 'Ryan',
      'locale': 'en-US',
      'nonce': '446951',
      'picture': 'https://s.yimg.com/ag/images/5877/59490392552_ac9b6a_192sq.jpg',
      'aud': 'dj0yJmk9a1pBOHVpblRxME9PJmQ9WVdrOVpFaDZWVmxyTkcwbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWE3',
      'auth_time': 1581523697,
      'nickname': 'Ryan',
      'name': 'Ryan Lauzon',
      'session_exp': 1582733297,
      'exp': 1582074180,
      'iat': 1582070580,
      'family_name': 'Lauzon',
      'email': 'lauzon232@yahoo.com' },
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
        headers: {
          'access_token': `${state.tokens.access_token}`,
          'id_token': `${state.tokens.id_token}`,
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic c2NhZC1hcGktcmVhZHdyaXRlOnNjYWQtYXBpLXJlYWR3cml0ZQ==' }
      }
      await scad.get('/user', options)
        .then((response) => {
          console.log(response.data)
          commit('updateUser', response.data)
        })
        .catch(error => {
          console.log(error)
          console.error(JSON.stringify(error))
        })
    }
  }
}
