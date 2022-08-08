<template lang="pug">
    .text-center.q-pa-lg
      .q-gutter-y-lg.q-pt-lg
        img(src="//scad-assets.s3.amazonaws.com/statics/yahoo-ff.png" style="height: 150px")
        .text-h3.text-weight-bold.text-primary
          | Welcome Back
        div
          .text-body2.text-faded(v-if="loggedIn")
            | Yahoo requires a token to access it's info that's refreshed quite frequently. Looks like you need a refresh.
          .text-body2.text-faded(v-else)
            | It's been a while, please log back in.
        .text-h6.text-weight-bold
          q-btn(v-if="loggedIn" label="Refresh Here" color="primary" size="lg" @click="refresh()")
          q-btn(v-else label="Log In" color="primary" size="lg" @click="loginWithYahoo()")

</template>

<script>
export default {
  name: 'YahooRefresh',
  data () {
    return {
      loggedIn: true,
      processing: false
    }
  },
  computed: {
    league () {
      return this.$store.state.league
    },
    tokens () { return this.$store.state.user.tokens }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.tokens.access_token) {
        console.log('YahooRefresh - User not logged in.')
        this.loggedIn = false
      }
    },
    async refresh () {
      if (!this.league.isActive) {
        await this.$router.push('/dashboard')
        window.location.reload()
      }
      await this.$store.dispatch('user/refreshToken')
      this.$router.push('/dashboard')
    },
    loginWithYahoo () {
      console.log('loginWithYahoo()')
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      window.location = `${process.env.VUE_APP_API}/auth/yahoo`
    }
  }

}

</script>
