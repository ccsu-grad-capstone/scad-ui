<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-md(style='width: 75%')
      q-card-section
        .text-h6 Create New League
        div {{ this.league }}
      q-separator
      q-form.q-gutter-xs.col-9(@submit='onSubmit' @reset='reset')
        .row
          .col
            q-input(filled dense v-model='$v.league.name.$model' label='League Name' lazy-rules :error='$v.league.name.$error' error-message='Required Field')
        .row.justify-around
          .col-2
            q-select(filled dense v-model='league.capacity' :options='capacity' label='League Capacity')
          .col-2
            q-select(filled dense v-model='league.divisions' :options='divisions' label='Divisions')
          .col-3
            q-select(filled dense v-model='league.draftType' :options='draftType' label='Draft Type')
          .col-3
            q-select(filled dense v-model='league.scoringType' :options='scoringType' label='Scoring Type')
        .row
          .col-6
            .row.q-pa-md.q-mt-md.items-center
              .col-11
                q-slider(v-model='league.teamCap' :min='100' :max='1000' :step='100' label dense :label-value='`$${league.teamCap}`' color='primary')
              div
                | Team Salary Cap: ${{ league.teamCap }}
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | To determine the salary cap limit for each team in your
                    | league.
          .col-6
            .row.q-pa-md.q-mt-md.items-center
              .col-11
                q-slider(v-model='league.irReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.irReliefPerc}%`' color='primary')
              div
                | IR Cap Relief: {{ league.irReliefPerc }}%
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | Determine the cap relief given to players on IR
        .row
          .col-6
            .row.q-pa-md
              .col-11
                q-slider(:value='calcLeagueCap' label dense :min='1600' :max='16000' readonly :label-value='`$${league.leagueCap}`' color='primary')
              div
                | League Salary Cap: ${{ league.leagueCap }}
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | Team Salary Cap x Capacity
          .col-6
            .row.q-pa-md.items-center
              .col-11
                q-slider(v-model='league.tagReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.tagReliefPerc}%`' color='primary')
              div
                | Franchise Tag Relief: {{ league.tagReliefPerc }}%
                q-btn(rounded dense color='info' size='xs' label="What's This?")
                  q-tooltip
                    | To determine the salary cap limit for each team in your
                    | league.
        q-separator(color='secondary' inset)
        .row
          .col-6
            .text-h6.text-center
              | Roster Positions:
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | QB:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.qb' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | RB:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.rb' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | WR:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.wr' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | TE:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.te' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | RB/WR:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.rb_wr' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | RB/WR/TE:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.rb_wr_te' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | QB/RB/WR/TE:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.qb_rb_wr_te' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | K:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.k' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | DEF:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.def' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | IR:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.ir' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | Bench:
              .col-2.q-pa-xs
                q-select(filled dense v-model='league.roster.bn' :options='positionCounts')
            .row
              .col-5.text-subtitle1.text-right.q-pa-xs.q-pt-sm
                | Total Roster Slots:
              .col-2.q-pa-xs
                q-select(disable filled dense :value='calcRosterLimit')
          .col-6
            .text-h6.text-center
              | Stat Categories:
            .row
              .col-6
                .row
                  .col-8.text-body2.text-right.q-pa-xs.q-pt-sm
                    | Passing Yards:
                  .col-3.q-pa-xs
                    q-select(filled dense v-model='league.roster.qb' :options='positionCounts')
        .col-6
          .row.q-gutter-sm.justify-center
            .col-5
              q-select(filled dense v-model='league.waiverType' :options='waiverType' label='Waiver Type')
            .col-5
              q-select(filled dense v-model='league.waiverTime' :options='waiverTime' label='Waiver Time')
      .row.justify-center.q-pt-md
        .col-6
          q-btn-group(spread)
            q-btn(label='Submit' type='submit' dense no-caps color='primary' size='md')
            q-btn(label='Reset' type='reset' dense no-caps color='info' size='md')

</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'CreateLeague',

  data () {
    return {
      league: {
        name: '',
        capacity: 12,
        divisions: 1,
        draftType: 'Auction',
        scoringType: '',
        waiverType: '',
        irReliefPerc: 50,
        tagReliefPerc: 50,
        leagueCap: this.calcLeagueCap,
        teamCap: 250,
        rosterLimit: 0,
        roster: {
          qb: 0,
          rb: 0,
          wr: 0,
          te: 0,
          rb_wr: 0,
          rb_wr_te: 0,
          qb_rb_wr_te: 0,
          k: 0,
          def: 0,
          bn: 0,
          ir: 0
        },
        stats: {
          passYards: 0.04,
          passingTD: 6.0,
          int: -2.0,
          sack: -0.5,
          rushingAttempts: 0.25,
          rushingYards: 0.1,
          rushingTD: 6.0,
          rec: 0.5,
          recYards: 0.1,
          receivingTD: 6.0,
          returnYards: 0.033,
          returnTD: 6.0,
          twoPtConv: 2.0,
          fumbleLost: -2.0,
          offFumbleReturnTD: 6.0,
          fg0_19: 3.0,
          fg20_29: 3.0,
          fg30_39: 3.0,
          fg40_49: 4.0,
          fg50plus: 5.0,
          pat: 1.0,
          defSack: 1.0,
          defInt: 2.0,
          defFumbleRec: 2.0,
          defTD: 6.0,
          defSafety: 2.0,
          blockKick: 2.0,
          specialTeamReturnTD: 6.0,
          defPtsAllowed_0: 7.0,
          defPtsAllowed_1_6: 5.0,
          defPtsAllowed_7_13: 3.0,
          defPtsAllowed_14_20: 1.0,
          defPtsAllowed_21_27: 0.0,
          defPtsAllowed_28_34: -1.0,
          defPtsAllowed_35: -3.0,
          defYardsAllowed_Neg: 7.0,
          defYardsAllowed_0_99: 5.0,
          defYardsAllowed_100_199: 3.0,
          defYardsAllowed_200_299: 1.0,
          defYardsAllowed_300_399: 0.0,
          defYardsAllowed_400_499: -1.0,
          defYardsAllowed_500: -3.0,
          extraPointsReturned: 2.0
        },
        franchiseTagSpots: 0
      },
      capacity: [8, 10, 12, 14, 16],
      divisions: [1, 2, 3, 4],
      draftType: ['Auction', 'Snake'],
      scoringType: ['Head-to-Head', 'Points-Only'],
      waiverType: ['FAAB', 'Rolling Waivers'],
      positionCounts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  validations: {
    league: {
      name: { required }
    }
  },
  created () {},
  destroyed () {
    this.reset()
  },
  computed: {
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
      console.log('[CREATELEAGUE - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('CreateLeague Validation failed')
      } else {
        console.log('CreateLeague Validation Successful', this.league)
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

    reset: function () {
      Object.assign(this.$data, this.initializeState())
      this.resetValidation()
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
