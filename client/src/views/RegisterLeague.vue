<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-md(style='width: 75%')
      q-card-section
        .text-h4 Register Yahoo League With SCAD
      q-form(@submit='onSubmit')
        q-separator.q-my-lg(color='secondary' inset)
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Choose your league:
          .col-7.q-pl-lg
            q-select( rounded outlined dense v-model='$v.league.yahooLeagueID.$model' lazy-rules :error='$v.league.yahooLeagueID.$error' error-message='Required Field')
        .row.q-pb-md
          .col-3.text-subtitle2.text-right
            | League Managers:
          .col-7.q-pl-lg
            | {{this.league.leagueManagers}}
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Rookie Draft Rounds:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='$v.league.rookieDraftRds.$model' :options='referenceData.rookieDraftRounds' :error='$v.league.rookieDraftRds.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Rookie Draft Strategy:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='$v.league.rookieDraftStrategy.$model' :options='referenceData.rookieDraftStrategy' :error='$v.league.rookieDraftStrategy.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Rookie Wage Scale:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='$v.league.rookieWageScale.$model' :options='referenceData.rookieWageScale' :error='$v.league.rookieWageScale.$error' error-message='Required Field')
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | Team Salary Cap: ${{ league.teamCap }}
          .col-7.q-pl-lg
            q-slider(v-model='league.teamCap' :min='100' :max='1000' :step='100' label dense :label-value='`$${league.teamCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Salary Cap alloted to each team
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | League Salary Cap: ${{ league.leagueCap }}
          .col-7.q-pl-lg
            q-slider(:value='calcLeagueCap' label dense :min='1600' :max='16000' readonly :label-value='`$${league.leagueCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | Salary Cap Exemption Limit: ${{ league.salaryCapExemptionLimit }}
          .col-7.q-pl-lg
            q-slider(v-model='league.salaryCapExemptionLimit' :min='0' :max='100' :step='5' label dense :label-value='`${league.salaryCapExemptionLimit}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Limit on team salary allowed to both trade away and for during season.
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | IR Cap Relief: {{ league.irReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='league.irReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.irReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Salary Cap discount given to IR player
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | Franchise Tag Relief: {{ league.tagReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='league.franchiseTagReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.franchiseTagReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Salary Cap discount given to franchise tagged player(s)
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Franchise Tags:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.franchiseTagSpots' :options='referenceData.positionCounts' :error='$v.league.franchiseTagSpots.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Draft Pick Trading Limit:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.tradingDraftPickYears' :options='referenceData.tradingDraftPickYears' :error='$v.league.tradingDraftPickYears.$error' error-message='Required Field')
          .col-3.text.text-left.q-pt-sm.q-pl-sm
            | Years
        q-separator.q-my-lg(color='secondary' inset)
      .row.justify-center
        .col-3
          q-btn-group(spread)
            q-btn(label='Submit' type='submit' dense no-caps color='primary' size='md' @click="onSubmit")

</template>

<script>
import { required } from 'vuelidate/lib/validators'
import referenceData from '../utilities/referenceData'
export default {
  name: 'RegisterLeague',

  data () {
    return {
      league: {
        yahooLeagueID: '',
        yahooLeagueName: '',
        leagueManagers: 12,
        rookieDraftRds: 3,
        rookieDraftStrategy: 'Message Board',
        rookieWageScale: 'Standard',
        teamCap: 250,
        leagueCap: this.calcLeagueCap,
        salaryCapExemptionLimit: 25,
        irReliefPerc: 50,
        franchiseTagReliefPerc: 50,
        franchiseTagSpots: 1,
        tradingDraftPickYears: 5
      }
    }
  },
  validations: {
    league: {
      yahooLeagueID: { required },
      yahooLeagueName: { required },
      leagueManagers: { required },
      rookieDraftRds: { required },
      rookieDraftStrategy: { required },
      rookieWageScale: { required },
      teamCap: { required },
      leagueCap: { required },
      salaryCapExemptionLimit: { required },
      irReliefPerc: { required },
      franchiseTagReliefPerc: { required },
      franchiseTagSpots: { required },
      tradingDraftPickYears: { required }
    }
  },
  created () {},
  computed: {
    referenceData () {
      return referenceData
    },
    calcLeagueCap () {
      this.setLeagueCap()
      return this.league.leagueCap
    },
    calcRosterLimit () {
      this.setRosterLimit()
      return this.league.rosterLimit
    }
  },
  methods: {
    onSubmit () {
      console.log('[REGISTERLEAGUE - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('REGISTERLEAGUE Validation failed')
      } else {
        console.log('REGISTERLEAGUE Validation Successful', this.league)
        this.$store.dispatch('league/registerLeague', this.league)
        this.$router.push({
          path: 'dashboard'
        })
      }
    },
    setLeagueCap () {
      this.league.leagueCap = this.league.teamCap * this.league.leagueManagers
    },
    setRosterLimit () {
      let counts = Object.values(this.league.roster)
      const sumArray = arr => arr.reduce((a, b) => a + b, 0)
      this.league.rosterLimit = sumArray(counts)
    },
    resetValidation () {
      this.$nextTick(() => {
        this.$v.$reset()
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
