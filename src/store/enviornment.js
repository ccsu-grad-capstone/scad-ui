/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'

export default {
  namespaced: true,
  state: {
    enviornment: {}
  },
  getters: {

  },

  mutations: {
    initializeEnviornmentFromProcess (state) {
      Object.keys(process.env).forEach(key => {
        state.environment[key] = process.env[key]
      })
    },
    setEnviornmentVariable (state, { key, value }) {
      state.environment[key] = value
    }
  },
  actions: {

  }
}
