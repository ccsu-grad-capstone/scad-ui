/* eslint-disable eqeqeq */
// import notify from '../../utilities/nofity'
// import { scad } from '../../utilities/axios-scad'
// import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'
// import { calcTeamSalary, getPosCount } from '../../utilities/calculator'

export default {
  namespaced: true,
  state: {
    lastUpdatedDate: undefined,
    transactions: [
      { name: '1',
        transaction_data: {
          type: 'add',
          source_type: 'waivers',
          destination_type: 'team',
          destination_team_key: '399.l.13088.t.5',
          destination_team_name: 'jamest1728'
        }
      },
      { name: '2',
        transaction_data: {
          type: 'add',
          source_type: 'waivers',
          destination_type: 'team',
          destination_team_key: '399.l.13088.t.5',
          destination_team_name: 'jamest1728'
        }
      }
    ]
  },
  getters: {

  },

  mutations: {

  },
  actions: {

  }
}
