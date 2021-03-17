<template lang="pug">
  q-page
    .row.full-width.justify-center
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        .row.full-width.q-pa-md
          div.text-h4.text-weight-bolder Draft Picks
          q-space
        .row.full-width.q-px-md.gt-sm
          .text-subtitle2.text-grey  List of draft picks for drafting incoming rookies for next {{scadSettings.tradingDraftPickYears}} years.  Each rookie draft is {{scadSettings.rookieDraftRds}} rounds.  Each year, all owners are given {{scadSettings.rookieDraftRds}} picks, 1 for each round. Pick value for each draft pick is entered upon completion of fantasy season.
        .row.full-width.justify-center.q-pt-md
          .row.full-width.q-gutter-sm.q-px-sm
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select( filled dense label="Owner" stack-label v-model='filter.team' :options='filteredTeams')
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select( filled dense label="Year" stack-label v-model='filter.year' :options='referenceData.draftPickYearsFilter(this.scadSettings.seasonYear, this.scadSettings.tradingDraftPickYears)')
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select( filled dense label="Round" stack-label v-model='filter.rd' :options='referenceData.rounds')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")
        loading(v-if="!loaded" :message="'Fetching SCAD draft picks...'")
        .row.full-width.q-pa-md(v-else)
          div(style="width:100%")
            q-table(
              :data='filteredPicks',
              :columns='columns',
              row-key= '_id',
              :pagination.sync="pagination",
              dense,
              no-data-label='Click the button above to create draft picks'
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
                q-td(:props='props' auto-width :class="myTeamStyle(props.row.team.team_id, myYahooTeamId)")
                  div.q-pr-lg.text-weight-bold {{ props.row.team.name }}
              template(v-slot:body-cell-originalOwner='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg.text-grey {{ props.row.originalTeam.name }}
        edit-draft-pick-dialog(v-if="editDraftPick" :dp="edit.dp" @saved="getDraftPicks")
</template>

<script>
import referenceData from '../utilities/referenceData'
import editDraftPickDialog from '../components/dialogs/editDraftPickDialog'
import { myTeamStyle, displayPick } from '../utilities/formatters'
import Loading from '../components/Loading'

/* eslint-disable eqeqeq */

export default {
  name: 'DraftPicks',
  components: {
    'edit-draft-pick-dialog': editDraftPickDialog,
    'loading': Loading

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
        year: 2021,
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
          label: 'Rd:',
          align: 'left',
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
    myTeamStyle () {
      return myTeamStyle
    },
    displayPick () {
      return displayPick
    },
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
    },
    myYahooTeamId () {
      return this.$store.state.team.myYahooTeamId
    },
    filteredPicks () {
      var filtered = this.draftPicks
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'team') {
            filtered = filtered.filter(dp => dp.team.team_id === this.filter.team.team_id)
          } else {
            filtered = filtered.filter(dp => dp[key] === this.filter[key])
          }
        }
      })
      return filtered.sort(function (a, b) {
        if (a.rd === b.rd && a.year === b.year) {
          return a.pick > b.pick ? 1 : a.pick < b.pick ? -1 : 0
        } else if (a.year === b.year) {
          return a.rd > b.rd ? 1 : a.rd < b.rd ? -1 : 0
        }
      })
    }
  },
  methods: {
    async getDraftPicks () {
      await this.$store.dispatch('draftPicks/getDraftPicksByLeague')
      this.loaded = true
    },
    editPick (dp) {
      this.edit.dp = dp
      this.$store.commit('dialog/editDraftPick')
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
