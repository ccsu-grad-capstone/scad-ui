<template lang="pug">
  q-page.flex
    q-card.q-pa-md.q-ma-md(style='width: 100%')
      q-card-section
        .text-h4
          | DASHBOARD
        .text-h6
          | tokens.access_token:
        .text-caption
          | {{tokens.access_token}}
        .text-h6
          | tokens.refresh_token:
        .text-caption
          |{{tokens.refresh_token}}
        .text-h6
          | tokens.id_token:
        .text-caption
          | {{tokens.id_token}}
        q-separator.q-mt-lg
        .text-h6
          | cookie.access_token:
        .text-caption
          | {{this.$cookies.get("access_token")}}
        .text-h6
          | cookie.refresh_token:
        .text-caption
          | {{this.$cookies.get("refresh_token")}}
        .text-h6
          | cookie.id_token:
        .text-caption
          | {{this.$cookies.get("id_token")}}
      q-separator
      .column.items-center.text
        .row.full-width.justify-center.items-center
          .column.col.items-center
            q-btn(label='Refresh Token' dense no-caps color='secondary' text-color='primary' size='md' @click="refreshToken")
        .row.full-width.justify-center.items-center.q-pt-lg
          .column.col.items-center
            q-btn(label='Register League' dense no-caps color='secondary' text-color='primary' size='md' @click="$router.push('register-league')")
        .row.full-width.justify-center.items-center.q-pt-lg
          .column.col.items-center
            q-btn(label='Login to SCAD' dense no-caps color='secondary' text-color='primary' size='md' @click="loginToScad")

</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {}
  },
  mounted () {

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
    refreshToken () {
      console.log('[DASHBOARD] - refreshToken()')
      this.$store.dispatch('user/refreshToken')
    },
    async loginToScad () {
      console.log('[DASHBOARD] - loginToScad()')
      await this.$store.dispatch('user/loginToScad')
    }
  }
}
</script>

<style lang="scss" scoped></style>
