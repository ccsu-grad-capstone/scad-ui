<template lang="pug">
  .q-pa-sm.col-xs-4
    .text-h6.text-weight-bolder Standings
    q-table(
      :data='yahooTeams',
      :columns='columns',
      row-key='name',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      )
      template(v-slot:body-cell-name='props' auto-width)
        q-td(:props='props')
          .row.full-width.q-py-xs
            .col-2
              q-avatar(size="27px")
                img(:src="props.row.team_logos[0].url")
            .column.justify-center.text-weight-bold.q-pl-sm
              router-link(:to="{ path: `/team/${props.row.team_id}`}") {{props.row.name}}
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

</template>

<script>
/* eslint-disable eqeqeq */

export default {
  name: 'LiteLeagueMobile',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'give',
          required: true,
          label: 'Give:',
          align: 'left',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'recieve',
          required: true,
          label: 'Rec:',
          align: 'left',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'left',
          headerClasses: 'bg-grey-4'
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
      let team = this.scadTeams.find(t => t.yahooTeamId == id)
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
      let team = this.scadTeams.find(t => t.yahooTeamId == id)
      return team.exceptionOut
    },
    getTeamRecieve (id) {
      let team = this.scadTeams.find(t => t.yahooTeamId == id)
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
    width: 100px
</style>
