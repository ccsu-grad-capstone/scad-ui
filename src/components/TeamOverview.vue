<template lang="pug">
  .q-px-md
    .text-weight-bold(:class="countStyle(getPlayerCount())") Roster Availability: {{getPlayerCount()}}/{{rosterLimit}}
    q-markup-table(v-if="loaded" dense, flat, square)
      thead
        tr
          th POS
          th Count
          th Salary
          th Percent
      tbody
        tr
          td.pos QB
          td.text-body.text-grey-5 {{ scadSettings.qbMin }} | #[span.qty(v-bind:class="{ 'text-red': !checkPos('qb') }") {{getPosCount('QB')}}] | {{ scadSettings.qbMax }}
          td ${{getPositionSalaryTotal('QB')}}
          td {{getPerc('QB')}}%
        tr
          td.pos WR
          td.text-body.text-grey-5 {{ scadSettings.wrMin }} | #[span.qty(v-bind:class="{ 'text-red': !checkPos('wr') }") {{getPosCount('WR')}}] | {{ scadSettings.wrMax }}
          td ${{getPositionSalaryTotal('WR')}}
          td {{getPerc('WR')}}%
        tr
          td.pos RB
          td.text-body.text-grey-5 {{ scadSettings.rbMin }} | #[span.qty(v-bind:class="{ 'text-red': !checkPos('rb') }") {{getPosCount('RB')}}] | {{ scadSettings.rbMax }}
          td ${{getPositionSalaryTotal('RB')}}
          td {{getPerc('RB')}}%
        tr
          td.pos TE
          td.text-body.text-grey-5 {{ scadSettings.teMin }} | #[span.qty(v-bind:class="{ 'text-red': !checkPos('te') }") {{getPosCount('TE')}}] | {{ scadSettings.teMax }}
          td ${{getPositionSalaryTotal('TE')}}
          td {{getPerc('TE')}}%
        tr(v-if="scadSettings.kMin >0")
          td.pos K
          td.text-body.text-grey-5 {{ scadSettings.kMin }} | #[span.qty(v-bind:class="{ 'text-red': !checkPos('k') }") {{getPosCount('K')}}] | {{ scadSettings.kMax }}
          td ${{getPositionSalaryTotal('K')}}
          td {{getPerc('K')}}%
        tr
          td.pos DEF
          td.text-body.text-grey-5 {{ scadSettings.defMin }} | #[span.qty(v-bind:class="{ 'text-red': !checkPos('def') }") {{getPosCount('DEF')}}] | {{ scadSettings.defMax }}
          td ${{getPositionSalaryTotal('DEF')}}
          td {{getPerc('DEF')}}%
    .col.full-width.text-center.q-pa-xs.text-grey.text-caption {{yahooTeam.name}} roster overview

</template>

<script>
import notify from '../utilities/nofity'
import referenceData from '../utilities/referenceData'
import { calcTeamSalary, getPosCount, getPlayerCount, getPositionSalaryTotal, getPerc } from '../utilities/calculator'
import { getLeagueRosterLimit } from '../utilities/functions'
import { checkPos, checkIRCount, checkCovidCount } from '../utilities/validators'

export default {
  name: 'TeamOverview',
  props: {
    yahooTeamId: String,
    yahooTeam: Object,
    scadTeam: Object
  },
  data () {
    return {
      salary: 0,
      rosterLimit: 0,
      loaded: false,
      scadTeamClone: {},
      detailColumns: [
        {
          name: 'pos',
          label: 'Pos:',
          align: 'left'
        },
        {
          name: 'count',
          label: 'Count:',
          align: 'left'
        },
        {
          name: 'salary',
          label: 'Salary:',
          align: 'left'
        },
        {
          name: 'perc',
          label: '%:',
          align: 'left'
        }
      ]
    }
  },
  mounted () {
    this.scadTeamClone = JSON.parse(JSON.stringify(this.scadTeam))
    this.loaded = true
    this.notifyIllegalRoster()
    this.salary = calcTeamSalary(this.yahooTeam.players, this.scadTeam.players, [], this.scadSettings.franchiseTagDiscount, this.scadSettings.irReliefPerc, this.yahooTeam, this.scadSettings.seasonYear)
    this.rosterLimit = getLeagueRosterLimit(this.rosterPositions)
  },
  computed: {
    scadSettings () {
      return this.$store.state.league.scadSettings
    },
    rosterPositions () {
      return this.$store.state.league.yahooSettings.roster_positions
    },
    irReliefPerc () {
      return this.$store.state.league.scadSettings.irReliefPerc
    },
    capExemptionsByTeam () {
      return this.$store.state.capExemptions.capExemptionsByTeam
    }
  },
  methods: {
    countStyle (count) {
      return {
        'text-red': count > 25
      }
    },
    getPosCount (pos) {
      return getPosCount(pos, this.yahooTeam.players)
    },
    getPlayerCount () {
      return getPlayerCount(this.yahooTeam.players)
    },
    getPositionSalaryTotal (pos) {
      return getPositionSalaryTotal(pos, this.yahooTeam.players, this.scadTeamClone.players, this.scadSettings.franchiseTagDiscount, this.irReliefPerc)
    },
    getPerc (pos) {
      return getPerc(this.salary, pos, this.yahooTeam.players, this.scadTeamClone.players, this.scadSettings.franchiseTagDiscount, this.irReliefPerc)
    },
    checkPos (pos) {
      return checkPos(pos, this.scadSettings, this.yahooTeam.players)
    },
    notifyIllegalRoster () {
      referenceData.positionChecks.forEach(pos => {
        let count = this.getPosCount(pos.toUpperCase())
        if (count > this.scadSettings[`${pos}Max`]) {
          notify.rosterMaxError(pos.toUpperCase(), count, this.scadSettings[`${pos}Max`])
        } else if (count < this.scadSettings[`${pos}Min`]) {
          notify.rosterMinError(pos.toUpperCase(), count, this.scadSettings[`${pos}Min`])
        }
      })
      if (!checkIRCount(this.yahooTeam.players)) {
        notify.error('Invalid Roster [IR]: League Limit for injured players: 3')
      }
      if (!checkCovidCount(this.yahooTeam.players)) {
        notify.error('Invalid Roster [COVID]: League Limit for COVID players: 7')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
th
  text-align: center
  background-color: #e1e2e3
tr
  text-align: center
.pos
  font-weight: bold
  background-color: #f0f0f0
.qty
  font-weight: bold
  color: #000000

</style>
