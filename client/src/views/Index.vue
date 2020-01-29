<template lang="pug">
  q-page.flex.justify-center
    q-card.q-pa-md.q-ma-md(style="width: 100%")
      q-card-section
        .column.items-center
          img(src="../statics/scad-logo_v1_700x500.png" style="width: 40%")
      q-separator
      .row.full-width.justify-center.items-center
        .column.col.items-center Login with Yahoo:
          q-btn(label="Login Here" dense="" no-caps="" color="primary" size="md" @click="loginWithYahoo")

</template>

<script>
export default {
  name: 'LandingPage',
  data () {
    return {}
  },
  methods: {
    loginWithYahoo () {
      this.$store.dispatch('user/loginWithYahoo')
    }
  }
}

</script>
<style lang="sass">
.LP

  &__background
    background-color: #5f6323
</style>
