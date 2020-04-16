<template lang="pug">
  q-dialog(v-model='visable')
    q-card(style="width: 500px; max-width: 80vw;")
      q-card-section.row
        .col.text-center.text-h5.text-weight-bolder  {{ dp.year }} - {{ outputRound(dp.rd) }} Round
      q-card-section.row.items-center
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Pick:
          .col-3.q-pl-sm: q-select(dense v-model='dp.pick' :options='referenceData.twelveTeams')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Owner:
          .col.q-pl-sm: q-select(dense v-model='dp.team' :options='filteredTeams' :display-value='displayTeam()')
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Original Owner:
          .col.q-ma-sm.text-grey {{dp.originalTeam.name}}
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Comments:
          .col.q-ma-sm.text-grey: q-input(v-model='dp.comments' filled type='textarea')
      q-card-actions.row.justify-around
        q-btn(flat label='Cancel' color='primary' @click="close()")
        q-btn(flat label='Save' color='primary' @click="savePick()")
</template>

<script>
import referenceData from '../../utilities/referenceData'

export default {
  name: 'EditDraftPickDialog',
  props: {
    dp: Object
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
    leagueId () {
      return this.$store.state.league.yahooLeagueId
    },
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    }
  },
  methods: {
    async savePick () {
      // console.log('[DRAFTPICK] Method - savePick()')
      await this.$store.dispatch('draftPicks/saveDraftPick', this.dp)
      this.$store.dispatch('draftPicks/getDraftPicksByLeague', this.leagueId)
      this.$emit('saved')
      this.close()
    },
    close () {
      this.$store.commit('dialog/editDraftPick')
      this.visable = false
    },
    displayPick () {
      if (this.dp.pick) {
        return this.dp.pick
      } else {
        return '-'
      }
    },
    displayTeam () {
      return this.dp.team.name
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
    }

  }
}
</script>

<style lang="scss" scoped></style>
