<template lang="pug">
  q-page.flex
    lite-league
    lite-my-team
    my-tokens
    q-separator
    q-card.q-ma-md
      q-card-section
      .text-h6
        | User details:
        .text-caption
        | {{user.user}}
      .column.items-center.text
        .row.full-width.justify-center.items-center.q-pt-lg
          .column.col.items-center
            q-btn(label='Register League' dense no-caps color='secondary' text-color='primary' size='md' @click="$router.push('register-league')")
        .row.full-width.justify-center.items-center.q-pt-lg
          .column.col.items-center
            q-btn(label='Login to SCAD' dense no-caps color='secondary' text-color='primary' size='md' @click="loginToScad")

</template>

<script>
import MyTokens from '../components/MyTokens'
import LiteMyTeam from '../components/LiteMyTeam'
import LiteLeague from '../components/LiteLeague'

export default {
  name: 'Dashboard',
  components: {
    'my-tokens': MyTokens,
    'lite-my-team': LiteMyTeam,
    'lite-league': LiteLeague
  },
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
