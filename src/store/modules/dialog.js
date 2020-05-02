// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import axios from 'axios'
// import { node } from '../../utilities/axios-node'

export default {
  namespaced: true,
  state: {
    registerLeagueInvites: false,
    editDraftPick: false,
    addCapExemption: false,
    editCapExemption: false
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
    }
  },
  actions: {

  }
}
