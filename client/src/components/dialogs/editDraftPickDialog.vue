<template lang="pug">
  q-dialog(v-if="edit.visable" v-model='edit.visable')
    q-card(style="width: 500px; max-width: 80vw;")
      q-card-section.row
        .col.text-center.text-h5.text-weight-bolder  {{ edit.dp.year }} - {{ outputRound(edit.dp.rd) }} Round
      q-card-section.row.items-center
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Pick:
          .col-3.q-pl-sm: q-select(dense v-model='edit.dp.pick' :options='referenceData.twelveTeams')
        .row.full-width
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Owner:
          .col.q-pl-sm: q-select(dense v-model='edit.dp.team' :options='filteredTeams' :display-value='displayTeam()')
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Original Owner:
          .col.q-ma-sm.text-grey {{edit.dp.originalTeam.name}}
        .row.full-width.q-mt-sm
          .col-3.text-body.text-right.text-weight-bold.q-ma-sm Comments:
          .col.q-ma-sm.text-grey: q-input(v-model='edit.dp.comments' filled type='textarea')
      q-card-actions.row.justify-around
        q-btn(flat label='Cancel' color='primary' @click="edit.visable = false")
        q-btn(flat label='Save' color='primary' @click="savePick()")
</template>

<script>

export default {
  name: 'EditDraftPickDialog',

  data () {
    return {
      emails: []
    }
  },
  computed: {

  },
  methods: {
    async savePick () {
      console.log('[DRAFTPICK] Method - savePick()')
      this.edit.visable = false
      await this.$store.dispatch('draftPicks/saveDraftPick', this.edit.dp)
    },
    displayPick () {
      if (this.edit.dp.pick) {
        return this.edit.dp.pick
      } else {
        return '-'
      }
    },
    displayTeam () {
      return this.edit.dp.team.name
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
