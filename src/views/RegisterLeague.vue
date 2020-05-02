<template lang="pug">
  q-page.flex
    .row.full-width.justify-center
      .row.full-width(v-if="!loaded")
        .row.full-width.justify-center
          q-circular-progress.q-mt-xl(
            indeterminate
            size="90px"
            :thickness="0.2"
            color="primary"
            center-color="grey-5"
            track-color="transparent"
            class="q-ma-md"
            )
      .row.register-width(v-else)
        q-card.q-pa-md.q-ma-lg(v-if="yahooCommishLeagues.length > 0")
          q-card-section.row.justify-center
            .text-h4.text-weight-bolder Register Your Yahoo League With SCAD
          q-card-section.row.justify-center
            .text-body2.text-center To register your league with SCAD you must be an eligable commissioner of your Yahoo League.  If the league you're looking to register is not listed below, please reach out to the league commissioner to register with SCAD.
            router-link.text-primary.text-weight-bold(to="my-profile") View your profile for more information.
          q-form(@submit='onSubmit')
            q-separator.q-mb-lg(color='secondary' inset)
            .row.q-pb-md
              .col-3.text-subtitle2.text-right.q-pt-sm
                | Choose your league:
              .col-7.q-pl-lg
                q-select( filled dense v-model='$v.selectedLeague.$model' :options="filteredLeagues" hint="Commissioned leagues shown here" @input="update()" :error='$v.selectedLeague.$error' error-message='Required Field')
            .row.q-pb-md
              .col-3.text-subtitle2.text-right
                | League Name:
              .col-7.q-pl-lg
                | {{this.newLeague.yahooLeagueName}}
            .row.q-pb-md
              .col-3.text-subtitle2.text-right
                | League Id:
              .col-7.q-pl-lg
                | {{this.newLeague.yahooLeagueId}}
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
                | Team Salary Cap: ${{ newLeague.teamSalaryCap }}
              .col-7.q-pl-lg
                q-slider(v-model='newLeague.teamSalaryCap' :min='100' :max='1000' :step='5' label dense :label-value='`$${newLeague.teamSalaryCap}`' color='primary')
              .col-2.q-px-sm
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | Salary Cap alloted to each team
            .row.q-py-md
              .col-3.text-subtitle2.text-right
                | League Salary Cap: ${{ newLeague.leagueSalaryCap }}
              .col-7.q-pl-lg
                q-slider(:value='calcLeagueCap' label dense :min='1600' :max='16000' readonly :label-value='`$${newLeague.leagueSalaryCap}`' color='primary')
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
                | Franchise Tag Discount: ${{ newLeague.franchiseTagDiscount }}
              .col-7.q-pl-lg
                q-slider(v-model='newLeague.franchiseTagDiscount' :min='0' :max='50' :step='1' label dense :label-value='`$${newLeague.franchiseTagDiscount}`' color='primary')
              .col-2.q-px-sm
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | Salary Cap discount given to franchise tagged player(s).
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | Franchise Tags:
              .col-2.q-pl-lg
                q-select( filled dense v-model='newLeague.franchiseTagSpots' :options='referenceData.franchiseTags' :error='$v.newLeague.franchiseTagSpots.$error' error-message='Required Field')
              .col-2.q-px-sm.q-pt-sm
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | When a player is franchise tagged, their salary is discounted for the year, but you must cut them after the season.
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | Draft Pick Trading Limit:
              .col-2.q-pl-lg
                q-select( filled dense label='Years' stack-label v-model='newLeague.tradingDraftPickYears' :options='referenceData.tradingDraftPickYears' :error='$v.newLeague.tradingDraftPickYears.$error' error-message='Required Field')
              .col-2.q-px-sm.q-pt-sm
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | Limit the number of years teams can trade future draft picks.
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | Roster Spot Limit:
              .col-2.q-pl-lg
                q-select( filled dense v-model='newLeague.rosterSpotLimit' :options='referenceData.rosterSpotLimit()' :error='$v.newLeague.rosterSpotLimit.$error' error-message='Required Field')
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
                q-select( filled dense v-model='newLeague.qbMin' :options='referenceData.rosterLimits' :error='$v.newLeague.qbMin.$error' error-message='')
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.qbMax' :options='referenceData.rosterLimits' :error='$v.newLeague.qbMax.$error' error-message='')
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | RB:
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.rbMin' :options='referenceData.rosterLimits' :error='$v.newLeague.rbMin.$error' error-message='')
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.rbMax' :options='referenceData.rosterLimits' :error='$v.newLeague.rbMax.$error' error-message='')
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | WR:
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.wrMin' :options='referenceData.rosterLimits' :error='$v.newLeague.wrMin.$error' error-message='')
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.wrMax' :options='referenceData.rosterLimits' :error='$v.newLeague.wrMax.$error' error-message='')
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | TE:
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.teMin' :options='referenceData.rosterLimits' :error='$v.newLeague.teMin.$error' error-message='')
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.teMax' :options='referenceData.rosterLimits' :error='$v.newLeague.teMax.$error' error-message='')
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | K:
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.kMin' :options='referenceData.rosterLimits' :error='$v.newLeague.kMin.$error' error-message='')
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.kMax' :options='referenceData.rosterLimits' :error='$v.newLeague.kMax.$error' error-message='')
            .row
              .col-3.text-subtitle2.text-right.q-pt-sm
                | DEF:
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.defMin' :options='referenceData.rosterLimits' :error='$v.newLeague.defMin.$error' error-message='')
              .col-1.q-pl-lg
                q-select( filled dense v-model='newLeague.defMax' :options='referenceData.rosterLimits' :error='$v.newLeague.defMax.$error' error-message='')
            q-separator.q-my-lg(color='secondary' inset)
          .row.justify-center
            .col-3
              q-btn-group(spread)
                q-btn(label='Submit' type='submit' dense no-caps color='primary' size='md' @click="onSubmit")
          //- q-dialog(v-model='registerLeagueInvites' persistent)
          //-   register-league-invites
        q-card.q-pa-md.q-ma-lg(v-else style='width: 100%')
          q-card-section.row.justify-center
            .row.full-width.justify-center
              .text-h4.text-weight-bolder Ught Oh..
            .row.full-width.justify-center.q-pt-lg
              .text-body1
                | In order to create a league with #[strong.text-body1.text-primary.text-weight-bolder SCAD], you must be a league commissioner for one of your pre-existing
            .row.full-width.justify-center
              .text-body1
                | Yahoo! Fantasy Football leagues.  Based on our information, that doesn't not appear to be the case.
            .row.full-width.justify-center.q-pt-lg
              .text-body1.text-weight-bolder.text-primary.text-uppercase
                | We appologize for the inconvenience.
            .row.full-width.justify-center.q-pt-lg
              .text-body1
                | Feel free to choose your league below, and we'll send along an email to the commissioner on your behalf.
            .row.full-width.justify-center.q-pt-lg
              .col-3.text-subtitle2.text-right.q-pt-sm
                | Your Yahoo! leagues:
              .col-7.q-pl-lg
                q-select( filled dense v-model='$v.selectedLeague.$model' :options="yahooFilteredLeagues" @input="update()" :error='$v.selectedLeague.$error' error-message='Required Field')
              .col.q-pl-lg.q-pt-xs
                q-btn(label='Send Email' type='submit' dense no-caps color='primary' size='md' @click="sendEmail()")

