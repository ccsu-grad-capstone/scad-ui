// import { notify } from '../../utilities/nofity'
// import { nodeHeader } from '../../utilities/axios-node'
// import axios from 'axios'
// import { node } from '../../utilities/axios-node'

export default {
  namespaced: true,
  state: {
    registerLeagueInvites: false,
    editDraftPick: false,
    addCapExemption: false,
    editCapExemption: false,
    renewLeague: false,
    playerHistory: false
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
    }
  },
  actions: {

  }
}
