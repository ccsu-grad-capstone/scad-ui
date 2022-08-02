<template lang="pug">
  q-page
    .row.full-width.justify-center
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        .row.full-width.q-pa-md
          div.text-h4.text-weight-bolder Draft Picks
          q-space
        .row.full-width.q-px-md.gt-sm
          .text-subtitle2.text-grey  List of draft picks for drafting incoming rookies for next {{scadSettings.tradingDraftPickYears}} years.  Each rookie draft is {{scadSettings.rookieDraftRds}} rounds.  Each year, all owners are given {{scadSettings.rookieDraftRds}} picks, 1 for each round. Pick value for each draft pick is entered upon completion of fantasy season.
        .row.full-width.justify-center.q-py-sm
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select( filled dense label="Owner" stack-label v-model='filter.team' :options='filteredTeams')
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select( filled dense label="Year" stack-label v-model='filter.year' :options='referenceData.draftPickYearsFilter(this.scadSettings.seasonYear, this.scadSettings.tradingDraftPickYears)')
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select( filled dense label="Round" stack-label v-model='filter.rd' :options='referenceData.rounds')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")
        loading(v-if="!loaded" :message="'Fetching SCAD draft picks...'")
        .row.justify-center.full-width.bg-white.q-py-lg(v-else-if="loaded && getDraftPicksByLeagueError")
          .row.full-width.justify-center.text-caption.text-grey-7 Issue getting draft picks try:
          .row.full-width.justify-center: q-btn.q-pa-xs(label='Refresh' color='secondary' text-color='primary' size='md' @click="getDraftPicks()")
        .row.full-width.q-pa-xs(v-else)
          div(style="width:100%")
            q-table(
              :data='filteredPicks',
              :columns='columns',
              row-key= '_id',
              :pagination.sync="pagination",
              dense,
              no-data-label='Click the button above to create draft picks'
              square
              flat
            )
              template(v-slot:body-cell-edit='props')
                q-td.q-pr-md(:props='props' auto-width)
                  q-btn(size='xs' color='accent' round dense @click='editPick(props.row)' icon="edit")
              template(v-slot:body-cell-year='props')
                q-td(:props='props' auto-width)
                  div.q-pr-sm {{ props.row.year }}
              template(v-slot:body-cell-rd='props')
                q-td(:props='props' auto-width)
                  div.q-pr-sm {{ props.row.rd }}
              template(v-slot:body-cell-pick='props')
                q-td(:props='props' auto-width)
                  div(:class="formatPick(props.row)") {{ getPick(props.row) }}
              template(v-slot:body-cell-cost='props')
                q-td.bg-grey-2(:props='props' auto-width)
                  div.text-weight-bolder.text-primary {{ getCost(props.row) }}
              template(v-slot:body-cell-condition='props')
                q-td(:props='props' auto-width)
                  q-icon(v-if="props.row.hasCondition" name='fas fa-exclamation' color='negative' size='xs')
              template(v-slot:body-cell-owner='props')
                q-td(:props='props' auto-width :class="myTeamDPCEStyle(getTeamGuid(props.row.team), user.user.guid)")
                  div.q-pr-lg.text-weight-bold {{ getTeamName(props.row.team, yahooTeams) }}
              template(v-slot:body-cell-originalOwner='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg.text-grey {{ getTeamName(props.row.originalTeam, yahooTeams) }}
        edit-draft-pick-dialog(v-if="editDraftPick" :dp="edit.dp" @saved="getDraftPicks")
</template>

<script>
import referenceData from '../utilities/referenceData'
import editDraftPickDialog from '../components/dialogs/editDraftPickDialog'
import { myTeamDPCEStyle, displayPick } from '../utilities/formatters'
import { getTeamGuid, getTeamName } from '../utilities/functions'
import Loading from '../components/Loading'
import moment from 'moment'

/* eslint-disable eqeqeq */

export default {
  name: 'DraftPicks',
  components: {
    'edit-draft-pick-dialog': editDraftPickDialog,
    'loading': Loading

  },

  data () {
    return {
      pages: 42,
      loaded: false,
      edit: {
        visable: false,
        dp: {}
      },
      filter: {
        team: '',
        year: '',
        rd: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: this.pag // 0 means all rows
      },
      columns: [
        {
          name: 'edit',
          label: '',
          align: 'left'
        },
        {
          name: 'year',
          required: true,
          label: 'Year:',
          align: 'left',
          sortable: false
        },
        {
          name: 'rd',
          required: true,
          label: 'Rd:',
          align: 'left',
          sortable: false
        },
        {
          name: 'pick',
          required: true,
          label: 'Pick:',
          align: 'left',
          sortable: false
        },
        {
          name: 'cost',
          required: false,
          label: 'Cost:',
          align: 'left',
          sortable: false
        },
        {
          name: 'condition',
          required: false,
          label: '',
          align: 'left'
        },
        {
          name: 'owner',
          required: true,
          label: 'Owner:',
          align: 'left'
        },
        {
          name: 'originalOwner',
          required: true,
          label: 'Original Owner',
          align: 'left'
        },
        {
          name: 'comments',
          label: 'Comments',
          align: 'left',
          field: row => row.comments,
          format: val => `${val}`,
          style: 'color: grey'

        }
      ]
    }
  },
  mounted () {
    this.pagination.rowsPerPage = this.scadSettings.rookieDraftRds * this.yahooLeagueDetails.num_teams
    this.getDraftPicks()
  },
  computed: {
    moment () { return moment },
    myTeamDPCEStyle () {
      return myTeamDPCEStyle
    },
    displayPick () {
      return displayPick
    },
    user () {
      return this.$store.state.user
    },
    draftPicks () {
      return this.$store.state.draftPicks.draftPicks
    },
    getDraftPicksByLeagueError () { return this.$store.state.draftPicks.getDraftPicksByLeagueError },
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    leagueId () {
      return this.$store.state.league.yahooLeagueId
    },
    scadSettings () {
      return this.$store.state.league.scadSettings
    },
    yahooLeagueDetails () {
      return this.$store.state.league.yahooLeagueDetails
    },
    referenceData () {
      return referenceData
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    },
    editDraftPick () {
      return this.$store.state.dialog.editDraftPick
    },
    myYahooTeamId () {
      return this.$store.state.team.myYahooTeamId
    },
    getTeamGuid () {
      return getTeamGuid
    },
    getTeamName () {
      return getTeamName
    },
    isDuringSeason () { return moment().isBetween(this.yahooLeagueDetails.start_date, this.yahooLeagueDetails.end_date) },
    filteredPicks () {
      var filtered = this.draftPicks
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'team') {
            filtered = filtered.filter(dp => getTeamGuid(dp.team) === getTeamGuid(this.filter.team))
          } else {
            filtered = filtered.filter(dp => dp[key] === this.filter[key])
          }
        }
      })
      // Sort by year and by pick
      let sorted = filtered.sort(function (a, b) {
        if (a.rd === b.rd && a.year === b.year) {
          return a.pick > b.pick ? 1 : a.pick < b.pick ? -1 : 0
        } else if (a.year === b.year) {
          return a.rd > b.rd ? 1 : a.rd < b.rd ? -1 : 0
        }
      })

      let noFilter = (!this.filter.team && !this.filter.year && !this.filter.rd)
      let filterOnNextYearsPicks = this.scadSettings.seasonYear + 1 === this.filter.year

      // Sort by current standings for next year's dps during season
      if ((noFilter || filterOnNextYearsPicks) && this.isDuringSeason) {
        if (filterOnNextYearsPicks) {
          return this.sortPicks(sorted)
        } else {
          let draftPickYearCount = parseInt(this.scadSettings.rookieDraftRds) * parseInt(this.yahooLeagueDetails.num_teams)
          let start = this.yahooLeagueDetails.renew ? draftPickYearCount : 0
          let end = this.yahooLeagueDetails.renew ? draftPickYearCount * 2 : draftPickYearCount
          return sorted.slice(0, start).concat(this.sortPicks(sorted.slice(start, end))).concat(sorted.slice(end))
        }
      } else return sorted
    }
  },
  methods: {
    sortPicks (picks) {
      let dps = []
      let rd = 1
      let reverseStandings = this.yahooTeams.slice().reverse()
      while (rd <= this.scadSettings.rookieDraftRds) {
        for (const team of reverseStandings) {
          dps.push(picks.find(p => getTeamGuid(team) === getTeamGuid(p.originalTeam) && p.rd == rd))
        }
        rd++
      }
      return dps
    },
    getTeamIndex (dp) {
      let i = this.yahooTeams.findIndex(t => getTeamGuid(t) === getTeamGuid(dp.originalTeam))
      console.log(i)
      return i
    },
    async getDraftPicks () {
      if (this.draftPicks.length < 1) await this.$store.dispatch('draftPicks/getDraftPicksByLeague')
      this.loaded = true
    },
    editPick (dp) {
      this.edit.dp = dp
      this.$store.commit('dialog/editDraftPick')
    },
    clearFilter () {
      this.filter.team = ''
      this.filter.year = ''
      this.filter.rd = ''
    },
    isNextYearsDp (dp) {
      return this.scadSettings.seasonYear + 1 === dp.year && this.isDuringSeason
    },
    getPick (dp) {
      if (dp) {
        if (dp.pick) return dp.pick
        else if (this.isNextYearsDp(dp)) {
          let reverseStandings = this.yahooTeams.slice().reverse()
          let i = reverseStandings.findIndex(t => getTeamGuid(t) === getTeamGuid(dp.originalTeam))
          return `(${i + 1})`
        }
      }
    },
    formatPick (dp) {
      return {
        'text-grey': this.isNextYearsDp(dp) && !dp.pick
      }
    },
    getCost (dp) {
      if (dp) {
        if (dp.pick) {
          if (dp.rd === 1) return `$${this.scadSettings.rdOneRookieWages[dp.pick - 1]}`
          else if (dp.rd === 2) return `$${this.scadSettings.rdTwoRookieWages[dp.pick - 1]}`
          else if (dp.rd === 3) return '$1'
          else return '-'
        } else if (this.isNextYearsDp(dp)) {
          let reverseStandings = this.yahooTeams.slice().reverse()
          let i = reverseStandings.findIndex(t => getTeamGuid(t) === getTeamGuid(dp.originalTeam))
          if (dp.rd === 1) return `$${this.scadSettings.rdOneRookieWages[i]}`
          else if (dp.rd === 2) return `$${this.scadSettings.rdTwoRookieWages[i]}`
          else if (dp.rd === 3) return '$1'
          else return '-'
        } else return '-'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.draft-picks-width
  width: 1100px

</style>
