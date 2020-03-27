<template lang="pug">
  .q-pa-md(style="width: 50%")
    .text-h6.text-weight-bolder Standings
    q-table(
      :data='league.standings.teams.team',
      :columns='columns',
      row-key='name',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      )
      template(v-slot:body-cell-name='props')
        q-td(:props='props')
          .row.full-width
            .col-2
              q-avatar(size="25px")
                img(:src="props.row.team_logos.team_logo.url")
            .column.justify-center {{props.row.name}}
      template(v-slot:body-cell-name='props')
        q-td(:props='props')
          .row.full-width
            .col-2
              q-avatar(size="25px")
                img(:src="props.row.team_logos.team_logo.url")
            .column.justify-center
              router-link(:to="{ path: `team:${props.row.team_key}`}") {{props.row.name}}

</template>

<script>
import { mapRoster, mapTeam } from '../utilities/helpers/teamHelper'

export default {
  name: 'LiteLeague',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'rank',
          required: true,
          align: 'right',
          field: row => row.team_standings.rank,
          format: val => `${val}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'name',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 200px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'record',
          required: true,
          label: 'Record:',
          align: 'left',
          field: row => row.team_standings.outcome_totals,
          format: val => `${val.wins}-${val.losses}-${val.ties}`,
          sortable: false,
          headerClasses: 'bg-grey-3',
          style: 'max-width: 100px'
        },
        {
          name: 'win-percentage',
          required: true,
          label: 'Salary',
          align: 'left',
          // field: row => row.team_standings.outcome_totals,
          format: val => `${val}`,
          sortable: false,
          headerClasses: 'bg-grey-3',
          style: 'max-width: 100px'
        }
      ]
    }
  },
  computed: {
    team () {
      return this.$store.state.roster.team
    },
    roster () {
      return this.$store.state.roster.roster
    },
    league () {
      return this.$store.state.league.yahooLeague
    }
  },
  methods: {
    getPlayers () {
      return mapRoster(this.roster)
    },
    getTeam () {
      return mapTeam(this.team)
    }
  }

}
</script>

<style lang="stylus" scoped>
  .scad-team-settings
    text: $h2
    color: $blue-1
    background-color: $grey-5
</style>
