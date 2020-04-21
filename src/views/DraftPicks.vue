<template lang="pug">
  q-page
    .row.full-width.justify-center
      .row.draft-picks-width
        .row.full-width.q-pa-md
          div.text-h4.text-weight-bolder Draft Picks
          q-space
          div(v-if="loaded")
            q-btn.q-mt-sm(v-if="draftPicks.length === 0" label='CLICK HERE TO CREATE DRAFT PICKS' dense color='primary' text-color='white' size='sm' @click="updateMongoWithDraftPicks")
        .row.full-width.q-px-md
          .text-subtitle2.text-grey  List of draft picks for drafting incoming rookies for next {{scadSettings.tradingDraftPickYears}} years.  Each rookie draft is {{scadSettings.rookieDraftRds}} rounds.  Each year, all owners are given {{scadSettings.rookieDraftRds}} picks, 1 for each round. Pick value for each draft pick is entered upon completion of fantasy season.
          //- q-btn.q-mr-sm(dense @click="tester" size='sm' label="UPLOAD")
        .row.full-width.justify-center.q-pt-md
          .row.full-width.q-gutter-sm.q-px-sm
            .col-2
              q-select( filled dense label="Owner" stack-label v-model='filter.team' :options='filteredTeams')
            .col-2
              q-select( filled dense label="Year" stack-label v-model='filter.year' :options='referenceData.draftPickYearsFilter(this.scadSettings.seasonYear, this.scadSettings.tradingDraftPickYears)')
            .col-2
              q-select( filled dense label="Round" stack-label v-model='filter.rd' :options='referenceData.rounds')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")
        .row.full-width(v-if="!loaded")
          .row.full-width.justify-center
            q-circular-progress.q-mt-xl(
              indeterminate
              size="90px"
              :thickness="0.2"
              color="primary"
              center-color="grey-5"
              track-color="transparent"
              class="q-mt-xl"
              )
          .row.full-width.justify-center.q-mt-lg
            .text-grey Fetching SCAD draft picks...
        .row.full-width.q-pa-md(v-else)
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
                  div.q-pr-md {{ props.row.year }}
              template(v-slot:body-cell-rd='props')
                q-td(:props='props' auto-width)
                  div.q-pr-md {{ props.row.rd }}
              template(v-slot:body-cell-pick='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg {{ displayPick(props.row.pick) }}
              template(v-slot:body-cell-owner='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg.text-weight-bold {{ props.row.team.name }}
              template(v-slot:body-cell-originalOwner='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg.text-grey {{ props.row.originalTeam.name }}
        edit-draft-pick-dialog(v-if="editDraftPick" :dp="edit.dp")
</template>

<script>
import referenceData from '../utilities/referenceData'
import editDraftPickDialog from '../components/dialogs/editDraftPickDialog'
import { node } from '../utilities/axios-node'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'

export default {
  name: 'DraftPicks',
  components: {
    'edit-draft-pick-dialog': editDraftPickDialog
  },
  data () {
    return {
      loaded: false,
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
          sortable: false
        },
        {
          name: 'rd',
          required: true,
          label: 'Round:',
          align: 'center',
          sortable: false
        },
        {
          name: 'pick',
          required: true,
          label: 'Pick:',
          align: 'center',
          sortable: true
        },
        {
          name: 'owner',
          required: true,
          label: 'Owner:',
          align: 'left'
        },
        {
          name: 'originalOwner',
          required: true,
          label: 'Original Owner',
          align: 'left'
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
  mounted () {
    this.getDraftPicks()
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
    scadSettings () {
      return this.$store.state.league.scadSettings
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
      await this.$store.dispatch('draftPicks/getDraftPicksByLeague', { leagueId: this.leagueId, year: this.scadSettings.seasonYear })
      this.loaded = true
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
    async updateMongoWithDraftPicks () {
      console.log('updateMongoWithDraftPicks', referenceData.draftPickYears(this.scadSettings.seasonYear))
      referenceData.draftPickYears(this.scadSettings.seasonYear).forEach(y => {
        referenceData.draftPickRounds(this.scadSettings.rookieDraftRds).forEach(r => {
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
      this.$store.dispatch('draftPicks/getDraftPicksByLeague', this.leagueId)
      console.log('COMPLETE')
    },
    clearFilter () {
      this.filter.team = ''
      this.filter.year = ''
      this.filter.rd = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.draft-picks-width
  width: 1100px

</style>
