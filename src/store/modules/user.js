import { notify } from '../../utilities/nofity'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    fName: 'null',
    lName: null,
    email: null,
    active: true,
    admin: false
  },
  getters: {
  },

  mutations: {
    loginUser (state, user) {
      console.log('[USER-MUTATION] - loginUser()')
      state.fName = user.fName
      state.lName = user.lName
      state.email = user.email
      state.active = true
    },
    logoutUser (state) {
      console.log('[USER-MUTATION] - logoutUser()')
      // eslint-disable-next-line no-unused-expressions
      state.fName = null
      state.lName = null
      state.email = null
      state.active = false
      state.admin = false
    }
  },
  actions: {
    registerUser ({ commit }, user) {
      console.log('[USER-ACTION] - loginUser()')
      // make call to API here to register user

      // if registration was successful, login user
      commit('loginUser', user)
    },
    loginUser ({ commit }, user) {
      console.log('[USER-ACTION] - loginUser()')
      console.log(user)
      axios.get(`http://localhost:8080/scadservices/api/user/${user.email}`)
        .then(function (response) {
        // handle success
          console.log(response)
        })
        .catch(function (error) {
        // handle error
          console.log(error)
        })
        .finally(function () {
        // always executed
        })

      if (user.email === 'admin@gmail.com' && user.password === 'admin') {
        let admin = {
          fName: 'admin',
          lName: 'admin',
          email: user.email,
          active: true,
          admin: true
        }
        commit('loginUser', admin)
        notify.loginSuccessful()
        this.$router.push({
          path: '/'
        })
      } else {
        notify.loginFailed()
        this.$router.push({
          path: '/login'
        })
        // commit('loginUser', user)b
      }
    },
    logoutUser ({ commit }) {
      console.log('[USER-ACTION] - logoutUser()')
      // make call to API here to logout user?

      commit('logoutUser')
      this.$router.push({
        path: '/'
      })
    }
  }
}
