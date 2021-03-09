<template lang="pug">
  q-page.flex.justify-center
    q-card.q-pa-md.q-ma-md(style="width: 100%")
      q-card-section
        .column.items-center
          img(src="//scad-assets.s3.amazonaws.com/statics/scad-logo_v1_700x500.png" style="width: 40%")
      .row.full-width.justify-center.items-center
        .column.col.items-center
          q-btn(label="Sign-In With Yahoo" dense="" no-caps="" color="primary" size="md" @click="loginWithYahoo")
</template>

<script>
import { getBaseURL } from '../utilities/enviornment'

export default {
  name: 'LandingPage',
  data () {
    return {}
  },
  methods: {
    loginWithYahoo () {
      console.log('[INDEX] - loginWithYahoo()')
      window.location = `${getBaseURL('NODE')}/auth/yahoo`
      // this.$store.dispatch('user/loginWithYahoo')
    }
  }
}

</script>
<style lang="sass">
.LP

  &__background
    background-color: #5f6323
</style>
