
export default {
  namespaced: true,
  state: {
    registerLeagueInvites: false,
    editDraftPick: false,
    addCapExemption: false,
    editCapExemption: false,
    renewLeague: false,
    playerHistory: false,
    importUpdatedSalaries: false
  },
  getters: {
  },
  mutations: {
    editDraftPick (state) {
      state.editDraftPick = !state.editDraftPick
    },
    addCapExemption (state) {
      state.addCapExemption = !state.addCapExemption
    },
    editCapExemption (state) {
      state.editCapExemption = !state.editCapExemption
    },
    registerLeagueInvites (state) {
      state.registerLeagueInvites = !state.registerLeagueInvites
    },
    renewLeague (state) {
      state.renewLeague = !state.renewLeague
    },
    playerHistory (state) {
      // console.log('playerHistory dialog')
      state.playerHistory = !state.playerHistory
    },
    importUpdatedSalaries (state) {
      state.importUpdatedSalaries = !state.importUpdatedSalaries
    }
  },
  actions: {

  }
}
