import { notify } from '../../utilities/nofity'
import { api } from '../../boot/axios'

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
    registerUser ({ commit }, user) {
      console.log('[USER-ACTION] - loginUser()')
      user.password = bcrypt.hashSync(user.password, 8)
      return api.post(`/user`, { user })
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
      return api.get(`/user?email=${user.email}`)
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
