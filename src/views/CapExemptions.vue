<template lang="pug">
  q-page
    .row.full-width.justify-center
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        .row.full-width.q-pa-md
          div.text-h4.text-weight-bolder Cap Exemptions
          q-space
          div(v-if="loaded")
            q-btn.q-mt-sm(v-if="updateCE && this.scadSettings.isCurrentlyLoggedInUserACommissioner" label='CLICK HERE TO SYNC CAP EXCEPTIONS' dense color='primary' text-color='white' size='sm' @click="updateMongoWithCE")
        .row.full-width.q-px-md.gt-sm
          .text-subtitle2.text-grey Cap Exceptions are transactions of salaries between two teams, typically as part of a larger trade.  Amount is added or deducted from participating team's salary for the given year. Each team has ${{salaryCapExemptionLimit}} to both give and recieve throughout the course of a season.
        .row.full-width.q-gutter-between.q-pt-md
          .col.q-px-md
            .row.q-gutter-sm
              .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-4
                q-select( filled dense label="Owner" stack-label v-model='filter.team' :options='filteredTeams')
              .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-4
                q-select( filled dense label="Year" stack-label v-model='filter.year' :options='referenceData.years')
              div.q-gutter-sm
                q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='xs' @click="clearFilter")
          .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-4.q-pt-sm
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
                  q-btn(v-if="!props.row.appliedToTeams && props.row.year == seasonYear" size='xs' color='warning' round dense @click='applyToTeams(props.row)' icon="add")
                  q-btn(v-else size='xs' color='accent' round dense @click='editCE(props.row)' icon="edit")
              template(v-slot:body-cell-year='props')
                q-td(:props='props' auto-width)
                  div.q-pr-lg {{ props.row.year }}
              template(v-slot:body-cell-giving='props')
                q-td(:props='props' auto-width :class="myTeamStyle(props.row.yahooTeamGive.team_id, myYahooTeamId)")
                  div.q-pr-lg {{ props.row.yahooTeamGive.name }}
              template(v-slot:body-cell-recieving='props')
                q-td(:props='props' auto-width :class="myTeamStyle(props.row.yahooTeamRecieve.team_id, myYahooTeamId)")
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
import { node } from '../utilities/axios-node'
import { catchAxiosNodeError } from '../utilities/catchAxiosErrors'
import { myTeamStyle } from '../utilities/formatters'

/* eslint-disable eqeqeq */

export default {
  name: 'CapExemptions',
  components: {
    'add-cap-exemption-dialog': addCapExemptionDialog,
    'edit-cap-exemption-dialog': editCapExemptionDialog
  },
  data () {
    return {
      loaded: false,
      updateCE: false,
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
    // Check if capExceptions exist for prior league
    this.checkCapExemptions()
  },
  computed: {
    myTeamStyle () {
      return myTeamStyle
    },
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
    scadTeams () {
      return this.$store.state.league.scadTeams
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
    seasonYear () {
      return this.$store.state.league.scadSettings.seasonYear
    },
    editCapExemption () {
      return this.$store.state.dialog.editCapExemption
    },
    oldYahooLeagueId () {
      return this.$store.state.league.yahooLeagueDetails.renew
    },
    myYahooTeamId () {
      return this.$store.state.team.myYahooTeamId
    }
  },
  methods: {
    async getCapExemptions () {
      // console.log('getCapExemptions()')
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
    filteredCapExemptions () {
      var filtered = this.capExemptions
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'team') {
            filtered = filtered.filter(ce => ce.yahooTeamGive.name === this.filter.team.name || ce.yahooTeamRecieve.name === this.filter.team.name)
          } else {
            filtered = filtered.filter(ce => ce[key] == this.filter[key])
          }
        }
      })
      return filtered
    },
    clearFilter () {
      this.filter.team = ''
      this.filter.year = ''
    },
    async updateMongoWithCE () {
      this.loaded = false
      this.updateCE = false
      await this.$store.dispatch('capExemptions/updateMongoWithCE')
      this.loaded = true
    },
    async checkCapExemptions () {
      if (this.capExemptions.length === 0) {
        try {
          let renewId = this.oldYahooLeagueId.split('_')
          const response = await node.get(`/capExemptions/check/${renewId[1]}/${this.seasonYear - 1}`)
          if (response.status === 200) {
            this.updateCE = true
          }
        } catch (error) {
          catchAxiosNodeError(error)
        }
      }
    },
    async applyToTeams (ce) {
      if (ce.year == this.seasonYear) {
        let giver = this.scadTeams.find(t => t.yahooLeagueTeamId == ce.yahooTeamGive.team_id)
        giver.exceptionOut += ce.amount
        giver.salary += ce.amount
        await this.$store.dispatch('team/saveTeam', giver)

        let reciever = this.scadTeams.find(t => t.yahooLeagueTeamId == ce.yahooTeamRecieve.team_id)
        reciever.exceptionIn += ce.amount
        reciever.salary -= ce.amount
        await this.$store.dispatch('team/saveTeam', reciever)
        ce.appliedToTeams = true
        await this.$store.dispatch('capExemptions/saveCapExemption', ce)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.cap-exemption-width
  width: 1100px

</style>
