<template lang="pug">
  .q-px-md
    .text-weight-bold(:class="countStyle(getPlayerCount())") Roster Availability: {{getPlayerCount()}}/{{rosterLimit}}
    q-markup-table(v-if="loaded" dense)
      thead
        tr
          th POS
          th Count
          th Salary
          th Percent
      tbody
        tr
          td.pos QB
          td.text-weight-bold(v-bind:class="{ 'text-red': !checkPos('qb') }") {{getPosCount('QB')}}
          td ${{getPositionSalaryTotal('QB')}}
          td {{getPerc('QB')}}%
        tr
          td.pos WR
          td.text-weight-bold(v-bind:class="{ 'text-red': !checkPos('wr') }") {{getPosCount('WR')}}
          td ${{getPositionSalaryTotal('WR')}}
          td {{getPerc('WR')}}%
        tr
          td.pos RB
          td.text-weight-bold(v-bind:class="{ 'text-red': !checkPos('rb') }") {{getPosCount('RB')}}
          td ${{getPositionSalaryTotal('RB')}}
          td {{getPerc('RB')}}%
        tr
          td.pos TE
          td.text-weight-bold(v-bind:class="{ 'text-red': !checkPos('te') }") {{getPosCount('TE')}}
          td ${{getPositionSalaryTotal('TE')}}
          td {{getPerc('TE')}}%
        tr(v-if="scadSettings.kMin >0")
          td.pos K
          td.text-weight-bold(v-bind:class="{ 'text-red': !checkPos('k') }") {{getPosCount('K')}}
          td ${{getPositionSalaryTotal('K')}}
          td {{getPerc('K')}}%
        tr
          td.pos DEF
          td.text-weight-bold(v-bind:class="{ 'text-red': !checkPos('def') }") {{getPosCount('DEF')}}
          td ${{getPositionSalaryTotal('DEF')}}
          td {{getPerc('DEF')}}%
    .col.full-width.text-center.q-pa-xs.text-grey.text-caption Visit league settings for min / max position details

</template>

<script>
import notify from '../utilities/nofity'
import referenceData from '../utilities/referenceData'
import { calcTeamSalary, getPosCount, getPlayerCount, getPositionSalaryTotal, getPerc } from '../utilities/calculator'
import { getLeagueRosterLimit } from '../utilities/functions'
import { checkPos } from '../utilities/validators'

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
    this.salary = calcTeamSalary(this.yahooTeam.players, this.scadTeam.players, [], this.scadSettings.franchiseTagDiscount, this.scadSettings.irRelieftPerc, this.yahooTeam, this.scadSettings.year)
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
      return this.$store.state.league.scadSettings.irReliefPerc / 100
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

</style>
