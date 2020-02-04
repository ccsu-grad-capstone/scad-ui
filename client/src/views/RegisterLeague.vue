<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-md(style='width: 75%')
      q-card-section
        .text-h6 Register Yahoo League With SCAD
      q-form(@submit='onSubmit')
        q-separator.q-my-lg(color='secondary' inset)
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Choose your league
          .col-7.q-pl-lg
            q-select( rounded outlined dense v-model='$v.league.name.$model' lazy-rules :error='$v.league.name.$error' error-message='Required Field')
        .row.text-h6.justify-center
          | SCAD Settings
        .row.q-pt-md
          .col-3.text-subtitle2.text-right.q-pt-md
            | Rookie Draft Rounds:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.rookieDraftRds' :options='referenceData.rookieDraftRds' :error='$v.league.rookieDraftRds.$error' error-message='Required Field')
        .row.q-py-md
          .col-3.text-subtitle2.text-right.q-pt
            | Team Salary Cap: ${{ league.teamCap }}
          .col-7.q-pl-lg
            q-slider(v-model='league.teamCap' :min='100' :max='1000' :step='100' label dense :label-value='`$${league.teamCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity        .row.q-pt-md
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | League Salary Cap: ${{ league.leagueCap }}
          .col-7.q-pl-lg
            q-slider(:value='calcLeagueCap' label dense :min='1600' :max='16000' readonly :label-value='`$${league.leagueCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        .row.q-pb-md
          .col-3.text-subtitle2.text-right
            | IR Cap Relief: {{ league.irReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='league.irReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.irReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Franchise Tags:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.franchiseTagSpots' :options='referenceData.positionCounts' :error='$v.league.franchiseTagSpots.$error' error-message='Required Field')
        .row.q-pb-md
          .col-3.text-subtitle2.text-right
            | Franchise Tag Relief: {{ league.tagReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='league.tagReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.tagReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        q-separator.q-mt-md(color='secondary' inset)
      .row.justify-center.q-pt-md
        .text-caption *default roster positions and scoring set across the board, be sure to adjust accordingly*
      .row.justify-center
        .col-6
          q-btn-group(spread)
            q-btn(label='Submit' type='submit' dense no-caps color='primary' size='md' @click="onSubmit")

</template>

<script>
import { required, decimal } from 'vuelidate/lib/validators'
import referenceData from '../utilities/referenceData'
export default {
  name: 'RegisterLeague',

  data () {
    return {
      league: {
        name: '',
        yahooLeagueID: '',
        irReliefPerc: 50,
        tagReliefPerc: 50,
        rookieDraftRds: 3,
        teamCap: 250,
        leagueCap: this.calcLeagueCap,
        franchiseTagSpots: 1
      }
    }
  },
  validations: {
    league: {
      name: { required },
      rookieDraftRds: { required },
      roster: {
        qb: { required },
        rb: { required },
        wr: { required },
        te: { required },
        rb_wr: { required },
        rb_wr_te: { required },
        qb_rb_wr_te: { required },
        k: { required },
        def: { required },
        bn: { required }
      },
      ir: { required },
      franchiseTagSpots: { required },
      stats: {
        passYards: { required, decimal },
        passingTD: { required, decimal },
        int: { required, decimal },
        sack: { required, decimal },
        rushingAttempts: { required, decimal },
        rushingYards: { required, decimal },
        rushingTD: { required, decimal },
        rec: { required, decimal },
        recYards: { required, decimal },
        receivingTD: { required, decimal },
        returnYards: { required, decimal },
        returnTD: { required, decimal },
        twoPtConv: { required, decimal },
        fumbleLost: { required, decimal },
        offFumbleReturnTD: { required, decimal },
        fg0_19: { required, decimal },
        fg20_29: { required, decimal },
        fg30_39: { required, decimal },
        fg40_49: { required, decimal },
        fg50plus: { required, decimal },
        pat: { required, decimal },
        defSack: { required, decimal },
        defInt: { required, decimal },
        defFumbleRec: { required, decimal },
        defTD: { required, decimal },
        defSafety: { required, decimal },
        blockKick: { required, decimal },
        specialTeamReturnTD: { required, decimal },
        defPtsAllowed_0: { required, decimal },
        defPtsAllowed_1_6: { required, decimal },
        defPtsAllowed_7_13: { required, decimal },
        defPtsAllowed_14_20: { required, decimal },
        defPtsAllowed_21_27: { required, decimal },
        defPtsAllowed_28_34: { required, decimal },
        defPtsAllowed_35: { required, decimal },
        defYardsAllowed_Neg: { required, decimal },
        defYardsAllowed_0_99: { required, decimal },
        defYardsAllowed_100_199: { required, decimal },
        defYardsAllowed_200_299: { required, decimal },
        defYardsAllowed_300_399: { required, decimal },
        defYardsAllowed_400_499: { required, decimal },
        defYardsAllowed_500: { required, decimal },
        extraPointsReturned: { required, decimal }
      }
    }
  },
  created () {},
  destroyed () {
    this.reset()
  },
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
        this.$store.dispatch('league/creatLeague', this.league)
        this.$router.push({
          path: 'dashboard'
        })
      }
    },
    setLeagueCap () {
      this.league.leagueCap = this.league.teamCap * this.league.capacity
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
