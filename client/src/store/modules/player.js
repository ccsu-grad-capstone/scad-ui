// import { notify } from '../../utilities/nofity'
import { scad } from '../../utilities/axiosScad'

export default {
  namespaced: true,
  state: {
    id: '',
    salary: ''
  },
  getters: {

  },

  mutations: {
    updatePlayer (state, player) {
      console.log(`[PLAYER-MUTATION] - updatePlayer()`)
      state.id = player.id
      state.salary = player.salary // <- ??
    },
    logoutPlayer (state) {
      console.log('[PLAYER-MUTATION] - logoutPlayer()')
      state.id = ''
      state.salary = ''
    }
  },
  actions: {
    async updatePlayer ({ commit, rootState }, player) {
      console.log(`[PLAYER-ACTION] - updatePlayer(${player.id})`)
      try {
        const res = await scad(
          rootState.user.tokens.access_token,
          rootState.user.tokens.id_token)
          .put(`/scadleague/player/${player.id}`, player)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
