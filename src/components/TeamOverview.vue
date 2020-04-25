<template lang="pug">
  .q-px-md
    .text-weight-bold(:class="countStyle(getCount())") Roster Availability: {{getCount()}}/{{scadSettings.rosterSpotLimit}}
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
          td.text-weight-bold(v-bind:class="{ 'text-red': checkPos('qb') }") {{getPosCount('QB')}}
          td ${{getTotal('QB')}}
          td {{getPerc('QB')}}%
        tr
          td.pos WR
          td.text-weight-bold(v-bind:class="{ 'text-red': checkPos('wr') }") {{getPosCount('WR')}}
          td ${{getTotal('WR')}}
          td {{getPerc('WR')}}%
        tr
          td.pos RB
          td.text-weight-bold(v-bind:class="{ 'text-red': checkPos('rb') }") {{getPosCount('RB')}}
          td ${{getTotal('RB')}}
          td {{getPerc('RB')}}%
        tr
          td.pos TE
          td.text-weight-bold(v-bind:class="{ 'text-red': checkPos('te') }") {{getPosCount('TE')}}
          td ${{getTotal('TE')}}
          td {{getPerc('TE')}}%
        tr
          td.pos K
          td.text-weight-bold(v-bind:class="{ 'text-red': checkPos('k') }") {{getPosCount('K')}}
          td ${{getTotal('K')}}
          td {{getPerc('K')}}%
        tr
          td.pos DEF
          td.text-weight-bold(v-bind:class="{ 'text-red': checkPos('def') }") {{getPosCount('DEF')}}
          td ${{getTotal('DEF')}}
          td {{getPerc('DEF')}}%
    .col.full-width.text-center.q-pa-xs.text-grey.text-caption Visit league settings for min / max position details

</template>

<script>
import notify from '../utilities/nofity'
import referenceData from '../utilities/referenceData'
import { calcPlayerSalary } from '../utilities/calculator'

export default {
  name: 'TeamOverview',
  props: {
    yahooTeamId: String,
    yahooTeam: Object,
    scadTeam: Object
  },
  data () {
    return {
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
  },
  computed: {
    scadSettings () {
      return this.$store.state.league.scadSettings
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
      let count = 0
      this.yahooTeam.players.forEach(p => {
        if (p.display_position === pos) {
          // if (p.selected_position.position !== 'IR') { count++ }
          count++
        }
      })
      return count
    },
    getCount () {
      let count = 0
      this.yahooTeam.players.forEach(p => {
        if (p.selected_position.position !== 'IR') { count++ }
      })
      return count
    },
    getTotal (pos) {
      let total = 0
      this.yahooTeam.players.forEach(p => {
        if (p.display_position === pos) {
          let position
          if (p.selected_position.position === 'IR') {
            position = p.selected_position.position
          } else {
            position = p.display_position
          }
          let salary = calcPlayerSalary(p.player_id, position, this.scadTeamClone.players, this.scadSettings.franchiseTagDiscount, this.irReliefPerc)
          total += salary
        }
      })
      return total
    },
    getPerc (pos) {
      let salary = this.scadTeamClone.salary
      if (this.capExemptionsByTeam) {
        this.capExemptionsByTeam.forEach(ce => {
          if (ce.yahooTeamGive.team_id === this.yahooTeamId) {
            salary -= ce.amount
          } else { salary += ce.amount }
        })
      }
      return Math.floor((this.getTotal(pos) / salary) * 100)
    },
    checkPos (pos) {
      let count = this.getPosCount(pos.toUpperCase())
      if ((count <= this.scadSettings[`${pos}Max`]) && (count >= this.scadSettings[`${pos}Min`])) {
        return false
      } else {
        return true
      }
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
