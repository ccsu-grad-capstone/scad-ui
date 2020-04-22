<template lang="pug">
  q-page
    .row.full-width.justify-center
      .row.cap-exemption-width
        .row.full-width.q-pa-md
          div.text-h4.text-weight-bolder Cap Exemptions
        .row.full-width.q-px-md
          .text-subtitle2.text-grey Cap Exceptions are transactions of salaries between two teams, typically as part of a larger trade.  Amount is added or deducted from participating team's salary for the given year. Each team has ${{salaryCapExemptionLimit}} to both give and recieve throughout the course of a season.
        .row.full-width.q-gutter-between.q-pt-md
          .col.q-px-md
            .row.q-gutter-sm
              .col-3
                q-select( filled dense label="Owner" stack-label v-model='filter.team' :options='filteredTeams')
              .col-3
                q-select( filled dense label="Year" stack-label v-model='filter.year' :options='referenceData.years')
              div.q-gutter-sm
                q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")
          .col-2.q-pt-sm
                q-btn.q-pa-xs(label='New Cap Exception' dense color='secondary' text-color='primary' size='sm' @click="addCE()")
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
            .text-grey Fetching SCAD cap exemptions...
        .row.full-width.q-pa-md(v-else)
          div(style="width:100%")
            q-table(
              :data='filteredCapExemptions()',
              :columns='columns',
              row-key= '_id',
              :pagination.sync="pagination",
              dense,
              no-data-label='No cap exemptions available yet..'
            )
              template(v-slot:body-cell-edit='props')
                q-td.q-pr-md(:props='props' auto-width)
                  q-btn(size='xs' color='accent' round dense @click='editCE(props.row)' icon="edit")
              template(v-slot:body-cell-year='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg {{ props.row.year }}
              template(v-slot:body-cell-giving='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg {{ props.row.yahooTeamGive.name }}
              template(v-slot:body-cell-recieving='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg {{ props.row.yahooTeamRecieve.name }}
              template(v-slot:body-cell-amount='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg ${{ props.row.amount }}
        add-cap-exemption-dialog(v-if="addCapExemption" :ce="edit.ce" @saved="getCapExemptions()")
        edit-cap-exemption-dialog(v-if="editCapExemption" :capExemption="edit.ce" @saved="getCapExemptions()")
</template>

<script>
import referenceData from '../utilities/referenceData'
import addCapExemptionDialog from '../components/dialogs/addCapExemptionDialog'
import editCapExemptionDialog from '../components/dialogs/editCapExemptionDialog'

export default {
  name: 'DraftPicks',
  components: {
    'add-cap-exemption-dialog': addCapExemptionDialog,
    'edit-cap-exemption-dialog': editCapExemptionDialog
  },
  data () {
    return {
      loaded: false,
      edit: {
        visable: false,
        ce: {}
      },
      filter: {
        team: '',
        year: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 20 // 0 means all rows
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
          name: 'giving',
          required: true,
          label: 'Giving:',
          align: 'left',
          sortable: false
        },
        {
          name: 'recieving',
          required: true,
          label: 'Recieving:',
          align: 'left',
          sortable: true
        },
        {
          name: 'amount',
          required: true,
          label: 'Amount:',
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
  async mounted () {
    await this.getCapExemptions()
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    capExemptions () {
      return this.$store.state.capExemptions.capExemptions
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
    salaryCapExemptionLimit () {
      return this.$store.state.league.scadSettings.salaryCapExemptionLimit
    },
    addCapExemption () {
      return this.$store.state.dialog.addCapExemption
    },
    scadSettings () {
      return this.$store.state.league.scadSettings
    },
    editCapExemption () {
      return this.$store.state.dialog.editCapExemption
    }
  },
  methods: {
    async getCapExemptions () {
      await this.$store.dispatch('capExemptions/getCapExemptionsByLeague', { leagueId: this.leagueId, year: this.scadSettings.seasonYear })
      this.loaded = true
    },
    addCE () {
      this.$store.commit('dialog/addCapExemption')
    },
    editCE (ce) {
      this.edit.ce = ce
      this.$store.commit('dialog/editCapExemption')
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
    filteredCapExemptions () {
      var filtered = this.capExemptions
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'team') {
            filtered = filtered.filter(ce => ce.yahooTeamGive.name === this.filter.team.name || ce.yahooTeamRecieve.name === this.filter.team.name)
          } else {
            filtered = filtered.filter(ce => ce[key] === this.filter[key])
          }
        }
      })
      return filtered
    },
    clearFilter () {
      this.filter.team = ''
      this.filter.year = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.cap-exemption-width
  width: 1100px

</style>
