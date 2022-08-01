<template lang="pug">
  q-dialog(v-model='visible' persistent)
    q-card(style="width: 600px; max-width: 80vw;")
      q-card-section.row
        .col.text-center.text-h5.text-weight-bolder  {{ dp.year }} - {{ outputRound(dp.rd) }} Round
      q-card-section.row.items-center
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Pick:
          .col-3.q-pl-sm: q-select(dense v-model='dp.pick' :options='referenceData.twelveTeams')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Owner:
          .col-6.q-pl-sm: q-select(dense v-model='dp.team' :options='filteredTeams' :display-value='dp.team.name')
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Original Owner:
          .col.q-ma-sm.text-grey {{dp.originalTeam.name}}
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Condition:
          .q-ma-sm
            q-toggle(filled dense v-model='dp.hasCondition')
          .col.q-ma-sm.text-caption.text-grey-7(v-if="dp.hasCondition") Pick has a condition and is likely un-tradeable, see comments.
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Comments:
          .col.q-ma-sm.text-grey: q-input(v-model='dp.comments' filled type='textarea')
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-mx-sm History:
          .col
            q-list(v-for="(log, i) in dp.log" :key="i" dense)
              q-item.text-grey {{log}}

      q-card-actions.row.justify-around
        q-btn(flat label='Cancel' color='primary' @click="close()")
        q-btn(flat label='Save' color='primary' @click="savePick()")
</template>

<script>
import referenceData from '../../utilities/referenceData'
import { outputRound } from '../../utilities/formatters'
import { getTeamGuid } from '../../utilities/functions'
import moment from 'moment'

export default {
  name: 'EditDraftPickDialog',
  props: {
    dp: Object
  },
  data () {
    return {
      visible: false,
      initOwner: {}
    }
  },
  mounted () {
    this.visible = true
    this.initOwner = this.dp.team
  },
  computed: {
    referenceData () {
      return referenceData
    },
    outputRound () {
      return outputRound
    },
    leagueId () {
      return this.$store.state.league.yahooLeagueId
    },
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    seasonYear () {
      return this.$store.state.league.scadSettings.seasonYear
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    }
  },
  methods: {
    async savePick () {
      // console.log('[DRAFTPICK] Method - savePick()')
      if (getTeamGuid(this.dp.team) !== getTeamGuid(this.initOwner)) {
        let log = `${this.dp.team.name} (${this.dp.team.managers[0].nickname}) - ${moment().format('LLL')}`
        if (!this.dp.log) {
          this.dp.log = []
        }
        this.dp.log.push(log)
      }
      await this.$store.dispatch('draftPicks/saveDraftPick', this.dp)
      this.$emit('saved')
      this.close()
    },
    close () {
      this.$store.commit('dialog/editDraftPick')
      this.$emit('saved')
      this.visible = false
    }

  }
}
</script>

<style lang="scss" scoped></style>
