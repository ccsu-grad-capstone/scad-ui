<template lang="pug">
  .q-px-md
    q-markup-table(dense)
      thead
        tr
          th POS
          th Count
          th Salary
          th Percent
      tbody
        tr
          td.pos QB
          td {{getCount('QB')}}
          td ${{getTotal('QB')}}
          td {{getPerc('QB')}}%
        tr
          td.pos WR
          td {{getCount('WR')}}
          td ${{getTotal('WR')}}
          td {{getPerc('WR')}}%
        tr
          td.pos RB
          td {{getCount('RB')}}
          td ${{getTotal('RB')}}
          td {{getPerc('RB')}}%
        tr
          td.pos TE
          td {{getCount('TE')}}
          td ${{getTotal('TE')}}
          td {{getPerc('TE')}}%
        tr
          td.pos K
          td {{getCount('K')}}
          td ${{getTotal('K')}}
          td {{getPerc('K')}}%
        tr
          td.pos DEF
          td {{getCount('DEF')}}
          td ${{getTotal('DEF')}}
          td {{getPerc('DEF')}}%
    .col.full-width.text-center.q-pa-xs.text-grey.text-caption -team details by position-

</template>

<script>
export default {
  name: 'TeamOverview',
  props: {
    yahooTeamId: String
  },
  data () {
    return {
      scadTeam: {},
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
    if (this.yahooTeamID === this.myYahooTeamId) {
      this.scadTeam = this.$store.state.team.myScadTeam
    } else {
      this.scadTeam = this.$store.state.team.scadTeam
    }
  },
  computed: {
    yahooTeam () {
      return this.$store.state.team.yahooTeam
    }
  },
  methods: {
    getCount (pos) {
      let count = 0
      this.yahooTeam.players.forEach(p => {
        if (p.display_position === pos) {
          count++
        }
      })
      return count
    },
    getTotal (pos) {
      let total = 0
      this.yahooTeam.players.forEach(p => {
        if (p.display_position === pos) {
          // eslint-disable-next-line eqeqeq
          let player = this.scadTeam.players.find(sp => sp.yahooLeaguePlayerId == p.player_id)
          total += player.salary
        }
      })
      return total
    },
    getPerc (pos) {
      return Math.floor((this.getTotal(pos) / this.scadTeam.salary) * 100)
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
