<template lang="pug">
  .q-pa-md
    .row.q-gutter-md.q-pa-md
      .text-h4.text-weight-bolder Draft Picks
      .row.full-width.justify-right
        div(style="width: 100%")
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-2
              q-select( filled dense label="Team" stack-label v-model='filter.team')
            .col-2
              q-select( filled dense label="Year" stack-label v-model='filter.year')
            .col-2
              q-select( filled dense label="Round" stack-label v-model='filter.rd')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Filter' dense color='primary' text-color='white' size='sm' @click="")
    q-btn.q-mr-sm(dense @click="tester" label="TEST")

    .row.q-gutter-lg.q-pt-lg
      div
        q-table(
          :data='filteredPicks()',
          :columns='columns',
          row-key= 'player_key',
          :pagination.sync="pagination",
          hide-bottom,
          dense,
          )
</template>

<script>
import { server } from '../utilities/axios-server'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'

export default {
  name: 'DraftPicks',
  data () {
    return {
      filter: {
        team: '',
        year: '',
        rd: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'year',
          required: true,
          label: 'Year:',
          align: 'left',
          sortable: false,
          field: row => row.year,
          format: val => `${val}`,
          style: 'max-width: 150px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'rd',
          required: true,
          label: 'Round:',
          align: 'center',
          sortable: false,
          field: row => row.rd,
          format: val => `${val}`,
          style: 'max-width: 150px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'pick',
          required: true,
          label: 'Pick:',
          align: 'center',
          field: row => row.pick,
          format: val => {
            if (val !== undefined) {
              return `${val}`
            } else {
              return ''
            }
          },
          sortable: true
          // headerClasses: 'bg-grey-3',
          // // style: 'max-width: 100px'
        },
        {
          name: 'team',
          required: true,
          label: 'Team:',
          // align: 'right',
          field: row => row.ownerID,
          format: val => `${val}`
          // sortable: true,
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          // headerClasses: 'bg-grey-3'
        }
      ]
    }
  },
  async mounted () {
    await this.getDraftPicks()
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    draftPicks () {
      return this.$store.state.draftPicks.draftPicks
    },
    leagueID () {
      return '23489'
      // return this.$store.state.league.yahooLeagueID
    }
  },
  methods: {
    async getDraftPicks () {
      this.$store.dispatch('draftPicks/getDraftPicksByLeague', this.leagueID)
    },
    filteredPicks () {
      var filtered = this.draftPicks
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          filtered = filtered.filter(dp => dp[key] === this.filter[key])
        }
      })
      return filtered
    },
    async tester () {
      let teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      // let rounds = [1, 2, 3]
      teams.forEach(async t => {
        let draftPick = {
          yahooLeagueID: '23489',
          ownerID: t,
          originalOwnerID: t,
          year: 2020,
          rd: 1,
          pick: undefined,
          salary: undefined,
          playerID: undefined
        }
        try {
          await server.post('/draftPicks/create', { data: draftPick })
        } catch (error) {
          catchAxiosScadError(error)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
