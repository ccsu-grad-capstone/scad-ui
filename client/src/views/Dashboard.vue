<template lang="pug">
  q-page.flex
    q-card.q-pa-md.q-ma-md(style='width: 100%')
      q-card-section
        .text-h4
          | DASHBOARD
        .text-h6
          | tokens.access_token:
        .text
          | {{tokens.access_token}}
        .text-h6
          | tokens.refresh_token:
        .text
          |{{tokens.refresh_token}}
        .text-h6
          | tokens.id_token:
        .text
          | {{tokens.id_token}}
      q-separator
      .column.items-center.text
        .row.full-width.justify-center.items-center
          .column.col.items-center
            | Press to refresh the token
            q-btn(label='Refresh Token' dense no-caps color='secondary' text-color='primary' size='md' @click="refreshToken")

</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {}
  },
  mounted () {
    this.updateUser()
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
    updateUser () {
      console.log('[DASHBOARD] - updateUser()')
      const tokens = {
        access_token: this.$route.query.access_token,
        refresh_token: this.$route.query.refresh_token,
        id_token: this.$route.query.id_token
      }
      this.$store.dispatch('user/updateUser', tokens)
    },
    refreshToken () {
      this.$store.dispatch('user/refreshToken')
    }
  }
}
</script>

<style lang="scss" scoped></style>
