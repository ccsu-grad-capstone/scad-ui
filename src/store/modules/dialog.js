// import { notify } from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import axios from 'axios'
// import { server } from '../../utilities/axios-server'
import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    registerLeagueInvites: false
  },
  getters: {
    getField
  },
  mutations: {
    updateField
  },
  actions: {

  }
}
