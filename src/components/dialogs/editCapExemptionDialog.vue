<template lang="pug">
  q-dialog(v-model='visable' persistent)
    q-card(style="width: 500px; max-width: 100vw;")
      q-card-section.row
        .col.text-center.text-h5.text-weight-bolder  Cap Exemption
      q-card-section.row.items-center
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Year:
          .col-3.q-pl-sm: q-select(dense disable v-model='capExemption.year' :options='getYears(seasonYear)')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Giving Team:
          .col.q-pl-sm: q-select(dense disable v-model='capExemption.yahooTeamGive' :options='filteredTeams' :display-value='displayTeamName(capExemption.yahooTeamGive.name)')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Recieving Team:
          .col.q-pl-sm: q-select(dense disable v-model='capExemption.yahooTeamRecieve' :options='filteredTeams' :display-value='displayTeamName(capExemption.yahooTeamRecieve)')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Amount:
          .col-2.q-pl-sm: q-select(dense disable v-model='capExemption.amount' :options='referenceData.capExemptionAmount(salaryCapExemptionLimit)')
          .text-caption.q-pt-md dollars
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Comments:
          .col.q-ma-sm.text-grey: q-input(v-model='capExemption.comments' filled type='textarea')
        .row.full-width.q-mt-sm
          .q-pr-lg.col.text-grey-5.text-right Added: {{fmtCeDate(capExemption.timestamp)}} ({{capExemption.addedBy}})
      q-card-actions.row.justify-around
        q-btn(flat label='Cancel' color='primary' @click="close()")
        q-btn(flat label='Delete' color='primary' @click="remove()")
        q-btn(flat label='Save' color='primary' @click="saveCE()")
</template>

<script>
/* eslint-disable eqeqeq */
import referenceData from '../../utilities/referenceData'
import { displayTeamName, fmtCeDate } from '../../utilities/formatters'
import { getYears } from '../../utilities/functions'

export default {
  name: 'EditCapExemptionDialog',
  props: {
    capExemption: Object
  },
  data () {
    return {
      visable: false
    }
  },
  mounted () {
    this.visable = true
  },
  computed: {
    referenceData () {
      return referenceData
    },
    fmtCeDate () {
      return fmtCeDate
    },
    displayTeamName () {
      return displayTeamName
    },
    getYears () {
      return getYears
    },
    team () {
      return this.$store.state.team
    },
    leagueId () {
      return this.$store.state.league.yahooLeagueId
    },
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    scadTeams () {
      return this.$store.state.league.scadTeams
    },
    seasonYear () {
      return this.$store.state.league.scadSettings.seasonYear
    },
    salaryCapExemptionLimit () {
      return this.$store.state.league.scadSettings.salaryCapExemptionLimit
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    }
  },
  methods: {
    async saveCE () {
      // console.log('[DRAFTPICK] Method - saveCE()')
      await this.$store.dispatch('capExemptions/saveCapExemption', this.capExemption)
      this.$emit('saved')
      this.close()
    },
    async remove () {
      await this.$store.dispatch('capExemptions/removeCapExemption', this.capExemption._id)
      await this.saveTeamsOnRemove()
      if (this.team.yahooTeam.team_id) { await this.$store.dispatch('team/getTeam', { yahooLeagueId: this.leagueId, yahooTeamId: this.team.yahooTeam.team_id }) }
      this.$emit('saved')
      this.$emit('updateTeam')
      this.close()
    },
    async saveTeamsOnRemove () {
      if (this.capExemption.year == this.seasonYear) {
        let giver = this.scadTeams.find(t => t.yahooLeagueTeamId == this.capExemption.yahooTeamGive.team_id)
        giver.exceptionOut -= this.capExemption.amount
        giver.salary -= this.capExemption.amount
        await this.$store.dispatch('team/saveTeam', giver)

        let reciever = this.scadTeams.find(t => t.yahooLeagueTeamId == this.capExemption.yahooTeamRecieve.team_id)
        reciever.exceptionIn -= this.capExemption.amount
        reciever.salary += this.capExemption.amount
        await this.$store.dispatch('team/saveTeam', reciever)
      }
    },
    close () {
      this.$store.commit('dialog/editCapExemption')
      this.visable = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
