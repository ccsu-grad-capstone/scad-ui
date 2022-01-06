<template lang="pug">
  q-page(v-if="loaded")
    .row.full-width.justify-center
      .col-xl-8.col-lg-8.col-md-8.col-sm-12.col-xs-12.q-px-xs
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-standings.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-golddiggers.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-honolulu-blue-myself.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-double-chubbd.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-muffin-stuffers.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-ligers.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-james.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-viva-los-vegas.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-la-golds.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-baby-chark.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-we-run-this-town.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-nick.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-stillmatic.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-draftpicks-2022.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-draftpicks-2023.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-draftpicks-2024.png" style="width: 100%")
        img(src="//scad-assets.s3.amazonaws.com/statics/offseason22/scad-capexceptions.png" style="width: 100%")

    offseason-dialog()

</template>

<script>
import notify from '../utilities/nofity'

export default {
  name: 'Offseason',
  components: {
  },
  data () {
    return {
      loaded: true
    }
  },
  async mounted () {
    notify.offseason()
    this.$store.commit('user/offseason')
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
a
  color: $info
  text-decoration: none
</style>
