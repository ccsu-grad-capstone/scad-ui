
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
