<template lang="pug">
  div.q-gutter-sm(v-if="checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)")
    q-badge(v-if="processing" label="processing..." color="info")
    q-btn(v-if="!processing && lineupData.length === 0" label="Prepare Data" color="primary" size="xs" @click="getLineupData()")
    download-excel.gt-sm( v-if="!processing && lineupData.length > 0" :data="lineupData", :fields="lineupFields" :name="getLineupExportName(league.yahooLeagueDetails.name)" type="csv")
      q-btn(label="Export League" color="primary" size="xs")
    download-excel.gt-sm( v-if="!processing && draftPicks.draftPicks.length > 0" :data="draftPicks.draftPicks", :fields="dpFields" :name="getDpExportName(league.yahooLeagueDetails.name)" type="csv")
      q-btn(label="Export Draft Picks" color="primary" size="xs")
    download-excel.gt-sm( v-if="!processing && capExemptions.capExemptions.length > 0" :data="capExemptions.capExemptions", :fields="ceFields" :name="getCeExportName(league.yahooLeagueDetails.name)" type="csv")
      q-btn(label="Export Cap Exemptions" color="primary" size="xs")
</template>

<script>

import moment from 'moment'
import { catchAxiosNodeError } from '../utilities/catchAxiosErrors'
import { checkIfCommish } from '../utilities/validators'
// import { getScadPlayer } from '../utilities/functions'

/* eslint-disable eqeqeq */

export default {

  name: 'ExportLeague',
  components: {
  },
  data () {
    return {
      processing: false,
      lineupData: [],
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
  computed: {
    user () { return this.$store.state.user },
    league () { return this.$store.state.league },
    team () { return this.$store.state.team },
    capExemptions () { return this.$store.state.capExemptions },
    draftPicks () { return this.$store.state.draftPicks },
    diagnostics () { return this.$store.state.diagnostics },
    checkIfCommish () { return checkIfCommish }

  },
  methods: {
    getLineupExportName (name) {
      return `${name}_Lineups_${moment().format('lll')}.xls`
    },
    getDpExportName (name) {
      return `${name}_DraftPicks_${moment().format('lll')}.xls`
    },
    getCeExportName (name) {
      return `${name}_CapExemptions_${moment().format('lll')}.xls`
    },

    async getLineupData () {
      this.processing = true
      try {
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
            let players = yahooPlayers.filter(p => p.display_position === positions[i])
            for (let j = 0; j < players.length; j++) {
              let sp = this.team.scadTeam.roster.find(player => player.yahooPlayerId == players[j].player_id)
              playersNames[`${positions[i]}${j + 1}`] = players[j].name.full
              salaries[`${positions[i]}${j + 1}`] = sp.salary
            }
          }

          let team = { players: playersNames, yahooTeam: this.team.yahooTeam }
          team.yahooTeam.manager = yt.managers[0].manager.nickname
          salaries.overallSalary = st.salary

          this.lineupData.push(team)
          this.lineupData.push({ players: salaries })
          this.lineupData.push([])
        }

        await this.$store.dispatch('draftPicks/getDraftPicksByLeague')
        await this.$store.dispatch('capExemptions/getCapExemptionsByLeague')

        this.processing = false
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  a
    color: $info
    text-decoration: none
</style>
