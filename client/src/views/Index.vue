<template lang="pug">
  q-page.flex.justify-center
    q-card.q-pa-md.q-ma-md(style="width: 100%")
      q-card-section
        .column.items-center
          img(src="../statics/scad-logo_v1_700x500.png" style="width: 40%")
      .row.full-width.justify-center.items-center
        .column.col.items-center
          q-btn(label="Sign-In With Yahoo" dense="" no-caps="" color="primary" size="md" @click="loginWithYahoo")
</template>

<script>
export default {
  name: 'LandingPage',
  data () {
    return {}
  },
  methods: {
    loginWithYahoo () {
      window.location = 'http://localhost:3000/auth/yahoo'
    }
  }
}

</script>
<style lang="sass">
.LP

  &__background
    background-color: #5f6323
</style>
