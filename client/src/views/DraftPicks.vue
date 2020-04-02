<template lang="pug">
  .q-pa-md
    .row.q-gutter-md.q-pa-md
      .text-h4.text-weight-bolder Draft Picks
      q-btn.q-mr-sm(dense @click="tester" size='sm' label="UPLOAD")
      .row.full-width.justify-center
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-2
              q-select( filled dense label="Team" stack-label v-model='filter.team')
            .col-2
              q-select( filled dense label="Year" stack-label v-model='filter.year')
            .col-2
              q-select( filled dense label="Round" stack-label v-model='filter.rd')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Filter' dense color='primary' text-color='white' size='sm' @click="")

    .row.full-width.q-pa-md
      div(style="width: 75%")
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
          name: 'teamName',
          required: true,
          label: 'Owner:',
          align: 'left',
          field: row => row.teamName,
          format: val => `${val}`
        },
        {
          name: 'originalTeamOwner',
          required: true,
          label: 'Original Owner',
          align: 'left',
          field: row => row.originalTeamName,
          format: val => `${val}`,
          style: 'color: grey'

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
    teams () {
      return this.$store.state.league.teams
    },
    leagueID () {
      return this.$store.state.league.yahooLeagueID
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
      let rounds = [1, 2, 3]
      let years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
      years.forEach(y => {
        rounds.forEach(r => {
          this.teams.forEach(async t => {
            let draftPick = {
              yahooLeagueID: this.leagueID,
              ownerID: t.team_id,
              originalOwnerID: t.team_id,
              year: y,
              rd: r,
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
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