</template>

<script>
import { required } from 'vuelidate/lib/validators'
import referenceData from '../utilities/referenceData'
import RegisterLeagueInvites from '../components/dialogs/registerLeagueInvites'
import notify from '../utilities/nofity'
import { scad } from '../utilities/axios-scad'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'

export default {
  name: 'RegisterLeague',
  components: {
    'register-league-invites': RegisterLeagueInvites
  },
  data () {
    return {
      loaded: false,
      selectedLeague: '',
      newLeague: {
        yahooLeagueId: '',
        yahooLeagueName: '',
        leagueManagers: '',
        rookieDraftRds: '',
        rookieDraftStrategy: '',
        rookieWageScale: '',
        teamSalaryCap: 250,
        leagueSalaryCap: 1600,
        salaryCapExemptionLimit: 25,
        irReliefPerc: 50,
        franchiseTagDiscount: 25,
        franchiseTagSpots: '',
        tradingDraftPickYears: '',
        rosterSpotLimit: 25,
        renewSCADLeagueId: 0,
        qbMin: '2',
        qbMax: '4',
        rbMin: '4',
        rbMax: '7',
        wrMin: '4',
        wrMax: '8',
        teMin: '2',
        teMax: '4',
        kMin: '0',
        kMax: '2',
        defMin: '2',
        defMax: '4'
      }
    }
  },
  validations: {
    selectedLeague: { required },
    newLeague: {
      yahooLeagueId: { required },
      yahooLeagueName: { required },
      leagueManagers: { required },
      rookieDraftRds: { required },
      rookieDraftStrategy: { required },
      rookieWageScale: { required },
      teamSalaryCap: { required },
      leagueSalaryCap: { required },
      salaryCapExemptionLimit: { required },
      irReliefPerc: { required },
      franchiseTagDiscount: { required },
      franchiseTagSpots: { required },
      tradingDraftPickYears: { required },
      rosterSpotLimit: { required },
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
  async mounted () {
    await this.$store.dispatch('league/getAllYahooCommishLeagues')
    this.loaded = true
  },
  computed: {
    referenceData () {
      return referenceData
    },
    tokens () {
      return this.$store.state.user.tokens
    },
    calcLeagueCap () {
      this.setLeagueCap()
      return this.newLeague.leagueSalaryCap
    },
    league () {
      return this.$store.state.league
    },
    yahooCommishLeagues () {
      return this.league.yahooCommishLeagues
    },
    yahooLeagues () {
      return this.$store.state.league.yahooLeagues
    },
    filteredLeagues () {
      return this.yahooCommishLeagues.map(l => Object.assign({}, l, { value: l.name, label: l.name }))
    },
    yahooFilteredLeagues () {
      return this.yahooLeagues.map(l => Object.assign({}, l, { value: l.name, label: l.name }))
    },
    registerLeagueInvites () {
      return this.$store.state.dialog.registerLeagueInvites
    }
  },
  methods: {
    async onSubmit () {
      console.log('[REGISTERLEAGUE - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('REGISTERLEAGUE Validation Failed')
      } else {
        console.log('REGISTERLEAGUE Validation Successful', this.newLeague)

        // Show the page as loading for 5 seconds, then redirect to the dashboard
        this.$q.loading.show({
          message: 'Sit tight while we put together a SCAD league for you'
        })
        await this.$store.dispatch('league/registerLeague', { league: this.newLeague })
        await this.$store.dispatch('league/dashboard')
        this.$router.push('/dashboard')
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
        }, 5000)

        // Used to open dialog for emailing league about SCAD league
        // this.registerLeagueInvites = true
      }
    },
    setLeagueCap () {
      if (this.newLeague.leagueManagers) {
        this.newLeague.leagueSalaryCap = this.newLeague.teamSalaryCap * this.newLeague.leagueManagers
      }
    },
    resetValidation () {
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    async update () {
      console.log('[REGISTERLEAGUE - Methods] - update()')

      // check if league already exists
      try {
        const response = await scad(
          this.tokens.access_token,
          this.tokens.id_token)
          .get(`scad/league/yahoo/${this.selectedLeague.league_id}`)
        console.log('LEAGUE ALREADY EXISTS: ', response)
        notify.leagueAlreadyRegistered()
        this.selectedLeague = ''
        this.newLeague.yahooLeagueId = ''
        this.newLeague.yahooLeagueName = ''
        this.newLeague.leagueManagers = ''
      } catch (err) {
        if (err.response.status === 404) {
          console.log('League not found, you may proceed registering..')
          this.newLeague.yahooLeagueId = this.selectedLeague.league_id
          this.newLeague.yahooLeagueName = this.selectedLeague.name
          this.newLeague.leagueManagers = this.selectedLeague.num_teams
        } else {
          catchAxiosScadError(err)
        }
      }
    },
    async sendEmail () {
      console.log('[REGISTERLEAGUE - Methods] - sendRequestEmail()')
      try {
        const response = await scad(
          this.tokens.access_token,
          this.tokens.id_token)
          .post(`/scad/email/request/${this.selectedLeague.league_id}`)
        notify.emailCommissioner(response.data.msg)
        this.$router.push('/about')
      } catch (err) {
        catchAxiosScadError(err)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.register-width
  width: 1100px
</style>
