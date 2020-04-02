<template lang="pug">
  .q-pa-md
    .row.q-gutter-md.q-pa-md
      .text-h4.text-weight-bolder Draft Picks
      q-btn.q-mr-sm(dense @click="tester" size='sm' label="UPLOAD")
      .row.full-width.justify-center
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-2
              q-select( filled dense label="Owner" stack-label v-model='filter.team' :options='filteredTeams')
            .col-2
              q-select( filled dense label="Year" stack-label v-model='filter.year' :options='referenceData.years')
            .col-2
              q-select( filled dense label="Round" stack-label v-model='filter.rd' :options='referenceData.rounds')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")

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
          //- template(v-slot:body='props')
          //-   q-tr(:props='props')
          //-     q-td(auto-width)
          //-       q-btn(size='xs' color='accent' round dense @click='editPick' icon="edit")
          //-     q-td(v-for='col in props.cols' :key='col.name' :props='props')
          //-       | {{ col.value }}

</template>

<script>
import { server } from '../utilities/axios-server'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'
import referenceData from '../utilities/referenceData'

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
        // {
        //   name: 'edit',
        //   label: '',
        //   align: 'left'
        // },
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
    },
    referenceData () {
      return referenceData
    },
    filteredTeams () {
      return this.teams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    }
  },
  methods: {
    async getDraftPicks () {
      this.$store.dispatch('draftPicks/getDraftPicksByLeague', this.leagueID)
    },
    displayTeam () {

    },
    filteredPicks () {
      var filtered = this.draftPicks
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'team') {
            console.log('**************')
            filtered = filtered.filter(dp => dp.teamName === this.filter.team.name)
          } else {
            filtered = filtered.filter(dp => dp[key] === this.filter[key])
          }
        }
      })
      return filtered
    },
    clearFilter () {
      this.filter.team = ''
      this.filter.year = ''
      this.filter.rd = ''
    },
    async tester () {
      referenceData.years.forEach(y => {
        referenceData.rounds.forEach(r => {
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
