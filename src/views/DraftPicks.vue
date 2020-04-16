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
      div(style="width:100%")
        q-table(
          :data='filteredPicks()',
          :columns='columns',
          row-key= '_id',
          :pagination.sync="pagination",
          dense,
        )
          template(v-slot:body-cell-edit='props')
            q-td.q-pr-md(:props='props' auto-width)
              q-btn(size='xs' color='accent' round dense @click='editPick(props.row)' icon="edit")
          template(v-slot:body-cell-year='props')
            q-td(:props='props' auto-width)
              | {{ props.row.year }}
          template(v-slot:body-cell-rd='props')
            q-td(:props='props' auto-width)
              | {{ props.row.rd }}
          template(v-slot:body-cell-pick='props')
            q-td(:props='props' auto-width)
              | {{ displayPick(props.row.pick) }}
          template(v-slot:body-cell-owner='props')
            q-td(:props='props')
              | {{ props.row.team.name }}
          template(v-slot:body-cell-originalOwner='props')
            q-td(:props='props' auto-width)
              | {{ props.row.originalTeam.name }}
    edit-draft-pick-dialog(v-if="editDraftPick" :dp="edit.dp")
</template>

<script>
import { node } from '../utilities/axios-node'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'
import referenceData from '../utilities/referenceData'
import editDraftPickDialog from '../components/dialogs/editDraftPickDialog'

export default {
  name: 'DraftPicks',
  components: {
    'edit-draft-pick-dialog': editDraftPickDialog
  },
  data () {
    return {
      edit: {
        visable: false,
        dp: {}
      },
      filter: {
        team: '',
        year: '',
        rd: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 36 // 0 means all rows
      },
      columns: [
        {
          name: 'edit',
          label: '',
          align: 'left'
        },
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
          format: val => `${val}`
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
              return '-'
            }
          },
          sortable: true
          // headerClasses: 'bg-grey-3',
          // // style: 'max-width: 100px'
        },
        {
          name: 'owner',
          required: true,
          label: 'Owner:',
          align: 'left',
          style: 'width: 200px',
          field: row => row.team.name,
          format: val => `${val}`
        },
        {
          name: 'originalOwner',
          required: true,
          label: 'Original Owner',
          align: 'left',
          style: 'color: grey; width: 200px',
          field: row => row.originalTeam.name,
          format: val => `${val}`
        },
        {
          name: 'comments',
          label: 'Comments',
          align: 'left',
          field: row => row.comments,
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
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    leagueId () {
      return this.$store.state.league.yahooLeagueId
    },
    referenceData () {
      return referenceData
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    },
    editDraftPick () {
      return this.$store.state.dialog.editDraftPick
    }
  },
  methods: {
    async getDraftPicks () {
      this.$store.dispatch('draftPicks/getDraftPicksByLeague', this.leagueId)
    },
    editPick (dp) {
      this.edit.dp = dp
      this.$store.commit('dialog/editDraftPick')
    },
    async savePick () {
      console.log('[DRAFTPICK] Method - savePick()')
      this.edit.visable = false
      await this.$store.dispatch('draftPicks/saveDraftPick', this.edit.dp)
    },
    displayPick (pick) {
      if (pick) {
        return pick
      } else {
        return '-'
      }
    },
    displayTeam () {
      return this.edit.dp.team.name
    },
    outputRound (rd) {
      if (rd === 1) {
        return '1st'
      } else if (rd === 2) {
        return '2nd'
      } else if (rd === 3) {
        return '3rd'
      } else if (rd === 4) {
        return '4th'
      }
    },
    filteredPicks () {
      var filtered = this.draftPicks
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'team') {
            filtered = filtered.filter(dp => dp.team.name === this.filter.team.name)
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
          this.yahooTeams.forEach(async t => {
            let draftPick = {
              yahooLeagueId: this.leagueId,
              year: y,
              rd: r,
              pick: undefined,
              salary: undefined,
              playerId: undefined,
              team: t,
              originalTeam: t,
              comments: ''
            }
            try {
              await node.post('/draftPicks/create', { data: draftPick })
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
