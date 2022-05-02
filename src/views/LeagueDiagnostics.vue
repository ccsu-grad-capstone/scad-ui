<template lang="pug">
  q-page
    .row.full-width.justify-center
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        .row.full-width.q-pa-md.items-center
          .text-h4.text-weight-bolder League Diagnostics
        .row.full-width.gt-sm.q-pa-sm
          .text-subtitle2.text-grey A diagnostic will iterate through each team and confirm it's adhering to all specific SCAD settings. Results are shown below.  Any issues are shown in red.
        .row.full-width.q-pa-sm.q-gutter-between
          .col.text-subtitle2.text-grey Last Run: {{ lastChecked }}
          .col.q-gutter-sm.text-right
              q-btn( size='sm' color='primary' label='Run Diagnostics' @click='runDiagnostics()')
              q-btn( v-if="illegalRosterExists() && checkIfCommish()" size='sm' color='info' label='Email Illegal Lineups' @click='sendDiagnosticTeamIssueEmail()')
        loading(v-if="!loaded && running" :message="'Running Diagnostics, this may take a moment..'")
        q-table(
          v-else
          :data='teams',
          :columns='columns',
          row-key='name',
          :pagination.sync="pagination",
          hide-bottom,
          dense,
          flat,
          square
          )
          template(v-slot:body-cell-rank='props' auto-width)
            q-td(:props='props' auto-width)
              | {{getTeamRank(props.row.yahooTeam.team_standings)}}
          template(v-slot:body-cell-name='props' auto-width)
            q-td(:props='props')
              .row.full-width.q-py-xs
                .column
                  q-avatar(size="27px")
                    img(:src="props.row.yahooTeam.team_logos[0].url")
                .column.justify-center.text-weight-bold.q-pl-sm
                  router-link(:to="{ path: `/team/${props.row.yahooTeam.team_id}`}") {{props.row.yahooTeam.name}}
          template(v-slot:body-cell-manager='props')
            q-td(:props='props' auto-width)
              .text-grey {{props.row.yahooTeam.managers[0].nickname}}
          template(v-slot:body-cell-qb='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-body.text-grey-5 {{ scadSettings.qbMin }} | #[span.qty(v-bind:class="{ 'text-negative': !checkPos('qb', scadSettings, props.row.yahooTeam.roster) }") {{props.row.qb}}] | {{ scadSettings.qbMax }}
          template(v-slot:body-cell-wr='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-body.text-grey-5 {{ scadSettings.wrMin }} | #[span.qty(v-bind:class="{ 'text-negative': !checkPos('wr', scadSettings, props.row.yahooTeam.roster) }") {{props.row.wr}}] | {{ scadSettings.wrMax }}
          template(v-slot:body-cell-rb='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-body.text-grey-5 {{ scadSettings.rbMin }} | #[span.qty(v-bind:class="{ 'text-negative': !checkPos('rb', scadSettings, props.row.yahooTeam.roster) }") {{props.row.rb}}] | {{ scadSettings.rbMax }}
          template(v-slot:body-cell-te='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-body.text-grey-5 {{ scadSettings.teMin }} | #[span.qty(v-bind:class="{ 'text-negative': !checkPos('te', scadSettings, props.row.yahooTeam.roster) }") {{props.row.te}}] | {{ scadSettings.teMax }}
          template(v-slot:body-cell-def='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-body.text-grey-5 {{ scadSettings.defMin }} | #[span.qty(v-bind:class="{ 'text-negative': !checkPos('def', scadSettings, props.row.yahooTeam.roster) }") {{props.row.def}}] | {{ scadSettings.defMax }}
          template(v-slot:body-cell-ir='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-body.text-negative.text-weight-bold(v-if="props.row.ir") {{ props.row.ir}}
              q-icon.q-pa-xs(v-else name='fas fa-check' color='primary' size='xs')
          template(v-slot:body-cell-salary='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-primary.text-weight-bolder(v-if="checkTeamSalary(props.row.yahooTeam.team_id) >= 0") ${{getTeamSalary(props.row.yahooTeam.team_id)}}
              .text-negative.text-weight-bolder(v-else) ${{getTeamSalary(props.row.yahooTeam.team_id)}}
          template(v-slot:body-cell-status='props')
            q-td.bg-grey-1(:props='props' auto-width)
              .text-weight-bolder.text-positive(v-bind:class="{ 'text-negative': !runStatusCheck(props.row) }") {{displayStatus(props.row)}}
</template>

<script>
/* eslint-disable eqeqeq */
import { checkPos, checkIfCommish } from '../utilities/validators'
import { getPosCount } from '../utilities/calculator'
import Loading from '../components/Loading'

export default {
  name: 'LeagueDiagnostics',
  components: {
    'loading': Loading
  },
  data () {
    return {
      loaded: false,
      running: false,
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
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'name',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'manager',
          required: true,
          label: 'Manager:',
          align: 'left',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'qb',
          required: true,
          label: 'QB:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'wr',
          required: true,
          label: 'WR:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'rb',
          required: true,
          label: 'RB:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'te',
          required: true,
          label: 'TE:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'def',
          required: true,
          label: 'DEF:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'ir',
          required: true,
          label: 'IR:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'left',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'status',
          required: true,
          label: 'Status:',
          align: 'left',
          headerClasses: 'bg-grey-4'
        }
      ]
    }
  },
  computed: {
    checkPos () {
      return checkPos
    },
    getPosCount () {
      return getPosCount
    },
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
    },
    teams () {
      return this.$store.state.diagnostics.teams
    },
    lastChecked () {
      return this.$store.state.diagnostics.lastChecked
    }
  },

  async mounted () {
    // this.$store.dispatch('diagnostics/getDiagnostic')
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
    runStatusCheck (team) {
      if (team) {
        if (
          this.isBetween(this.scadSettings.qbMin, this.scadSettings.qbMax, team.qb) &&
          this.isBetween(this.scadSettings.wrMin, this.scadSettings.wrMax, team.wr) &&
          this.isBetween(this.scadSettings.rbMin, this.scadSettings.rbMax, team.rb) &&
          this.isBetween(this.scadSettings.teMin, this.scadSettings.teMax, team.te) &&
          this.isBetween(this.scadSettings.defMin, this.scadSettings.defMax, team.def) &&
          !team.ir &&
          team.salary <= this.scadSettings.teamSalaryCap
        ) { return true } else { return false }
      } else return false
    },
    displayStatus (team) {
      if (team) {
        if (this.runStatusCheck(team)) return 'PASSED'
        else return 'FAILED'
      } else return false
    },
    isBetween (min, max, num) {
      if (min <= num && max >= num) { return true } else { return false }
    },
    async runDiagnostics () {
      this.running = true
      await this.$store.dispatch('diagnostics/runDiagnostics')
      this.loaded = true
    },
    async sendDiagnosticTeamIssueEmail () {
      await this.$store.dispatch('diagnostics/sendDiagnosticTeamIssueEmail')
    },
    illegalRosterExists () {
      if (this.teams.find(t => t.passedStatusCheck === false)) return true
      else return false
    },
    checkIfCommish () {
      return checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)
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
  .qty
    font-weight: bold
    color: #000000
  .status
    font-weight: bold
</style>
