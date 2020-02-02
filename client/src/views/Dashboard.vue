<template lang="pug">
  q-page.flex
    q-card.q-pa-md.q-ma-md(style='width: 100%')
      q-card-section
        .text-h6
          | DASHBOARD
        .text
          | Welcome, {{tokens}}
      q-separator
      .column.items-center.text
        .row.full-width.justify-center.items-center
          .column.col.items-center
            | Looking to join an existing league?
            q-btn(label='Join Here' dense no-caps color='primary' size='md')
          .column.col.items-center
            | Looking to create a new league?
            q-btn(label='Refresh Token' dense no-caps color='secondary' text-color='primary' size='md' @click="refreshToken")

</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {}
  },
  mounted () {
    this.updateTokens()
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    loggedIn () {
      return this.user.active
    },
    tokens () {
      return this.user.tokens
    }
  },
  methods: {
    updateTokens () {
      console.log('[DASHBOARD] - updateTokens()')
      const tokens = {
        access_token: this.$route.query.access_token,
        refresh_token: this.$route.query.refresh_token,
        id_token: this.$route.query.id_token
      }
      this.$store.dispatch('user/updateTokens', tokens)
    },
    refreshToken () {
      this.$store.dispatch('user/refreshToken')
    }
  }
}
</script>

<style lang="scss" scoped></style>
