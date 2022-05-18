<template lang="pug">
  q-dialog(v-model='visable' @hide="triggerDialog()")
    q-card
      loading.q-pb-lg(v-if="uploading" :message="'Updating SCAD Player Salaries.  This may take a moment.'")
    q-card
        q-card-section.row
          .col.text-center.text-h5.text-weight-bolder  Import Updated Salaries
        q-card-section.row.items-center.justify-center
          q-uploader(
            label='Import Spreadsheet'
            boarderd
            :url="getUrl()"
            :headers="returnHeaders()"
            @start= "start"
            @added= "added"
            @failed= "failed"
            @uploaded= "uploaded"
            @finish= "finished"
          )

</template>

<script>
/* eslint-disable eqeqeq */
// import { getBaseURL } from '../../utilities/enviornment'
import Loading from '../Loading'

export default {
  name: 'ImportUpdatedSalaries',
  props: {},
  components: {
    'loading': Loading

  },
  data () {
    return {
      visable: false,
      uploading: false
    }
  },
  mounted () {
    this.visable = true
  },
  computed: {
    tokens () { return this.$store.state.user.tokens },
    league () {
      return this.$store.league
    },
    importUpdatedSalaries () {
      return this.$store.state.dialog.importUpdatedSalaries
    }
  },
  methods: {
    triggerDialog () {
      this.$store.commit('dialog/importUpdatedSalaries')
    },
    getUrl () {
      return `${process.env.VUE_APP_API}/scad/player/importUpdates`
    },
    start () {
      console.log('STARTED')
      this.uploading = true
    },
    added (info) {
      console.log('ADDED', info)
    },
    failed (info) {
      console.log('FAILED', info)
      this.uploading = false
    },
    uploaded (info) {
      console.log('UPLOADED', info)
    },
    finished () {
      console.log('FINISHED')
      this.uploading = false
    },
    returnHeaders () {
      return [
        { name: 'Authorization', value: process.env.VUE_APP_AUTH },
        { name: 'access_token', value: this.tokens.access_token },
        { name: 'id_token', value: this.tokens.id_token }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
