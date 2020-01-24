import { notify } from '../../utilities/nofity'
import axios from 'axios'

const bcrypt = require('bcryptjs')

export default {
  namespaced: true,
  state: {
    firstName: 'null',
    lastName: null,
    email: null,
    active: true,
    isAdmin: false
  },
  getters: {
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
      return axios.post(`http://localhost:8080/scadservices/api/user`, { user })
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
      return axios.get(`http://localhost:8080/scadservices/api/user?email=${user.email}`)
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
          console.log(error)
          notify.loginFailed()
        })
        .finally(function () {
        // always executed
        })
    }
  }
}
