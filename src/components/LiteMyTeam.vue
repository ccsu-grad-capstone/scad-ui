<template lang="pug">
  .q-pa-sm
    .text-h6.text-weight-bolder My Team
    q-table(
      :data='myScadTeam.players',
      :columns='columns',
      row-key='playerName',
      :pagination.sync="pagination",
      hide-bottom,
      flat
      dense
      square
      )

      template(v-slot:body='props')
        q-tr(:props='props')
          q-td {{getPos(props.row.yahooLeaguePlayerId)}}
          q-td(key='playerName' :props='props')
            .row.full-width
              .col-2
                q-avatar(size="30px")
                  img(:src="getPlayerPic(props.row.yahooLeaguePlayerId)" style="width: 80%")
              .column.justify-center.q-pl-sm.text-body2.text-weight-bold
                .row.full-width
                  | {{getPlayerName(props.row.yahooLeaguePlayerId)}}
          q-td.text-primary.text-weight-bolder.text-center ${{props.row.salary}}
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
          label: 'Pos',
          align: 'center',
          field: row => row.yahooLeaguePlayerId,
          format: val => `${this.getPos(val)}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          headerClasses: 'bg-grey-4 text-grey-8'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player',
          align: 'left',
          field: row => row.yahooLeaguePlayerId,
          format: val => `${this.getPlayerName(val)}`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-grey-4 text-grey-8'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary',
          align: 'center',
          field: row => row.salary,
          format: val => `$${val}`,
          sortable: true,
          headerClasses: 'bg-grey-4 text-grey-8'
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
    getPlayerPic (id) {
      return `${getYahooPlayer(this.myYahooTeam.players, id).headshot.url}`
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
</style>
