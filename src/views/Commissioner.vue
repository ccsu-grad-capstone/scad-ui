<template lang="pug">
  q-page
    loading(v-if="!loaded" :message="'Getting Commissioner Details'")
    .row.full-width.justify-center(v-else)
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        q-card(flat square)
          q-card-section
            .row.full-width.q-gutter-between
              .col
                .text-h4.text-weight-bolder.gt-xs Commissioner Settings
                .text-h6.text-weight-bolder.lt-sm Commissioner Settings
          q-list(bordered separator)
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Yahoo! League Name:
                .col.text-body1.q-pl-lg.text-weight-bolder
                  | {{yahooLeagueDetails.name}}
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Renew SCAD League:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div
                    div.q-gutter-sm()
                      q-btn(v-if="user.user.guid === '2OMLCT3C2A42Z3FCGWJZCIDYLU' && league.renewedAvailable" label="Renew League" color="primary" size="sm" @click="triggerRenewLeague()")
                      q-btn(v-else disable label="Not Available" color="grey" size="sm")
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Import Updated Salaries:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div.q-gutter-sm()
                    q-btn(label="import here" color="primary" size="sm" @click="openImportUpdatedSalaries()")
                  import-updated-salaries-dialog(v-if="importUpdatedSalaries")
                .col.q-pl-md
                  .text-caption Upload csv file with updated salaries and SCAD will adjust all players salaries for this league accordingly.
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Prepare Data:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div
                    div.q-gutter-sm()
                      q-badge(v-if="processing" label="processing..." color="info")
                      q-btn(v-if="!processing && lineupData.length === 0" label="Prepare Data" color="primary" size="sm" @click="getLineupData()")
                      q-btn(v-if="checkToLogEOYSalaries(league.yahooLeagueDetails, transaction.endOfSeasonPlayerHistory)" label="Log end of year salaries" size="sm", color = "primary" @click="logSalaries()")
                      q-btn(v-if="!checkToLogEOYSalaries(league.yahooLeagueDetails, transaction.endOfSeasonPlayerHistory) && !processing" disable label="Prepared" color="grey" size="sm")
                    import-updated-salaries-dialog(v-if="importUpdatedSalaries")
                .col.q-pl-md
                  .text-caption In order to export league details, SCAD needs to prepare the data. Click here to do so.  This will take a few moments..
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Export League:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div
                    div.q-gutter-sm()
                      download-excel.gt-sm( v-if="!processing && lineupData.length > 0" :data="lineupData", :fields="lineupFields" :name="getLineupExportName(league.yahooLeagueDetails.name)" type="csv")
                        q-btn(label="Export" color="primary" size="sm")
                      q-btn(v-else disable label="Export" color="grey" size="sm")
                .col.q-pl-md
                  .text-caption Exports all rosters into a csv file.  To be used as a backup, or for further processing.
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Export Players For Corrections:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div
                    div.q-gutter-sm()
                      download-excel.gt-sm( v-if="!processing && lineupData.length > 0" :data="playersData", :fields="playersFields" :name="getPlayersExportName(league.yahooLeagueDetails.name)" type="csv")
                        q-btn(label="Export" color="primary" size="sm")
                      q-btn(v-else disable label="Export" color="grey" size="sm")
                .col.q-pl-md
                  .text-caption Exports a list of all rostered players into a csv file.  File can be used to update players salaries during offseason via the Import Updated Salaries option above.
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Export Draft Picks:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div
                    div.q-gutter-sm()
                      download-excel.gt-sm( v-if="!processing && draftPicks.draftPicks.length > 0" :data="draftPicks.draftPicks", :fields="dpFields" :name="getDpExportName(league.yahooLeagueDetails.name)" type="csv")
                        q-btn(label="Export" color="primary" size="sm")
                      q-btn(v-else disable label="Export" color="grey" size="sm")
                .col.q-pl-md
                  .text-caption Exports a list of all draft picks into a csv file.
            q-item()
              .row.full-width.q-pl-lg
                .column.justify-center.col-4.text-body1.text-left
                  | Export Cap Exemptions:
                .column.justify-center.text-body1.q-pl-lg.text-weight-bolder
                  div
                    div.q-gutter-sm()
                      download-excel.gt-sm( v-if="!processing && capExemptions.capExemptions.length > 0" :data="capExemptions.capExemptions", :fields="ceFields" :name="getCeExportName(league.yahooLeagueDetails.name)" type="csv")
                        q-btn(label="Export" color="primary" size="sm")
                      q-btn(v-else disable label="Export" color="grey" size="sm")
                .col.q-pl-md
                  .text-caption Exports a list of all cap exemptions into a csv file.

