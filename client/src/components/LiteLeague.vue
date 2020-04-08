<template lang="pug">
  .q-pa-md(style="width: 50%")
    .text-h6.text-weight-bolder Standings
    q-table(
      :data='yahooTeams',
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
                img(:src="props.row.team_logos[0].team_logo.url")
            .column.justify-center.text-weight-bold.q-pl-sm
              router-link(:to="{ path: `/team/${props.row.team_id}`}") {{props.row.name}}
      template(v-slot:body-cell-manager='props')
        q-td(:props='props')
          .text-grey {{props.row.managers[0].manager.nickname}}
      template(v-slot:body-cell-salary='props')
        q-td(:props='props')
          .text-primary.text-weight-bolder ${{getTeamSalary(props.row.team_id)}}
</template>

<script>

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
          align: 'left',
          label: 'Rank',
          field: row => row.team_standings.team_standings.rank,
          format: val => `${val}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          style: 'width: 10px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'name',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 200px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'manager',
          required: true,
          label: 'Manager:',
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
          align: 'center',
          field: row => row.team_standings.team_standings.outcome_totals,
          format: val => `${val.wins}-${val.losses}-${val.ties}`,
          sortable: false,
          headerClasses: 'bg-grey-3',
          style: 'max-width: 100px'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'center',
          field: row => row.team_id,
          // format: val => `$${this.getTeamSalary(val)}`,
          sortable: false,
          headerClasses: 'bg-grey-3',
          style: 'max-width: 100px'
        }
      ]
    }
  },
  computed: {
    league () {
      return this.$store.state.league
    },
    yahooTeams () {
      return this.league.yahooTeams
    },
    scadTeams () {
      return this.league.scadTeams
    }
  },
  methods: {
    getTeamSalary (id) {
      // eslint-disable-next-line eqeqeq
      let team = this.scadTeams.find(t => t.yahooLeagueTeamId == id)
      return team.salary
    }
  }

}
</script>

<style lang="stylus" scoped>
  a
    color: #000000
    text-decoration: none
</style>
