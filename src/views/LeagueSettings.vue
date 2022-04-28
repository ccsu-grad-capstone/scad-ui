<template lang="pug">
  q-page
    loading(v-if="!loaded" :message="'Getting League Details'")
    .row.full-width.justify-center(v-else)
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        q-card(flat square)
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
                .column.justify-center.col-5.text-body1.text-left
                  | Yahoo! League Name:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  | {{yahooLeagueDetails.name}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Yahoo! League Id:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  | {{scadSettings.yahooLeagueId}}
            q-item.mobile-hide(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Yahoo! League Homepage:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  a(:href='yahooLeagueDetails.url') {{yahooLeagueDetails.url}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Run Diagnostic Daily:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  q-toggle(v-if="editing" filled dense v-model='scadSettings.runDiagnosticDailyDuringSeason')
                  q-toggle(v-else disable filled dense v-model='scadSettings.runDiagnosticDailyDuringSeason')
                .col.q-pl-md
                  .text-caption SCAD will run a diagnostic check on all teams in league to confirm all leagues rules and regulations are followed. Will send email out to commissioner (always) and manager (if selected below)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Email Managers With Illegal Lineups:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  q-toggle(v-if="editing" filled dense v-model='scadSettings.emailManagersWithIllegalLineup')
                  q-toggle(v-else disable filled dense v-model='scadSettings.emailManagersWithIllegalLineup')
                .col.q-pl-md
                  .text-caption SCAD will email each manager when diagnostic is complete if there's an issue with their roster. By default, commissioner will be CC'd on all emails. Edit emails below.
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Managers Emails:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  q-btn(v-if="!editing" color="white" text-color="primary" flat label = "Edit Managers Emails" @click="editEmails = true" dense)
                  q-btn(v-else color="white" text-color="primary" flat label = "Edit Managers Emails" @click="editEmails = true" disable dense)
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Rookie Draft Rounds:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.rookieDraftRds' :options='referenceData.rookieDraftRounds')
                  div(v-else) {{scadSettings.rookieDraftRds}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Rookie Draft Strategy:
                .col-3.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.rookieDraftStrategy' :options='referenceData.rookieDraftStrategy')
                  div(v-else) {{scadSettings.rookieDraftStrategy}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Rookie Wage Scale:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.rookieWageScale' :options='referenceData.rookieWageScale')
                  div(v-else) {{scadSettings.rookieWageScale}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Team Salary Cap:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.teamSalaryCap' :options='referenceData.teamSalaryCap()')
                  div(v-else) ${{scadSettings.teamSalaryCap}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | League Salary Cap:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  div ${{leagueSalaryCap()}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Salary Cap Exemption Limit:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.salaryCapExemptionLimit' :options='referenceData.salaryCapExemptionLimit()')
                  div(v-else) ${{scadSettings.salaryCapExemptionLimit}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | IR Relief Percentage:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.irReliefPerc' :options='referenceData.irReliefPerc()')
                  div(v-else) {{scadSettings.irReliefPerc}}%
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Franchise Tag Discount:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.franchiseTagDiscount' :options='referenceData.franchiseTagDiscount()')
                  div(v-else) ${{scadSettings.franchiseTagDiscount}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Franchise Tag Spots:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.franchiseTagSpots' :options='referenceData.franchiseTags')
                  div(v-else) {{scadSettings.franchiseTagSpots}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Franchise Tag Deadline:
                .col-4.text-body1.q-pl-lg.text-weight-bolder
                  div(v-if="editing")
                    q-input(filled v-model='scadSettings.franchiseTagDeadline' mask='date' dense :rules="['date']")
                      template(v-slot:append)
                        q-icon.cursor-pointer(name='event')
                          q-popup-proxy(ref='qDateProxy' cover transition-show='scale' transition-hide='scale')
                            q-date(v-model='scadSettings.franchiseTagDeadline')
                              .row.items-center.justify-end
                                q-btn(v-close-popup label='Close' color='primary' flat)
                  div(v-else) {{moment(scadSettings.franchiseTagDeadline).format('LL')}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
                  | Year Limit on Trading Draft Picks in Advance:
                .col-2.text-body1.q-pl-lg.text-weight-bolder
                  q-select(v-if="editing" filled dense v-model='scadSettings.tradingDraftPickYears' :options='referenceData.tradingDraftPickYears')
                  div(v-else) {{scadSettings.tradingDraftPickYears}}
            q-item(clickable)
              .row.full-width.q-pl-lg
                .column.justify-center.col-5.text-body1.text-left
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
                .column.justify-center.col-5.text-body1.text-left
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
                .column.justify-center.col-5.text-body1.text-left
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
                .column.justify-center.col-5.text-body1.text-left
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
                .column.justify-center.col-5.text-body1.text-left
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
                .column.justify-center.col-5.text-body1.text-left
                  | DEF Roster Limits:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  .row.align-center
                    q-select(v-if="editing" filled dense v-model='scadSettings.defMin' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.defMin }}
                    .text-caption (min),
                    q-select(v-if="editing" filled dense v-model='scadSettings.defMax' :options='referenceData.rosterLimits')
                    div(v-else) {{ scadSettings.defMax }}
                    .text-caption (max)
        edit-emails-dialog(v-if="editEmails" @close="editEmails = false")

</template>

<script>

import referenceData from '../utilities/referenceData'
import { checkIfCommish } from '../utilities/validators'
// import notify from '../utilities/nofity'
import Loading from '../components/Loading'
import EditEmailsDialog from '../components/dialogs/EditEmailsDialog'
import moment from 'moment'

export default {
  name: 'RegisterLeague',
  components: {
    'loading': Loading,
    'edit-emails-dialog': EditEmailsDialog
  },
  data () {
    return {
      loaded: false,
      scadSettings: {},
      editing: false,
      editEmails: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    moment () { return moment },
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
