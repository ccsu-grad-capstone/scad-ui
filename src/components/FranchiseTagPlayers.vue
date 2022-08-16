<template lang="pug">
  div
    .q-px-xs.text-h6.text-weight-bolder {{scadSettings.seasonYear}} Franchise Tagged Players
    q-card(v-if="!loaded" flat dense square)
      loading(:message="'Getting Franchise Tagged Players'")
    .q-pa-xs(v-else)
      q-table(
        :data='franchiseTaggedPlayers',
        :columns='columns',
        row-key='playerName',
        :pagination.sync="pagination",
        hide-bottom,
        flat
        dense
        square
        )

        template(v-slot:body='props')
          q-tr(:props='props')
            q-td.text-weight-bold {{ props.row.yahooPlayer.display_position }}
            q-td(key='playerName' :props='props')
              .row.full-width
                .col-2.q-pt-xs
                  q-avatar(size="30px")
                    img(:src="props.row.yahooPlayer.headshot.url" style="width: 80%")
                .column.justify-center.q-pl-sm
                  .row.full-width.text-body2.text-weight-bold
                    | {{ props.row.yahooPlayer.name.full }}
                  .row.full-width.text-accent
                    .text-caption {{ getTeamName(getYahooTeamFromYahooTeamId(yahooTeams, props.row.scadPlayer.isFranchiseTagTeam.yahooTeamId), yahooTeams) }}
            q-td
              .row
                .text-center.text-grey-7 (${{props.row.scadPlayer.salary}})
                .text-primary.text-weight-bolder.text-center.q-pl-sm ${{calcFranchiseTagSalary(props.row.scadPlayer.salary)}}
      .text-center.text-grey-8.text-caption(v-if="isBeforeTagDeadline()") Franchise Tag Deadline: {{moment(scadSettings.franchiseTagDeadline).format('LL')}}
      .text-center.text-grey-8.text-caption(v-else) Deadline Passed: {{moment(scadSettings.franchiseTagDeadline).format('LL')}}
      div(v-if="previousYearsFranchiseTaggedPlayers.length > 0")
        .text-h6.text-weight-bolder {{scadSettings.seasonYear-1}} Franchise Tagged Players
        q-table(
          :data='previousYearsFranchiseTaggedPlayers',
          :columns='columns',
          row-key='playerName',
          :pagination.sync="pagination",
          hide-bottom,
          flat
          dense
          square
          )

          template(v-slot:body='props')
            q-tr(:props='props')
              q-td {{ props.row.yahooPlayer.display_position }}
              q-td(key='playerName' :props='props')
                .row.full-width
                  .col-2
                    q-avatar(size="30px")
                      img(:src="props.row.yahooPlayer.headshot.url" style="width: 80%")
                  .column.justify-center.q-pl-sm.text-body2.text-weight-bold
                    .row.full-width
                      | {{ props.row.yahooPlayer.name.full }}
              q-td
                .row
                  .text-center.text-grey-7 (${{props.row.scadPlayer.salary}})
                  .text-primary.text-weight-bolder.text-center.q-pl-sm ${{calcFranchiseTagSalary(props.row.scadPlayer.salary)}}

</template>

<script>

import { calcFranchiseTagSalary } from '../utilities/calculator'
import moment from 'moment'
import Loading from '../components/Loading'
import { getTeamName, getYahooTeamFromYahooTeamId } from '../utilities/functions'

export default {
  name: 'FranchiseTaggedPlayers',
  components: {
    'loading': Loading
  },
  data () {
    return {
      loaded: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        sortBy: 'salary',
        descending: true
      },
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'Pos',
          align: 'center',
          field: row => row.scadPlayer.yahooPlayerId,
          format: val => `${this.getPos(val)}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          headerClasses: 'bg-grey-4 text-grey-8'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player',
          align: 'left',
          field: row => row.yahooPlayer.name.full,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-grey-4 text-grey-8'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary',
          align: 'center',
          field: row => row.scadPlayer.salary,
          format: val => `$${val}`,
          sortable: true,
          headerClasses: 'bg-grey-4 text-grey-8'
        }
      ]
    }
  },
  async mounted () {
    await this.$store.dispatch('player/getFranchiseTaggedPlayers')
    await this.$store.dispatch('player/getPreviousYearsFranchiseTaggedPlayers')
    this.loaded = true
  },
  computed: {
    team () {
      return this.$store.state.team
    },
    myYahooTeam () {
      return this.team.myYahooTeam
    },
    myScadTeam () {
      return this.team.myScadTeam
    },
    yahooTeams () { return this.$store.state.league.yahooTeams },
    scadSettings () { return this.$store.state.league.scadSettings },
    franchiseTagDiscount () { return this.$store.state.league.scadSettings.franchiseTagDiscount },
    franchiseTaggedPlayers () { return this.$store.state.player.franchiseTaggedPlayers },
    previousYearsFranchiseTaggedPlayers () { return this.$store.state.player.previousYearsFranchiseTaggedPlayers },
    moment () { return moment },
    getTeamName () { return getTeamName },
    getYahooTeamFromYahooTeamId () { return getYahooTeamFromYahooTeamId }
  },
  methods: {
    calcFranchiseTagSalary (salary) {
      return calcFranchiseTagSalary(salary, this.franchiseTagDiscount)
    },
    isBeforeTagDeadline () {
      // return true
      let date = moment().format('L')
      if (moment(date).isSameOrBefore(moment(this.scadSettings.franchiseTagDeadline))) return true
      else return false
    }
  }

}
</script>

<style lang="stylus" scoped>
  a
    color: #000000
    text-decoration: none
</style>
