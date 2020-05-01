<template lang="pug">
  .q-pa-sm.table-width
    .text-h6.text-weight-bolder Standings
    q-table(
      :data='yahooTeams',
      :columns='columns',
      row-key='name',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      )
      template(v-slot:body-cell-rank='props' auto-width)
        q-td(:props='props' auto-width)
          | {{getTeamRank(props.row.team_standings.team_standings.rank)}}
      template(v-slot:body-cell-name='props' auto-width)
        q-td(:props='props')
          .row.full-width.q-py-xs
            .col-2
              q-avatar(size="27px")
                img(:src="props.row.team_logos[0].team_logo.url")
            .column.justify-center.text-weight-bold.q-pl-sm
              router-link(:to="{ path: `/team/${props.row.team_id}`}") {{props.row.name}}
      template(v-slot:body-cell-manager='props')
        q-td(:props='props' auto-width)
          .text-grey {{props.row.managers[0].manager.nickname}}
      template(v-slot:body-cell-give='props')
        q-td(:props='props' auto-width)
          //- .text-grey-8.text-weight-bold() ${{getTeamGive(props.row.team_id)}}
          .text-grey-8.text-weight-bold(v-if="checkTeamCEGive(props.row.team_id) > 5") ${{getTeamGive(props.row.team_id)}}
          .text-warning.text-weight-bold(v-else) ${{getTeamGive(props.row.team_id)}}
      template(v-slot:body-cell-recieve='props')
        q-td(:props='props' auto-width)
          //- .text-grey-8.text-weight-bold() ${{getTeamRecieve(props.row.team_id)}}
          .text-grey-8.text-weight-bold(v-if="checkTeamCERecieve(props.row.team_id) > 5") ${{getTeamRecieve(props.row.team_id)}}
          .text-warning.text-weight-bold(v-else) ${{getTeamRecieve(props.row.team_id)}}
      template(v-slot:body-cell-salary='props')
        q-td(:props='props' auto-width)
          .text-positive.text-weight-bolder(v-if="checkTeamSalary(props.row.team_id) > 5") ${{getTeamSalary(props.row.team_id)}}
          .text-negative.text-weight-bolder(v-else-if="checkTeamSalary(props.row.team_id) < 0") ${{getTeamSalary(props.row.team_id)}}
          .text-warning.text-weight-bolder(v-else) ${{getTeamSalary(props.row.team_id)}}
    .row.full-width.q-pt-xs.justify-center
      .text-caption.text-grey Salaries and cap exemptions may appear off with Yahoo updates..
      q-btn(size='sm' color='accent' label='Click here to update' flat dense @click='updateTeamSalaries()' icon="sync")

</template>

<script>
/* eslint-disable eqeqeq */

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
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'name',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false,
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'manager',
          required: true,
          label: 'Manager:',
          align: 'left',
          sortable: false,
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'record',
          required: true,
          label: 'Record:',
          align: 'left',
          field: row => row.team_standings.team_standings.outcome_totals,
          format: val => `${val.wins}-${val.losses}-${val.ties}`,
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'give',
          required: true,
          label: 'Give:',
          align: 'left',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'recieve',
          required: true,
          label: 'Rec:',
          align: 'left',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'left',
          headerClasses: 'bg-grey-3'
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
    },
    scadSettings () {
      return this.league.scadSettings
    }
  },
  methods: {
    getTeamSalary (id) {
      let team = this.scadTeams.find(t => t.yahooLeagueTeamId == id)
      return team.salary
    },
    checkTeamSalary (id) {
      let salary = this.getTeamSalary(id)
      return this.scadSettings.teamSalaryCap - salary
    },
    checkTeamCEGive (id) {
      let ce = this.getTeamGive(id)
      return this.scadSettings.salaryCapExemptionLimit - ce
    },
    checkTeamCERecieve (id) {
      let ce = this.getTeamRecieve(id)
      return this.scadSettings.salaryCapExemptionLimit - ce
    },
    getTeamGive (id) {
      let team = this.scadTeams.find(t => t.yahooLeagueTeamId == id)
      return team.exceptionOut
    },
    getTeamRecieve (id) {
      let team = this.scadTeams.find(t => t.yahooLeagueTeamId == id)
      return team.exceptionIn
    },
    getTeamRank (rank) {
      if (rank) {
        return rank
      } else {
        return '-'
      }
    },
    async updateTeamSalaries () {
      this.$emit('updateTeamSalaries')
    }
  }

}
</script>

<style lang="stylus" scoped>
  a
    color: #000000
    text-decoration: none
  .table-width
    width: 600px
</style>
