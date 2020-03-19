<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-lg(style='width: 100%')
      q-card-section.row.justify-center
        .text-h4.text-weight-bolder Register Your Yahoo League With SCAD
      q-form(@submit='onSubmit')
        q-separator.q-mb-lg(color='secondary' inset)
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Choose your league:
          .col-7.q-pl-lg
            q-select( filled dense v-model='$v.newLeague.yahooLeagueName.$model' :options="yahooTeams" @input="updateWithYahooDetails()" lazy-rules :error='$v.newLeague.yahooLeagueName.$error' error-message='Required Field')
        .row.q-pb-md
          .col-3.text-subtitle2.text-right
            | League Managers:
          .col-7.q-pl-lg
            | {{this.newLeague.leagueManagers}}
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Rookie Draft Rounds:
          .col-2.q-pl-lg
            q-select( filled dense v-model='$v.newLeague.rookieDraftRds.$model' :options='referenceData.rookieDraftRounds' :error='$v.newLeague.rookieDraftRds.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Rookie Draft Strategy:
          .col-3.q-pl-lg
            q-select( filled dense v-model='$v.newLeague.rookieDraftStrategy.$model' :options='referenceData.rookieDraftStrategy' :error='$v.newLeague.rookieDraftStrategy.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Rookie Wage Scale:
          .col-2.q-pl-lg
            q-select( filled dense v-model='$v.newLeague.rookieWageScale.$model' :options='referenceData.rookieWageScale' :error='$v.newLeague.rookieWageScale.$error' error-message='Required Field')
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | Team Salary Cap: ${{ newLeague.teamCap }}
          .col-7.q-pl-lg
            q-slider(v-model='newLeague.teamCap' :min='100' :max='1000' :step='5' label dense :label-value='`$${newLeague.teamCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Salary Cap alloted to each team
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | League Salary Cap: ${{ newLeague.leagueCap }}
          .col-7.q-pl-lg
            q-slider(:value='calcLeagueCap' label dense :min='1600' :max='16000' readonly :label-value='`$${newLeague.leagueCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | Salary Cap Exemption Limit: ${{ newLeague.salaryCapExemptionLimit }}
          .col-7.q-pl-lg
            q-slider(v-model='newLeague.salaryCapExemptionLimit' :min='0' :max='100' :step='5' label dense :label-value='`$${newLeague.salaryCapExemptionLimit}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Limit on team salary allowed to both trade away and for during season.
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | IR Cap Relief: {{ newLeague.irReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='newLeague.irReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${newLeague.irReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Salary Cap discount given to IR player
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | Franchise Tag Relief: {{ newLeague.tagReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='newLeague.franchiseTagReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${newLeague.franchiseTagReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Salary Cap discount given to franchise tagged player(s)
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Franchise Tags:
          .col-2.q-pl-lg
            q-select( filled dense v-model='newLeague.franchiseTagSpots' :options='referenceData.franchiseTags' :error='$v.newLeague.franchiseTagSpots.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Draft Pick Trading Limit:
          .col-2.q-pl-lg
            q-select( filled dense v-model='newLeague.tradingDraftPickYears' :options='referenceData.tradingDraftPickYears' :error='$v.newLeague.tradingDraftPickYears.$error' error-message='Required Field')
          .col-3.text.text-left.q-pt-sm.q-pl-sm
            | Years
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | Roster Limits:
          .col-1.text-caption.text-center.q-pt-sm.q-pl-md
            | min
          .col-1.text-caption.text-center.q-pt-sm.q-pl-md
            | max

        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | QB:
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.qbMin' :options='referenceData.rosterLimits' :error='$v.newLeague.qbMin.$error' error-message='Required Field')
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.qbMax' :options='referenceData.rosterLimits' :error='$v.newLeague.qbMax.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | RB:
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.rbMin' :options='referenceData.rosterLimits' :error='$v.newLeague.rbMin.$error' error-message='Required Field')
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.rbMax' :options='referenceData.rosterLimits' :error='$v.newLeague.rbMax.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | WR:
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.wrMin' :options='referenceData.rosterLimits' :error='$v.newLeague.wrMin.$error' error-message='Required Field')
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.wrMax' :options='referenceData.rosterLimits' :error='$v.newLeague.wrMax.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | TE:
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.teMin' :options='referenceData.rosterLimits' :error='$v.newLeague.teMin.$error' error-message='Required Field')
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.teMax' :options='referenceData.rosterLimits' :error='$v.newLeague.teMax.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | K:
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.kMin' :options='referenceData.rosterLimits' :error='$v.newLeague.kMin.$error' error-message='Required Field')
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.kMax' :options='referenceData.rosterLimits' :error='$v.newLeague.kMax.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-sm
            | DEF:
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.defMin' :options='referenceData.rosterLimits' :error='$v.newLeague.defMin.$error' error-message='Required Field')
          .col-1.q-pl-lg
            q-select( filled dense v-model='newLeague.defMax' :options='referenceData.rosterLimits' :error='$v.newLeague.defMax.$error' error-message='Required Field')
        q-separator.q-my-lg(color='secondary' inset)
      .row.justify-center
        .col-3
          q-btn-group(spread)
            q-btn(label='Submit' type='submit' dense no-caps color='primary' size='md' @click="onSubmit")
    q-dialog(v-model='registerLeagueInvites' persistent)
      register-league-invites
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import referenceData from '../utilities/referenceData'
import RegisterLeagueInvites from '../components/dialogs/registerLeagueInvites'

import { createHelpers } from 'vuex-map-fields'
const { mapFields } = createHelpers({
  getterType: 'dialog/getField',
  mutationType: 'dialog/updateField'
})

export default {
  name: 'RegisterLeague',
  components: {
    'register-league-invites': RegisterLeagueInvites
  },
  data () {
    return {
      newLeague: {
        yahooLeagueId: '',
        yahooLeagueName: '',
        leagueManagers: undefined,
        rookieDraftRds: 3,
        rookieDraftStrategy: 'Message Board',
        rookieWageScale: 'Standard',
        teamCap: 250,
        leagueCap: 1600,
        salaryCapExemptionLimit: 25,
        irReliefPerc: 50,
        franchiseTagReliefPerc: 50,
        franchiseTagSpots: 1,
        tradingDraftPickYears: 5,
        qbMin: 2,
        qbMax: 4,
        rbMin: 4,
        rbMax: 7,
        wrMin: 5,
        wrMax: 8,
        teMin: 2,
        teMax: 4,
        kMin: 0,
        kMax: 2,
        defMin: 2,
        defMax: 4
      }
    }
  },
  validations: {
    newLeague: {
      yahooLeagueId: { required },
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
      tradingDraftPickYears: { required },
      qbMin: { required },
      qbMax: { required },
      rbMin: { required },
      rbMax: { required },
      wrMin: { required },
      wrMax: { required },
      teMin: { required },
      teMax: { required },
      kMin: { required },
      kMax: { required },
      defMin: { required },
      defMax: { required }
    }
  },
  created () {
  },
  computed: {
    ...mapFields([
      'registerLeagueInvites'
    ]),
    referenceData () {
      return referenceData
    },
    calcLeagueCap () {
      this.setLeagueCap()
      return this.newLeague.leagueCap
    },
    calcRosterLimit () {
      this.setRosterLimit()
      return this.newLeague.rosterLimit
    },
    league () {
      return this.$store.state.league
    },
    yahooTeams () {
      return this.$store.getters['league/getTeams']
    },
    getYahooLeagueId () {
      return this.$store.getters['league/yahooLeagueId'](this.newLeague.yahooLeagueName)
    },
    getYahooLeagueManagers () {
      return this.$store.getters['league/yahooLeagueManagers'](this.newLeague.yahooLeagueName)
    }
  },
  methods: {
    async onSubmit () {
      console.log('[REGISTERLEAGUE - Methods] - onSubmit()')

      // Show the page as loading for 5 seconds, then redirect to the dashboard
      this.$q.loading.show({
        message: 'Sit tight while we put together a SCAD league for you'
      })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
        this.$router.push('/dashboard')
      }, 5000)

      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('REGISTERLEAGUE Validation Failed')
      } else {
        console.log('REGISTERLEAGUE Validation Successful', this.newLeague)

        // Used to open dialog for emailing league about SCAD league
        // this.registerLeagueInvites = true

        await this.$store.dispatch('league/registerLeague', { league: this.newLeague })
      }
    },
    setLeagueCap () {
      if (this.newLeague.leagueManagers) {
        this.newLeague.leagueCap = this.newLeague.teamCap * this.newLeague.leagueManagers
      }
    },
    setRosterLimit () {
      let counts = Object.values(this.newLeague.roster)
      const sumArray = arr => arr.reduce((a, b) => a + b, 0)
      this.newLeague.rosterLimit = sumArray(counts)
    },
    resetValidation () {
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    updateWithYahooDetails () {
      console.log('[REGISTERLEAGUE - Methods] - updateLeagueId()')
      this.newLeague.yahooLeagueId = this.getYahooLeagueId
      this.newLeague.leagueManagers = this.getYahooLeagueManagers
    }
  }
}
</script>

<style lang="stylus" scoped></style>
