import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axios-scad'

const bcrypt = require('bcryptjs')

export default {
  namespaced: true,
  state: {
    firstName: 'Ryan',
    lastName: 'Lauzon',
    email: 'admin@admin.com',
    active: true,
    isAdmin: false
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
    }
  },
  actions: {
    // loginWithYahoo (state, commit) {
    //   console.log('[USER-MUTATION] - loginWithYahoo()')
    //   return scad.get('https://scad.login.yahoo.com/oauth2/request_auth?client_id=dj0yJmk9dG5YTU9UMHBpQWJ6JmQ9WVdrOWVFMWxWbk5yTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTgz&response_type=code&redirect_uri=https://localhost:8081/login&scope=openid%20fspt-w&nonce=YihsFwGKgt3KJUh6tPs2')
    // },
    loginWithYahoo (state, commit) {
      console.log('[USER-MUTATION] - loginWithYahoo()')
      return scad.post('https://api.login.yahoo.com/oauth2/request_auth', {
        client_id: 'dj0yJmk9dG5YTU9UMHBpQWJ6JmQ9WVdrOWVFMWxWbk5yTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTgz',
        redirect_uri: 'http://localhost:8081/dashboard',
        response_type: 'code',
        scope: 'openid fspt-w',
        nonce: 'nonce=YihsFwGKgt3KJUh6tPs2'
      })
    },
    registerUser ({ commit }, user) {
      console.log('[USER-ACTION] - loginUser()')
      user.password = bcrypt.hashSync(user.password, 8)
      return scad.post(`/user`, { user })
        .then(function (response) {
        // handle success
        // check if registration was successful
          commit('loginUser', response.data)
          notify.loginSuccessful()
        })
        .catch(function (error) {
        // handle error
          console.log(error)
          notify.loginFailed()
        })
        .finally(function () {
        // always executed
        })
    },
    loginUser ({ commit }, user) {
      console.log('[USER-ACTION] - loginUser()')
      console.log(user)
      return scad.get(`/user?email=${user.email}`)
        .then(function (response) {
        // handle success
          if (bcrypt.compareSync(user.password, response.data.password)) {
          // check if login was successful
            commit('loginUser', response.data)
            notify.loginSuccessful()
          }
        })
        .catch(function (error) {
          // handle error
          console.log('loginUser() error: ', error)
          notify.loginFailed()
        })
        .finally(function () {
        // always executed
        })
    }
  }
}