</template>

<script>

import referenceData from '../utilities/referenceData'
// import notify from '../utilities/nofity'
import Loading from '../components/Loading'
import moment from 'moment'
import { catchAxiosError } from '../utilities/catchAxiosErrors'
import { checkIfCommish, checkToLogEOYSalaries } from '../utilities/validators'
import importUpdatedSalariesDialog from '../components/dialogs/importUpdatedSalariesDialog'
import { getDisplayPosition } from '../utilities/functions'

/* eslint-disable eqeqeq */

export default {
  name: 'Commissioner',
  components: {
    'loading': Loading,
    'import-updated-salaries-dialog': importUpdatedSalariesDialog

  },
  data () {
    return {
      loaded: false,
      scadSettings: {},
      processing: false,
      lineupData: [],
      playersData: [],
      playersFields: {
        'name': 'yahooPlayer.name.full',
        'prevSalary': 'scadPlayer.salary',
        'wasFranchiseTagged': 'scadPlayer.isFranchiseTag',
        '_id': 'scadPlayer._id',
        'scadLeagueId': 'scadPlayer.scadLeagueId',
        'yahooLeagueId': 'scadPlayer.yahooLeagueId',
        'yahooPlayerId': 'yahooPlayer.player_id',
        'adjustment': 0,
        'newSalary': 0
      },
      lineupFields: {
        'Team Name': 'yahooTeam.name',
        'Manager': 'yahooTeam.manager',
        'QB1': 'players.QB1',
        'QB2': 'players.QB2',
        'QB3': 'players.QB3',
        'QB4': 'players.QB4',
        'QB5': 'players.QB5',
        'RB1': 'players.RB1',
        'RB2': 'players.RB2',
        'RB3': 'players.RB3',
        'RB4': 'players.RB4',
        'RB5': 'players.RB5',
        'RB6': 'players.RB6',
        'RB7': 'players.RB7',
        'RB8': 'players.RB8',
        'RB9': 'players.RB9',
        'RB10': 'players.RB10',
        'WR1': 'players.WR1',
        'WR2': 'players.WR2',
        'WR3': 'players.WR3',
        'WR4': 'players.WR4',
        'WR5': 'players.WR5',
        'WR6': 'players.WR6',
        'WR7': 'players.WR7',
        'WR8': 'players.WR8',
        'WR9': 'players.WR9',
        'WR10': 'players.WR10',
        'WR11': 'players.WR11',
        'TE1': 'players.TE1',
        'TE2': 'players.TE2',
        'TE3': 'players.TE3',
        'TE4': 'players.TE4',
        'TE5': 'players.TE5',
        'TE6': 'players.TE6',
        'DEF1': 'players.DEF1',
        'DEF2': 'players.DEF2',
        'DEF3': 'players.DEF3'
      },
      dpFields: {
        'Year': 'year',
        'Round': 'rd',
        'Pick': 'pick',
        'Owner': 'team.name',
        'Original Owner': 'originalTeam.name',
        'Comments': 'comments'
      },
      ceFields: {
        'Year': 'year',
        'Giving Team': 'yahooTeamGive.name',
        'Recieving Team': 'yahooTeamRecieve.name',
        'Amount': 'amount',
        'Comments': 'comments'
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    moment () { return moment },
    referenceData () { return referenceData },
    settings () { return this.league.scadSettings },
    scadLeagues () { return this.league.scadLeagues },
    yahooLeagueDetails () { return this.league.yahooLeagueDetails },
    scadLeagueId () { return this.league.scadLeagueId },
    checkIfCommish () { return checkIfCommish },
    user () { return this.$store.state.user },
    league () { return this.$store.state.league },
    transaction () { return this.$store.state.transactions },
    team () { return this.$store.state.team },
    capExemptions () { return this.$store.state.capExemptions },
    draftPicks () { return this.$store.state.draftPicks },
    diagnostics () { return this.$store.state.diagnostics },
    checkToLogEOYSalaries () { return checkToLogEOYSalaries },
    importUpdatedSalaries () { return this.$store.state.dialog.importUpdatedSalaries },
    renewLeague () { return this.$store.state.dialog.renewLeague }
  },
  methods: {
    async init () {
      // await this.$store.dispatch('league/getAllScadLeagues')
      this.scadSettings = JSON.parse(JSON.stringify(this.settings))
      this.loaded = true
    },
    getLineupExportName (name) {
      return `${name}_Lineups_${moment().format('lll')}.xls`
    },
    getPlayersExportName (name) {
      return `${name}_Players_${moment().format('lll')}.xls`
    },
    getDpExportName (name) {
      return `${name}_DraftPicks_${moment().format('lll')}.xls`
    },
    getCeExportName (name) {
      return `${name}_CapExemptions_${moment().format('lll')}.xls`
    },
    openImportUpdatedSalaries () { this.$store.commit('dialog/importUpdatedSalaries') },
    async getLineupData () {
      this.processing = true

      try {
        let leaguePlayers = []
        // LINEUP
        for (var yt of this.league.yahooTeams) {
          let st = this.league.scadTeams.find(st => st.yahooTeamId == yt.team_id)
          await this.$store.dispatch('team/getTeam', { yahooLeagueId: this.league.yahooLeagueId, yahooTeamId: yt.team_id })
          await this.$store.dispatch('capExemptions/getCapExemptionsByTeam', { teamId: yt.team_id })

          let yahooPlayers = this.team.yahooTeam.roster

          let playersNames = {}
          let salaries = {}
          let positions = ['QB', 'WR', 'RB', 'TE', 'DEF']

          for (let i = 0; i < positions.length; i++) {
            let players = yahooPlayers.filter(p => getDisplayPosition(p.display_position) === positions[i])
            for (let j = 0; j < players.length; j++) {
              let sp = this.team.scadTeam.roster.find(player => player.yahooPlayerId == players[j].player_id)
              if (sp) {
                this.playersData.push({ scadPlayer: sp, yahooPlayer: players[j] })
                playersNames[`${positions[i]}${j + 1}`] = players[j].name.full
                salaries[`${positions[i]}${j + 1}`] = sp.salary ? sp.salary : 0
              }
            }
          }

          let team = { players: playersNames, yahooTeam: this.team.yahooTeam }
          team.yahooTeam.manager = team.yahooTeam.managers[0].nickname
          salaries.overallSalary = st.salary

          console.log(this.playersData)
          leaguePlayers.push(team.yahooTeam.roster)
          this.lineupData.push(team)
          this.lineupData.push({ players: salaries })
          this.lineupData.push([])
        }

        await this.$store.dispatch('draftPicks/getDraftPicksByLeague')
        await this.$store.dispatch('capExemptions/getCapExemptionsByLeague')

        this.processing = false
      } catch (error) {
        catchAxiosError(error)
      }
    },
    async logSalaries () {
      await this.$store.dispatch('player/logAllPlayersEndOfYearSalary')
    },
    triggerRenewLeague () {
      this.$store.commit('dialog/renewLeague')
    }
  }
}
</script>

<style lang="stylus" scoped>
.settings-width
  width: 1100px
</style>
