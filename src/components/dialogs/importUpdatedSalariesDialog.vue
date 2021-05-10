<template lang="pug">
  q-dialog(v-model='visable' @hide="triggerDialog()")
    q-card
      q-card-section.row
        .col.text-center.text-h5.text-weight-bolder  Import Updated Salaries
      q-card-section.row.items-center.justify-center
        q-uploader(
          label='Import Spreadsheet'
          boarderd
          :url="getUrl()"
          @start= "start"
          @added= "added"
          @failed= "failed"
          @uploaded= "uploaded"
          @finished= "finished"
        )

</template>

<script>
/* eslint-disable eqeqeq */

export default {
  name: 'ImportUpdatedSalaries',
  props: {

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
    league () { return this.$store.league },
    importUpdatedSalaries () { return this.$store.state.dialog.importUpdatedSalaries }
  },
  methods: {
    triggerDialog () {
      this.$store.commit('dialog/importUpdatedSalaries')
    },
    getUrl () {
      return `${process.env.VUE_APP_NODE_DEV}/scad/player/importUpdates`
    },
    start () {

    },
    added () {

    },
    failed () {

    },
    uploaded () {

    },
    finished () {

    }
  }
}
</script>

<style lang="scss" scoped></style>
