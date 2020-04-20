// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import axios from 'axios'
// import { node } from '../../utilities/axios-node'
// import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    registerLeagueInvites: false,
    editDraftPick: false,
    addCapExemption: false,
    editCapExemption: false
  },
  getters: {
    // getField
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
    }
  },
  actions: {

  }
}
