<template lang="pug">
  q-page
    .row.full-width.justify-center
      .row.cap-exemption-width
        .row.full-width.q-gutter-md.q-pa-md
          .text-h4.text-weight-bolder Cap Exemptions
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
        .row.full-width.q-pa-md
          div(style="width:100%")
            q-table(
              :data='filteredCapExemptions()',
              :columns='columns',
              row-key= '_id',
              :pagination.sync="pagination",
              dense,
            )
              template(v-slot:body-cell-edit='props')
                q-td.q-pr-md(:props='props' auto-width)
                  q-btn(size='xs' color='accent' round dense @click='editCE(props.row)' icon="edit")
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
        add-cap-exemption-dialog(v-if="addCapExemption" :ce="edit.ce")
        edit-cap-exemption-dialog(v-if="editCapExemption" :capExemption="edit.ce")
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
          format: val => `${val}`
          // style: 'width: 20px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'giving',
          required: true,
          label: 'Giving:',
          align: 'left',
          sortable: false,
          field: row => row.yahooTeamGive.name,
          format: val => `${val}`
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'revieving',
          required: true,
          label: 'Recieving:',
          align: 'left',
          field: row => row.yahooTeamRecieve.name,
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
          name: 'amount',
          required: true,
          label: 'Amount:',
          align: 'left',
          style: 'width: 250px',
          field: row => row.amount,
          format: val => `$${val}`
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
    addCapExemption () {
      return this.$store.state.dialog.addCapExemption
    },
    editCapExemption () {
      return this.$store.state.dialog.editCapExemption
    }
  },
  methods: {
    async getCapExemptions () {
      this.$store.dispatch('capExemptions/getCapExemptionsByLeague', this.leagueId)
    },
    addCE () {
      this.$store.commit('dialog/addCapExemption')
    },
    editCE (ce) {
      this.edit.ce = ce
      this.$store.commit('dialog/editCapExemption')
    },
    async saveCE () {
      console.log('[CAPEXCEPTION] Method - saveCE()')
      this.edit.visable = false
      await this.$store.dispatch('capException/saveCapExemption', this.edit.ce)
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.cap-exemption-width
  width: 1100px

</style>
