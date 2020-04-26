<template lang="pug">
  .q-pa-sm.table-width
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
      // eslint-disable-next-line eqeqeq
      let player = this.myYahooTeam.players.find(p => p.player_id == id)
      return player.display_position
    },
    getPlayerName (id) {
      // eslint-disable-next-line eqeqeq
      let player = this.myYahooTeam.players.find(p => p.player_id == id)
      return `${player.name.full}`
    },
    getNFLTeam (id) {
      // eslint-disable-next-line eqeqeq
      let player = this.myYahooTeam.players.find(p => p.player_id == id)
      return `${player.editorial_team_full_name}`
    }
  }

}
</script>

<style lang="stylus" scoped>
  a
    color: #000000
    text-decoration: none
  .table-width
    width: 500px
</style>
