<template lang="pug">
  q-page
    .row.full-width(v-if="!loaded")
      .row.full-width.justify-center
        q-circular-progress.q-mt-xl(
          indeterminate
          size="90px"
          :thickness="0.2"
          color="primary"
          center-color="grey-5"
          track-color="transparent"
          class="q-ma-md"
          )
      .row.full-width.justify-center
        .text-grey Fetching SCAD settings...
    .row.full-width.justify-center(v-else)
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        q-card.q-pa-md.q-ma-lg
          q-card-section
            .row.full-width.q-gutter-between
              .col
                .text-h4.text-weight-bolder.gt-xs League Settings
                .text-h6.text-weight-bolder.lt-sm League Settings
              div.q-pt-sm(v-if="checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)")
                q-btn(v-if="!editing" label='Edit Settings' dense color='primary' text-color='white' size='sm' @click="editing = true")
                div.q-gutter-md(v-else)
                  q-btn( label='Cancel' dense color='secondary' text-color='primary' size='sm' @click="cancel()")
                  q-btn( label='Save Settings' dense color='primary' text-color='white' size='sm' @click="save()")
          q-list(bordered separator)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Yahoo! League Name:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  | {{yahooLeagueDetails.name}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Yahoo! League Id:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  | {{scadSettings.yahooLeagueId}}
            q-item.mobile-hide(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Yahoo! League Homepage:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  a(:href='yahooLeagueDetails.url') {{yahooLeagueDetails.url}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Rookie Draft Rounds:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.rookieDraftRds' :options='referenceData.rookieDraftRounds')
                  div(v-else) {{scadSettings.rookieDraftRds}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Rookie Draft Strategy:
                .col-3.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.rookieDraftStrategy' :options='referenceData.rookieDraftStrategy')
                  div(v-else) {{scadSettings.rookieDraftStrategy}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Rookie Wage Scale:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.rookieWageScale' :options='referenceData.rookieWageScale')
                  div(v-else) {{scadSettings.rookieWageScale}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Team Salary Cap:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.teamSalaryCap' :options='referenceData.teamSalaryCap()')
                  div(v-else) ${{scadSettings.teamSalaryCap}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | League Salary Cap:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  div ${{leagueSalaryCap()}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Salary Cap Exemption Limit:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.salaryCapExemptionLimit' :options='referenceData.salaryCapExemptionLimit()')
                  div(v-else) ${{scadSettings.salaryCapExemptionLimit}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | IR Relief Percentage:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.irReliefPerc' :options='referenceData.irReliefPerc()')
                  div(v-else) {{scadSettings.irReliefPerc}}%
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Franchise Tag Discount:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.franchiseTagDiscount' :options='referenceData.franchiseTagDiscount()')
                  div(v-else) ${{scadSettings.franchiseTagDiscount}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Franchise Tag Spots:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.franchiseTagSpots' :options='referenceData.franchiseTags')
                  div(v-else) {{scadSettings.franchiseTagSpots}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | Year Limit on Trading Draft Picks in Advance:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.tradingDraftPickYears' :options='referenceData.tradingDraftPickYears')
                  div(v-else) {{scadSettings.tradingDraftPickYears}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | QB Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.qbMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.qbMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.qbMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.qbMax }}
                    .text-caption (max)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | WR Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.wrMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.wrMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.wrMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.wrMax }}
                    .text-caption (max)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | RB Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.rbMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.rbMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.rbMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.rbMax }}
                    .text-caption (max)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | TE Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.teMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.teMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.teMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.teMax }}
                    .text-caption (max)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | K Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.kMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.kMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.kMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.kMax }}
                    .text-caption (max)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .col-5.text-body1.text-left
                  | DEF Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.defMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.defMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.defMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.defMax }}
                    .text-caption (max)

</template>

<script>

import referenceData from '../utilities/referenceData'
import { checkIfCommish } from '../utilities/validators'
// import notify from '../utilities/nofity'

export default {
  name: 'RegisterLeague',
  components: {
  },
  data () {
    return {
      loaded: false,
      scadSettings: {},
      editing: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    referenceData () {
      return referenceData
    },
    league () {
      return this.$store.state.league
    },
    settings () {
      return this.league.scadSettings
    },
    scadLeagues () {
      return this.league.scadLeagues
    },
    yahooLeagueDetails () {
      return this.league.yahooLeagueDetails
    },
    scadLeagueId () {
      return this.league.scadLeagueId
    },
    checkIfCommish () { return checkIfCommish }
  },
  methods: {
    async init () {
      // await this.$store.dispatch('league/getAllScadLeagues')
      this.scadSettings = JSON.parse(JSON.stringify(this.settings))
      this.loaded = true
    },
    async save () {
      await this.$store.dispatch('league/saveLeagueSettings', { settings: this.scadSettings })
      this.init()
      this.editing = false
    },
    cancel () {
      console.log('CANCEL')
      this.init()
      this.editing = false
    },
    leagueSalaryCap () {
      if (this.scadSettings.teamSalaryCap === this.settings.teamSalaryCap) {
        return this.scadSettings.leagueSalaryCap
      } else {
        this.scadSettings.leagueSalaryCap = this.scadSettings.teamSalaryCap * this.yahooLeagueDetails.num_teams
        return this.scadSettings.leagueSalaryCap
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.settings-width
  width: 1100px
</style>
