<template lang="pug">
  q-dialog(v-model='visable' persistent)
    q-card(style="width: 500px; max-width: 100vw;")
      q-card-section.row
        .col.text-center.text-h5.text-weight-bolder  Cap Exemption
      q-card-section.row.items-center
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Year:
          .col-3.q-pl-sm: q-select(dense v-model='$v.capExemption.year.$model' :options='getYears()' :error='$v.capExemption.year.$error' error-message='Required Field')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Giving Team:
          .col.q-pl-sm: q-select(dense v-model='$v.capExemption.yahooTeamGive.$model' :options='filteredTeams' :display-value='displayTeam(capExemption.yahooTeamGive.name)' :error='$v.capExemption.yahooTeamGive.$error' error-message='Required Field')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Recieving Team:
          .col.q-pl-sm: q-select(dense v-model='$v.capExemption.yahooTeamRecieve.$model' :options='filteredTeams' :display-value='displayTeam(capExemption.yahooTeamRecieve)' :error='$v.capExemption.yahooTeamRecieve.$error' error-message='Required Field')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Amount:
          .col-2.q-pl-sm: q-select(dense v-model='$v.capExemption.amount.$model' :options='referenceData.capExemptionAmount(80)' :error='$v.capExemption.amount.$error' error-message='Required Field')
          .text-caption.q-pt-md dollars
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Comments:
          .col.q-ma-sm.text-grey: q-input(v-model='capExemption.comments' filled type='textarea')
      q-card-actions.row.justify-around
        q-btn(flat label='Cancel' color='primary' @click="close()")
        q-btn(flat label='Save' color='primary' @click="saveCE()")
</template>

<script>
/* eslint-disable eqeqeq */
import referenceData from '../../utilities/referenceData'
import notify from '../../utilities/nofity'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'AddCapExemptionDialog',
  props: {
  },
  data () {
    return {
      visable: false,
      capExemption: {
        yahooLeagueId: '',
        year: '',
        timestamp: '',
        yahooTeamGive: '',
        yahooTeamRecieve: '',
        amount: '',
        comments: ''
      }
    }
  },
  validations: {
    capExemption: {
      year: { required },
      yahooTeamGive: { required },
      yahooTeamRecieve: { required },
      amount: { required }
    }
  },
  mounted () {
    this.visable = true
    this.capExemption.yahooLeagueId = this.leagueId
  },
  computed: {
    referenceData () {
      return referenceData
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
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('SAVE-CE Validation Failed')
      } else {
        if (this.checkTeams()) {
          await this.saveTeams()
          this.capExemption.appliedToTeamSalary = true
          await this.$store.dispatch('capExemptions/addCapExemption', this.capExemption)
          this.$emit('saved')
          this.close()
        }
      }
    },
    async saveTeams () {
      if (this.capExemption.year == this.seasonYear) {
        let giver = this.scadTeams.find(t => t.yahooLeagueTeamId == this.capExemption.yahooTeamGive.team_id)
        giver.exceptionOut += this.capExemption.amount
        giver.salary += this.capExemption.amount
        await this.$store.dispatch('team/saveTeam', giver)

        let reciever = this.scadTeams.find(t => t.yahooLeagueTeamId == this.capExemption.yahooTeamRecieve.team_id)
        reciever.exceptionIn += this.capExemption.amount
        reciever.salary -= this.capExemption.amount
        await this.$store.dispatch('team/saveTeam', reciever)
      }
    },
    checkTeams () {
      let giver = this.scadTeams.find(t => t.yahooLeagueTeamId == this.capExemption.yahooTeamGive.team_id)
      let reciever = this.scadTeams.find(t => t.yahooLeagueTeamId == this.capExemption.yahooTeamRecieve.team_id)
      if (this.salaryCapExemptionLimit - giver.exceptionOut - this.capExemption.amount < 0) {
        console.log('SAVE-CE CheckTeams Failed')
        notify.exemptionGiverError(this.capExemption.yahooTeamGive.name)
        return false
      } else if (this.salaryCapExemptionLimit - reciever.exceptionIn - this.capExemption.amount < 0) {
        console.log('SAVE-CE CheckTeams Failed')
        notify.exemptionRecieverError(this.capExemption.yahooTeamReciever.name)
        return false
      } else {
        return true
      }
    },
    close () {
      this.$store.commit('dialog/addCapExemption')
      this.visable = false
    },
    displayTeam (team) {
      if (team) {
        return team.name
      } else { return '' }
    },
    getYears () {
      let years = []
      for (let i = 0; i < 5; i++) {
        years.push(this.seasonYear + i)
      }
      return years
    }
  }
}
</script>

<style lang="scss" scoped></style>