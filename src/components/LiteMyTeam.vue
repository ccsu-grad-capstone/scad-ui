<template lang="pug">
  .q-pa-sm
    .text-h6.text-weight-bolder My Team
    q-table(
      :data='myScadTeam.players',
      :columns='columns',
      row-key='playerName',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      )
      template(v-slot:body='props')
        q-tr(:props='props')
          q-td {{getPos(props.row.yahooLeaguePlayerId)}}
          q-td.text-weight-bold {{getPlayerName(props.row.yahooLeaguePlayerId)}}
          q-td.text-grey {{getNFLTeam(props.row.yahooLeaguePlayerId)}}
          q-td.text-primary.text-weight-bolder ${{props.row.salary}}
</template>

<script>

import { getYahooPlayer } from '../utilities/functions'

export default {
  name: 'LiteMyTeam',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0,
        sortBy: 'salary',
        descending: true
      },
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'Pos:',
          align: 'left',
          field: row => row.yahooLeaguePlayerId,
          format: val => `${this.getPos(val)}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          style: 'width: 10px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          field: row => row.yahooLeaguePlayerId,
          format: val => `${this.getPlayerName(val)}`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 250px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'nflTeam',
          required: true,
          label: 'Team:',
          align: 'left',
          field: row => row.yahooLeaguePlayerId,
          format: val => `${this.getNFLTeam(val)}`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 250px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'left',
          field: row => row.salary,
          format: val => `$${val}`,
          sortable: true,
          headerClasses: 'bg-grey-3',
          style: 'width: 50px'
        }
      ]
    }
  },
  computed: {
    team () {
      return this.$store.state.team
    },
    myYahooTeam () {
      return this.team.myYahooTeam
    },
    myScadTeam () {
      return this.team.myScadTeam
    }
  },
  methods: {
    getPos (id) {
      return getYahooPlayer(this.myYahooTeam.players, id).display_position
    },
    getPlayerName (id) {
      return `${getYahooPlayer(this.myYahooTeam.players, id).name.full}`
    },
    getNFLTeam (id) {
      return `${getYahooPlayer(this.myYahooTeam.players, id).editorial_team_full_name}`
    }
  }

}
</script>

<style lang="stylus" scoped>
  a
    color: #000000
    text-decoration: none
  .table-width
    width: 40%
</style>
