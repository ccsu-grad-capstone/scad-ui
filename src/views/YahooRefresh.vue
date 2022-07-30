<template lang="pug">
    .text-center.q-pa-lg
      .q-gutter-y-lg.q-pt-lg
        img(src="//scad-assets.s3.amazonaws.com/statics/yahoo-ff.png" style="height: 150px")
        .text-h3.text-weight-bold.text-primary
          | Welcome Back
        div
          .text-body2.text-faded
            | Yahoo requires a token to access it's info that's refreshed quite frequently. Looks like you need a refresh.
        .text-h6.text-weight-bold
          q-btn(label="Refresh Here" color="primary" size="lg" @click="refresh")

</template>

<script>
export default {
  name: 'YahooRefresh',
  methods: {
    async refresh () {
      await this.$store.dispatch('user/refreshToken')
      this.$router.push('/dashboard')
    }
  }
}

</script>
