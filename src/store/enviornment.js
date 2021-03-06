/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { nodeHeader } from '../../utilities/axios-node'
// import { catchAxiosNodeError } from '../../utilities/catchAxiosErrors'

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
